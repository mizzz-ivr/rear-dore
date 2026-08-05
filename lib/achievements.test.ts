import { describe, expect, it } from "vitest";
import type { Rarity } from "./game";
import {
  calculatePlayHistoryStats,
  createPlayHistoryEntry,
  upsertPlayHistory,
  type PlayHistoryEntry,
} from "./history";
import { calculateLocalAchievements, type LocalAchievementId } from "./achievements";

const defaultRarities: Rarity[] = ["SSR", "SR", "R", "N", "多数派"];

function createEntry(
  dateKey: string,
  totalScore = 1_500,
  rarities: readonly Rarity[] = defaultRarities,
): PlayHistoryEntry {
  return createPlayHistoryEntry({
    dateKey,
    questionSetId: `set-${dateKey}`,
    questionSetTitle: "実績テスト編",
    totalScore,
    playerTitle: "実績テスター",
    rarities,
  });
}

function calculate(
  entries: readonly PlayHistoryEntry[],
  currentDateKey = "2026-08-05",
) {
  const stats = calculatePlayHistoryStats(entries, currentDateKey);
  return calculateLocalAchievements(entries, stats);
}

function getAchievement(
  entries: readonly PlayHistoryEntry[],
  id: LocalAchievementId,
  currentDateKey = "2026-08-05",
) {
  const achievement = calculate(entries, currentDateKey).achievements.find(
    (item) => item.id === id,
  );

  if (!achievement) throw new Error(`実績${id}が見つかりません。`);
  return achievement;
}

describe("calculateLocalAchievements", () => {
  it("空履歴では6件すべてを未解除として返す", () => {
    const summary = calculate([]);

    expect(summary.unlockedCount).toBe(0);
    expect(summary.totalCount).toBe(6);
    expect(summary.achievements).toHaveLength(6);
    expect(summary.achievements.every((achievement) => !achievement.unlocked)).toBe(true);
  });

  it("1日分の履歴で初回プレイ実績だけを解除する", () => {
    const summary = calculate([createEntry("2026-08-05")]);

    expect(summary.unlockedCount).toBe(1);
    expect(getAchievement([createEntry("2026-08-05")], "first-play")).toMatchObject({
      unlocked: true,
      current: 1,
      target: 1,
      unit: "日",
    });
  });

  it("5日分の履歴で常連実績を解除する", () => {
    const entries = [
      createEntry("2026-08-05"),
      createEntry("2026-08-03"),
      createEntry("2026-08-01"),
      createEntry("2026-07-30"),
      createEntry("2026-07-28"),
    ];

    expect(getAchievement(entries, "five-play-days")).toMatchObject({
      unlocked: true,
      current: 5,
      target: 5,
    });
  });

  it("最長3日連続で連続実績を解除し、2日では解除しない", () => {
    const twoDays = [createEntry("2026-08-05"), createEntry("2026-08-04")];
    const threeDays = [...twoDays, createEntry("2026-08-03")];

    expect(getAchievement(twoDays, "three-day-streak")).toMatchObject({
      unlocked: false,
      current: 2,
    });
    expect(getAchievement(threeDays, "three-day-streak")).toMatchObject({
      unlocked: true,
      current: 3,
    });
  });

  it("履歴内のUR回答数を数えてUR実績を解除する", () => {
    const entries = [
      createEntry("2026-08-05", 1_500, ["UR", "SSR", "SR", "R", "多数派"]),
      createEntry("2026-08-04", 1_500, ["UR", "N", "N", "R", "多数派"]),
    ];

    expect(getAchievement(entries, "ur-discovery")).toMatchObject({
      unlocked: true,
      current: 2,
      target: 1,
      unit: "回",
    });
  });

  it("自己ベスト3,000点で高得点実績を解除し、2,999点では解除しない", () => {
    expect(getAchievement([createEntry("2026-08-05", 2_999)], "score-3000")).toMatchObject({
      unlocked: false,
      current: 2_999,
    });
    expect(getAchievement([createEntry("2026-08-05", 3_000)], "score-3000")).toMatchObject({
      unlocked: true,
      current: 3_000,
    });
  });

  it("1日の5問すべてで多数派を避けた場合に全問少数派実績を解除する", () => {
    const fourMinority = createEntry("2026-08-04");
    const fiveMinority = createEntry("2026-08-05", 2_500, ["UR", "SSR", "SR", "R", "N"]);

    expect(getAchievement([fourMinority], "all-minority")).toMatchObject({
      unlocked: false,
      current: 4,
    });
    expect(getAchievement([fourMinority, fiveMinority], "all-minority")).toMatchObject({
      unlocked: true,
      current: 5,
    });
  });

  it("同日再プレイは新しい結果だけを実績判定に使用する", () => {
    const oldEntry = createEntry("2026-08-05", 3_500, ["UR", "SSR", "SR", "R", "N"]);
    const newEntry = createEntry("2026-08-05", 1_500, defaultRarities);
    const normalized = upsertPlayHistory([oldEntry], newEntry);
    const summary = calculate(normalized);

    expect(summary.achievements.find((item) => item.id === "ur-discovery")?.unlocked).toBe(false);
    expect(summary.achievements.find((item) => item.id === "score-3000")?.unlocked).toBe(false);
    expect(summary.achievements.find((item) => item.id === "all-minority")?.unlocked).toBe(false);
    expect(summary.achievements.find((item) => item.id === "five-play-days")?.current).toBe(1);
  });

  it("条件をすべて満たした履歴では6件すべてを解除する", () => {
    const entries = [
      createEntry("2026-08-05", 3_500, ["UR", "SSR", "SR", "R", "N"]),
      createEntry("2026-08-04"),
      createEntry("2026-08-03"),
      createEntry("2026-08-01"),
      createEntry("2026-07-30"),
    ];
    const summary = calculate(entries);

    expect(summary.unlockedCount).toBe(6);
    expect(summary.achievements.every((achievement) => achievement.unlocked)).toBe(true);
  });
});
