import { describe, expect, it } from "vitest";
import {
  getDailyQuestionSet,
  getPlayerTitle,
  getRarity,
  getScore,
  questionSets,
} from "./game";

describe("getDailyQuestionSet", () => {
  it.each([
    ["2026-07-27", "daily-03-choice"],
    ["2026-07-28", "daily-01-imagination"],
    ["2026-07-29", "daily-02-everyday"],
    ["2026-08-07", "daily-02-everyday"],
  ] as const)("旧ローテーションの%sを維持する", (dateKey, expected) => {
    expect(getDailyQuestionSet(dateKey).id).toBe(expected);
  });

  it.each([
    ["2026-08-08", "daily-03-choice"],
    ["2026-08-09", "daily-04-digital"],
    ["2026-08-10", "daily-05-food"],
    ["2026-08-11", "daily-06-outing"],
    ["2026-08-12", "daily-07-odd"],
    ["2026-08-13", "daily-01-imagination"],
    ["2026-08-14", "daily-02-everyday"],
  ] as const)("8月14日までの固定7日サイクル%sを維持する", (dateKey, expected) => {
    expect(getDailyQuestionSet(dateKey).id).toBe(expected);
  });

  it.each([
    ["2026-08-15", "daily-08-work-study"],
    ["2026-08-16", "daily-09-hobbies"],
    ["2026-08-17", "daily-10-future-tech"],
    ["2026-08-18", "daily-03-choice"],
    ["2026-08-19", "daily-04-digital"],
    ["2026-08-20", "daily-05-food"],
    ["2026-08-21", "daily-06-outing"],
    ["2026-08-22", "daily-07-odd"],
    ["2026-08-23", "daily-01-imagination"],
    ["2026-08-24", "daily-02-everyday"],
  ] as const)("8月24日までの拡張10日サイクル%sを維持する", (dateKey, expected) => {
    expect(getDailyQuestionSet(dateKey).id).toBe(expected);
  });

  it.each([
    ["2026-08-25", "daily-08-work-study"],
    ["2026-08-26", "daily-11-transport"],
    ["2026-08-27", "daily-12-shopping-money"],
    ["2026-08-28", "daily-13-communication"],
    ["2026-08-29", "daily-14-season-events"],
    ["2026-08-30", "daily-15-entertainment"],
    ["2026-08-31", "daily-09-hobbies"],
    ["2026-09-01", "daily-10-future-tech"],
    ["2026-09-02", "daily-03-choice"],
    ["2026-09-03", "daily-04-digital"],
    ["2026-09-04", "daily-05-food"],
    ["2026-09-05", "daily-06-outing"],
    ["2026-09-06", "daily-07-odd"],
    ["2026-09-07", "daily-01-imagination"],
    ["2026-09-08", "daily-02-everyday"],
    ["2026-09-09", "daily-08-work-study"],
  ] as const)("15日サイクル%sを割り当てる", (dateKey, expected) => {
    expect(getDailyQuestionSet(dateKey).id).toBe(expected);
  });

  it("15セット・75問を登録する", () => {
    expect(questionSets).toHaveLength(15);
    expect(questionSets.flatMap((set) => set.questions)).toHaveLength(75);
    expect(questionSets.map((set) => set.id)).toEqual([
      "daily-01-imagination",
      "daily-02-everyday",
      "daily-03-choice",
      "daily-04-digital",
      "daily-05-food",
      "daily-06-outing",
      "daily-07-odd",
      "daily-08-work-study",
      "daily-09-hobbies",
      "daily-10-future-tech",
      "daily-11-transport",
      "daily-12-shopping-money",
      "daily-13-communication",
      "daily-14-season-events",
      "daily-15-entertainment",
    ]);
  });

  it.each(["", "2026/07/28", "2026-02-30"])("不正な日付%sを拒否する", (dateKey) => {
    expect(() => getDailyQuestionSet(dateKey)).toThrow(RangeError);
  });
});

describe("getRarity", () => {
  it.each([
    [0, "UR"], [1, "UR"], [1.01, "SSR"], [3, "SSR"], [3.01, "SR"], [8, "SR"],
    [8.01, "R"], [15, "R"], [15.01, "N"], [30, "N"], [30.01, "多数派"], [100, "多数派"],
  ] as const)("%s%%を%sと判定する", (percentage, expected) => {
    expect(getRarity(percentage)).toBe(expected);
  });

  it.each([-0.01, 100.01, Number.NaN, Number.POSITIVE_INFINITY])("不正割合%sを拒否する", (percentage) => {
    expect(() => getRarity(percentage)).toThrow(RangeError);
  });
});

describe("getScore", () => {
  it("レア度に応じた点数を返す", () => {
    expect([0.5, 2, 5, 12, 20, 50].map(getScore)).toEqual([1000, 500, 300, 150, 75, 20]);
  });
});

describe("getPlayerTitle", () => {
  it.each([
    [0, "多数派からの旅人"],
    [900, "逆張りの探索者"],
    [1800, "人類の裏を読む者"],
    [3000, "少数派の預言者"],
  ] as const)("%s点で称号を返す", (score, expected) => {
    expect(getPlayerTitle(score)).toBe(expected);
  });
});
