import { describe, expect, it } from "vitest";
import type { Rarity } from "./game";
import {
  calculateCurrentStreak,
  createPlayHistoryEntry,
  restorePlayHistory,
  serializePlayHistory,
  upsertPlayHistory,
  type PlayHistoryEntry,
} from "./history";

const rarities: Rarity[] = ["UR", "SSR", "SR", "R", "多数派"];

function createEntry(dateKey: string, totalScore = 1_990): PlayHistoryEntry {
  return createPlayHistoryEntry({
    dateKey,
    questionSetId: `set-${dateKey}`,
    questionSetTitle: "もしも編",
    totalScore,
    playerTitle: "人類の裏を読む者",
    rarities,
  });
}

function formatDateKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

describe("restorePlayHistory", () => {
  it("保存した履歴を日付降順で復元する", () => {
    const rawValue = serializePlayHistory([
      createEntry("2026-07-26"),
      createEntry("2026-07-28"),
      createEntry("2026-07-27"),
    ]);

    expect(restorePlayHistory(rawValue).map((entry) => entry.dateKey)).toEqual([
      "2026-07-28",
      "2026-07-27",
      "2026-07-26",
    ]);
  });

  it("不正な項目だけを破棄して有効な履歴を残す", () => {
    const validEntry = createEntry("2026-07-28");
    const rawValue = JSON.stringify({
      version: 1,
      entries: [
        validEntry,
        { ...validEntry, dateKey: "2026-02-30" },
        { ...validEntry, totalScore: -1 },
        { ...validEntry, rarities: ["UR", "UNKNOWN", "SR", "R", "N"] },
      ],
    });

    expect(restorePlayHistory(rawValue)).toEqual([validEntry]);
  });

  it.each([
    null,
    "{broken-json",
    JSON.stringify([]),
    JSON.stringify({ version: 0, entries: [] }),
    JSON.stringify({ version: 1, entries: "invalid" }),
  ])("壊れた保存形式は空の履歴として扱う", (rawValue) => {
    expect(restorePlayHistory(rawValue)).toEqual([]);
  });
});

describe("upsertPlayHistory", () => {
  it("同じ日付の結果を新しい内容で上書きする", () => {
    const oldEntry = createEntry("2026-07-28", 900);
    const newEntry = createEntry("2026-07-28", 3_000);

    expect(upsertPlayHistory([oldEntry], newEntry)).toEqual([newEntry]);
  });

  it("31件以上は新しい30件だけを保持する", () => {
    const start = Date.UTC(2026, 6, 1);
    const entries = Array.from({ length: 31 }, (_, index) =>
      createEntry(formatDateKey(start + index * 86_400_000), index),
    );

    const restored = restorePlayHistory(serializePlayHistory(entries));

    expect(restored).toHaveLength(30);
    expect(restored[0].dateKey).toBe("2026-07-31");
    expect(restored.at(-1)?.dateKey).toBe("2026-07-02");
  });
});

describe("calculateCurrentStreak", () => {
  it("今日から連続するプレイ日数を数える", () => {
    const entries = [
      createEntry("2026-07-28"),
      createEntry("2026-07-27"),
      createEntry("2026-07-26"),
    ];

    expect(calculateCurrentStreak(entries, "2026-07-28")).toBe(3);
  });

  it("今日未プレイなら昨日から連続する日数を数える", () => {
    const entries = [createEntry("2026-07-27"), createEntry("2026-07-26")];

    expect(calculateCurrentStreak(entries, "2026-07-28")).toBe(2);
  });

  it("空白日がある位置で連続日数を止める", () => {
    const entries = [createEntry("2026-07-28"), createEntry("2026-07-26")];

    expect(calculateCurrentStreak(entries, "2026-07-28")).toBe(1);
  });

  it("今日と昨日のどちらにも履歴がなければ0日とする", () => {
    expect(calculateCurrentStreak([createEntry("2026-07-26")], "2026-07-28")).toBe(0);
  });

  it("年末年始をまたいで連続日数を数える", () => {
    const entries = [createEntry("2027-01-01"), createEntry("2026-12-31")];

    expect(calculateCurrentStreak(entries, "2027-01-01")).toBe(2);
  });

  it("不正な基準日を拒否する", () => {
    expect(() => calculateCurrentStreak([], "2026-02-30")).toThrow(RangeError);
  });
});
