import { describe, expect, it } from "vitest";
import {
  getDailyQuestionSet,
  getPlayerTitle,
  getRarity,
  getScore,
  questionSets,
} from "./game";

describe("getDailyQuestionSet", () => {
  it("日本時間の日付ごとに問題セットを順番に切り替える", () => {
    expect(getDailyQuestionSet("2026-07-28").id).toBe(questionSets[0].id);
    expect(getDailyQuestionSet("2026-07-29").id).toBe(questionSets[1].id);
    expect(getDailyQuestionSet("2026-07-30").id).toBe(questionSets[2].id);
    expect(getDailyQuestionSet("2026-07-31").id).toBe(questionSets[0].id);
  });

  it("基準日より前の日付も決定的に選択する", () => {
    expect(getDailyQuestionSet("2026-07-27").id).toBe(questionSets[2].id);
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
