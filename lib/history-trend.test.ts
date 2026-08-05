import { describe, expect, it } from "vitest";
import type { Rarity } from "./game";
import {
  calculatePlayHistoryTrend,
  createPlayHistoryEntry,
  type PlayHistoryEntry,
} from "./history";

const rarities: Rarity[] = ["UR", "SSR", "SR", "R", "多数派"];

function createEntry(dateKey: string, totalScore: number): PlayHistoryEntry {
  return createPlayHistoryEntry({
    dateKey,
    questionSetId: `set-${dateKey}`,
    questionSetTitle: "もしも編",
    totalScore,
    playerTitle: "人類の裏を読む者",
    rarities,
  });
}

describe("calculatePlayHistoryTrend", () => {
  it("空履歴では空の推移を返す", () => {
    expect(calculatePlayHistoryTrend([])).toEqual({
      points: [],
      latestChange: null,
      minScore: 0,
      maxScore: 0,
    });
  });

  it("1件だけの場合は中央へ配置して前回比を持たない", () => {
    expect(calculatePlayHistoryTrend([createEntry("2026-08-05", 2_400)])).toEqual({
      points: [
        {
          dateKey: "2026-08-05",
          totalScore: 2_400,
          position: 0.5,
          scoreRatio: 0.5,
        },
      ],
      latestChange: null,
      minScore: 2_400,
      maxScore: 2_400,
    });
  });

  it("日付順が不定でも古い日付から新しい日付へ並べる", () => {
    const trend = calculatePlayHistoryTrend([
      createEntry("2026-08-05", 2_000),
      createEntry("2026-08-03", 1_000),
      createEntry("2026-08-04", 3_000),
    ]);

    expect(trend.points).toEqual([
      {
        dateKey: "2026-08-03",
        totalScore: 1_000,
        position: 0,
        scoreRatio: 0,
      },
      {
        dateKey: "2026-08-04",
        totalScore: 3_000,
        position: 0.5,
        scoreRatio: 1,
      },
      {
        dateKey: "2026-08-05",
        totalScore: 2_000,
        position: 1,
        scoreRatio: 0.5,
      },
    ]);
    expect(trend.latestChange).toBe(-1_000);
    expect(trend.minScore).toBe(1_000);
    expect(trend.maxScore).toBe(3_000);
  });

  it("同日重複は後の履歴で上書きする", () => {
    const trend = calculatePlayHistoryTrend([
      createEntry("2026-08-04", 900),
      createEntry("2026-08-05", 1_500),
      createEntry("2026-08-04", 2_000),
    ]);

    expect(trend.points.map(({ dateKey, totalScore }) => ({ dateKey, totalScore }))).toEqual([
      { dateKey: "2026-08-04", totalScore: 2_000 },
      { dateKey: "2026-08-05", totalScore: 1_500 },
    ]);
    expect(trend.latestChange).toBe(-500);
  });

  it("直近7件だけを古い順で返す", () => {
    const entries = Array.from({ length: 8 }, (_, index) =>
      createEntry(`2026-08-${String(index + 1).padStart(2, "0")}`, (index + 1) * 100),
    );

    const trend = calculatePlayHistoryTrend(entries);

    expect(trend.points).toHaveLength(7);
    expect(trend.points[0].dateKey).toBe("2026-08-02");
    expect(trend.points.at(-1)?.dateKey).toBe("2026-08-08");
    expect(trend.points[0].position).toBe(0);
    expect(trend.points.at(-1)?.position).toBe(1);
    expect(trend.latestChange).toBe(100);
  });

  it("同点が続く場合は中央へ配置して増減なしとする", () => {
    const trend = calculatePlayHistoryTrend([
      createEntry("2026-08-04", 2_000),
      createEntry("2026-08-05", 2_000),
    ]);

    expect(trend.points.map((point) => point.scoreRatio)).toEqual([0.5, 0.5]);
    expect(trend.latestChange).toBe(0);
  });

  it("指定件数で切り出し、上昇を正数で返す", () => {
    const trend = calculatePlayHistoryTrend(
      [
        createEntry("2026-08-03", 500),
        createEntry("2026-08-04", 1_000),
        createEntry("2026-08-05", 1_800),
      ],
      2,
    );

    expect(trend.points.map((point) => point.dateKey)).toEqual([
      "2026-08-04",
      "2026-08-05",
    ]);
    expect(trend.latestChange).toBe(800);
  });

  it.each([0, 31, 1.5, Number.NaN])("不正な表示件数%sを拒否する", (limit) => {
    expect(() => calculatePlayHistoryTrend([], limit)).toThrow(RangeError);
  });
});
