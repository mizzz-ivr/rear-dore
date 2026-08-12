import { describe, expect, it } from "vitest";
import type { Rarity } from "./game";
import type { PlayHistoryEntry } from "./history";
import { calculateWeeklyChallengeSummary } from "./weekly-challenges";

const DEFAULT_RARITIES: readonly Rarity[] = ["R", "N", "多数派", "R", "N"];

function createEntry(
  dateKey: string,
  totalScore = 1_000,
  rarities: readonly Rarity[] = DEFAULT_RARITIES,
): PlayHistoryEntry {
  return {
    dateKey,
    questionSetId: `set-${dateKey}`,
    questionSetTitle: dateKey,
    totalScore,
    playerTitle: "テスト",
    rarities: [...rarities],
  };
}

function getChallenge(
  entries: readonly PlayHistoryEntry[],
  currentDateKey: string,
  id: "play-days" | "rare-answers" | "total-score",
) {
  const summary = calculateWeeklyChallengeSummary(entries, currentDateKey);
  const challenge = summary.challenges.find((item) => item.id === id);
  if (!challenge) throw new Error(`challenge ${id} not found`);
  return challenge;
}

describe("calculateWeeklyChallengeSummary", () => {
  it("履歴がなければすべて未達成になる", () => {
    const summary = calculateWeeklyChallengeSummary([], "2026-08-12");

    expect(summary.completedCount).toBe(0);
    expect(summary.totalCount).toBe(3);
    expect(summary.allCompleted).toBe(false);
    expect(summary.challenges.map((challenge) => challenge.current)).toEqual([0, 0, 0]);
  });

  it("月曜日を週の開始日にする", () => {
    const summary = calculateWeeklyChallengeSummary([], "2026-08-10");

    expect(summary.weekStartDateKey).toBe("2026-08-10");
    expect(summary.weekEndDateKey).toBe("2026-08-16");
  });

  it("日曜日も同じ週として扱う", () => {
    const summary = calculateWeeklyChallengeSummary([], "2026-08-16");

    expect(summary.weekStartDateKey).toBe("2026-08-10");
    expect(summary.weekEndDateKey).toBe("2026-08-16");
  });

  it("月をまたぐ週を正しく算出する", () => {
    const summary = calculateWeeklyChallengeSummary([], "2026-09-02");

    expect(summary.weekStartDateKey).toBe("2026-08-31");
    expect(summary.weekEndDateKey).toBe("2026-09-06");
  });

  it("年をまたぐ週を正しく算出する", () => {
    const summary = calculateWeeklyChallengeSummary([], "2027-01-01");

    expect(summary.weekStartDateKey).toBe("2026-12-28");
    expect(summary.weekEndDateKey).toBe("2027-01-03");
  });

  it("現在週より前と現在日より未来の履歴を除外する", () => {
    const entries = [
      createEntry("2026-08-09", 4_000),
      createEntry("2026-08-10", 1_000),
      createEntry("2026-08-12", 2_000),
      createEntry("2026-08-13", 5_000),
    ];

    expect(getChallenge(entries, "2026-08-12", "play-days").current).toBe(2);
    expect(getChallenge(entries, "2026-08-12", "total-score").current).toBe(3_000);
  });

  it("同日の重複履歴は後の1件だけを集計する", () => {
    const entries = [
      createEntry("2026-08-10", 1_000, ["SR", "SR", "R", "R", "R"]),
      createEntry("2026-08-10", 2_500, ["UR", "SSR", "SR", "R", "R"]),
    ];

    expect(getChallenge(entries, "2026-08-12", "play-days").current).toBe(1);
    expect(getChallenge(entries, "2026-08-12", "rare-answers").current).toBe(3);
    expect(getChallenge(entries, "2026-08-12", "total-score").current).toBe(2_500);
  });

  it("SR以上はUR・SSR・SRだけを数える", () => {
    const entries = [createEntry("2026-08-10", 1_000, ["UR", "SSR", "SR", "R", "N"])];

    expect(getChallenge(entries, "2026-08-12", "rare-answers").current).toBe(3);
  });

  it("3日プレイでプレイ日数チャレンジを達成する", () => {
    const entries = [
      createEntry("2026-08-10"),
      createEntry("2026-08-11"),
      createEntry("2026-08-12"),
    ];

    const challenge = getChallenge(entries, "2026-08-12", "play-days");
    expect(challenge.current).toBe(3);
    expect(challenge.completed).toBe(true);
  });

  it("SR以上6回答でレア回答チャレンジを達成する", () => {
    const entries = [
      createEntry("2026-08-10", 1_000, ["UR", "SSR", "SR", "R", "N"]),
      createEntry("2026-08-11", 1_000, ["UR", "SSR", "SR", "R", "N"]),
    ];

    const challenge = getChallenge(entries, "2026-08-12", "rare-answers");
    expect(challenge.current).toBe(6);
    expect(challenge.completed).toBe(true);
  });

  it("週間合計6,000点でスコアチャレンジを達成する", () => {
    const entries = [createEntry("2026-08-10", 2_999), createEntry("2026-08-11", 3_001)];

    const challenge = getChallenge(entries, "2026-08-12", "total-score");
    expect(challenge.current).toBe(6_000);
    expect(challenge.completed).toBe(true);
  });

  it("3条件を満たすと週間コンプリートになる", () => {
    const rareRarities: readonly Rarity[] = ["UR", "SSR", "SR", "R", "N"];
    const entries = [
      createEntry("2026-08-10", 2_000, rareRarities),
      createEntry("2026-08-11", 2_000, rareRarities),
      createEntry("2026-08-12", 2_000, DEFAULT_RARITIES),
    ];

    const summary = calculateWeeklyChallengeSummary(entries, "2026-08-12");
    expect(summary.completedCount).toBe(3);
    expect(summary.allCompleted).toBe(true);
  });

  it("不正な履歴日付は安全に無視する", () => {
    const invalidEntry = { ...createEntry("2026-08-10"), dateKey: "2026-02-30" };

    const summary = calculateWeeklyChallengeSummary([invalidEntry], "2026-08-12");
    expect(summary.challenges.map((challenge) => challenge.current)).toEqual([0, 0, 0]);
  });

  it("不正なcurrentDateKeyを拒否する", () => {
    expect(() => calculateWeeklyChallengeSummary([], "2026-02-30")).toThrow(RangeError);
  });
});
