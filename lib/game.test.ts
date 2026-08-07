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
    ["2026-07-30", "daily-03-choice"],
    ["2026-07-31", "daily-01-imagination"],
    ["2026-08-01", "daily-02-everyday"],
    ["2026-08-02", "daily-03-choice"],
    ["2026-08-03", "daily-01-imagination"],
    ["2026-08-04", "daily-02-everyday"],
    ["2026-08-05", "daily-03-choice"],
    ["2026-08-06", "daily-01-imagination"],
    ["2026-08-07", "daily-02-everyday"],
  ] as const)("旧ローテーションの%sを%sのまま維持する", (dateKey, questionSetId) => {
    expect(getDailyQuestionSet(dateKey).id).toBe(questionSetId);
  });

  it.each([
    ["2026-08-08", "daily-03-choice"],
    ["2026-08-09", "daily-04-digital"],
    ["2026-08-10", "daily-05-food"],
    ["2026-08-11", "daily-06-outing"],
    ["2026-08-12", "daily-07-odd"],
    ["2026-08-13", "daily-01-imagination"],
    ["2026-08-14", "daily-02-everyday"],
    ["2026-08-15", "daily-03-choice"],
  ] as const)("固定7日サイクルの%sを%sへ割り当てる", (dateKey, questionSetId) => {
    expect(getDailyQuestionSet(dateKey).id).toBe(questionSetId);
  });

  it("7セット・35問のコンテンツを登録する", () => {
    expect(questionSets).toHaveLength(7);
    expect(questionSets.flatMap((questionSet) => questionSet.questions)).toHaveLength(35);
    expect(questionSets.map((questionSet) => questionSet.id)).toEqual([
      "daily-01-imagination",
      "daily-02-everyday",
      "daily-03-choice",
      "daily-04-digital",
      "daily-05-food",
      "daily-06-outing",
      "daily-07-odd",
    ]);
  });

  it.each(["", "2026/07/28", "2026-02-30", "not-a-date"])(
    "不正な日付キー%sを拒否する",
    (dateKey) => {
      expect(() => getDailyQuestionSet(dateKey)).toThrow(RangeError);
    },
  );
});

describe("getRarity", () => {
  it.each([
    [0, "UR"],
    [1, "UR"],
    [1.01, "SSR"],
    [3, "SSR"],
    [3.01, "SR"],
    [8, "SR"],
    [8.01, "R"],
    [15, "R"],
    [15.01, "N"],
    [30, "N"],
    [30.01, "多数派"],
    [100, "多数派"],
  ] as const)("%s%%を%sと判定する", (percentage, expected) => {
    expect(getRarity(percentage)).toBe(expected);
  });

  it.each([-0.01, 100.01, Number.NaN, Number.POSITIVE_INFINITY])(
    "不正な割合%sを拒否する",
    (percentage) => {
      expect(() => getRarity(percentage)).toThrow(RangeError);
    },
  );
});

describe("getScore", () => {
  it("レア度に応じた点数を返す", () => {
    expect(getScore(0.5)).toBe(1000);
    expect(getScore(2)).toBe(500);
    expect(getScore(5)).toBe(300);
    expect(getScore(12)).toBe(150);
    expect(getScore(20)).toBe(75);
    expect(getScore(50)).toBe(20);
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
