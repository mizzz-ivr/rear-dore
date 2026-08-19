import { describe, expect, it } from "vitest";
import type { QuestionSet } from "./game";
import {
  recordPracticeResult,
  restorePracticeRecords,
  serializePracticeRecords,
  type PracticeThemeRecord,
} from "./practice-records";

const questionSets: QuestionSet[] = [
  { id: "theme-a", title: "テーマA", questions: [] },
  { id: "theme-b", title: "テーマB", questions: [] },
];

describe("restorePracticeRecords", () => {
  it("保存値がない場合は空配列を返す", () => {
    expect(restorePracticeRecords(null, questionSets)).toEqual([]);
  });

  it.each(["{", "[]", JSON.stringify({ version: 2, records: [] })])(
    "不正な保存形式を安全に無視する",
    (rawValue) => {
      expect(restorePracticeRecords(rawValue, questionSets)).toEqual([]);
    },
  );

  it("未知テーマIDと範囲外の値を除外する", () => {
    const rawValue = JSON.stringify({
      version: 1,
      records: [
        { questionSetId: "theme-a", playCount: 2, bestScore: 1200, bestRareAnswerCount: 3 },
        { questionSetId: "unknown", playCount: 3, bestScore: 900, bestRareAnswerCount: 2 },
        { questionSetId: "theme-b", playCount: 0, bestScore: 500, bestRareAnswerCount: 1 },
        { questionSetId: "theme-b", playCount: 1, bestScore: 6000, bestRareAnswerCount: 1 },
      ],
    });

    expect(restorePracticeRecords(rawValue, questionSets)).toEqual([
      { questionSetId: "theme-a", playCount: 2, bestScore: 1200, bestRareAnswerCount: 3 },
    ]);
  });

  it("重複テーマは過大加算せず各最大値へ正規化する", () => {
    const rawValue = JSON.stringify({
      version: 1,
      records: [
        { questionSetId: "theme-a", playCount: 3, bestScore: 800, bestRareAnswerCount: 4 },
        { questionSetId: "theme-a", playCount: 5, bestScore: 1400, bestRareAnswerCount: 2 },
      ],
    });

    expect(restorePracticeRecords(rawValue, questionSets)).toEqual([
      { questionSetId: "theme-a", playCount: 5, bestScore: 1400, bestRareAnswerCount: 4 },
    ]);
  });
});

describe("recordPracticeResult", () => {
  it("初回練習の記録を作成する", () => {
    const update = recordPracticeResult(
      [],
      { questionSetId: "theme-a", totalScore: 1100, rareAnswerCount: 2 },
      questionSets,
    );

    expect(update.previousRecord).toBeNull();
    expect(update.record).toEqual({
      questionSetId: "theme-a",
      playCount: 1,
      bestScore: 1100,
      bestRareAnswerCount: 2,
    });
    expect(update.records).toEqual([update.record]);
  });

  it("再挑戦で練習回数を増やし自己ベストを更新する", () => {
    const existing: PracticeThemeRecord[] = [
      { questionSetId: "theme-a", playCount: 2, bestScore: 900, bestRareAnswerCount: 2 },
    ];

    const update = recordPracticeResult(
      existing,
      { questionSetId: "theme-a", totalScore: 1500, rareAnswerCount: 4 },
      questionSets,
    );

    expect(update.record).toEqual({
      questionSetId: "theme-a",
      playCount: 3,
      bestScore: 1500,
      bestRareAnswerCount: 4,
    });
  });

  it("低い再挑戦結果で自己ベストを下げない", () => {
    const existing: PracticeThemeRecord[] = [
      { questionSetId: "theme-a", playCount: 4, bestScore: 1800, bestRareAnswerCount: 4 },
    ];

    expect(
      recordPracticeResult(
        existing,
        { questionSetId: "theme-a", totalScore: 700, rareAnswerCount: 1 },
        questionSets,
      ).record,
    ).toEqual({
      questionSetId: "theme-a",
      playCount: 5,
      bestScore: 1800,
      bestRareAnswerCount: 4,
    });
  });

  it("別テーマの記録を変更しない", () => {
    const existing: PracticeThemeRecord[] = [
      { questionSetId: "theme-a", playCount: 2, bestScore: 1000, bestRareAnswerCount: 2 },
      { questionSetId: "theme-b", playCount: 7, bestScore: 2000, bestRareAnswerCount: 5 },
    ];

    const update = recordPracticeResult(
      existing,
      { questionSetId: "theme-a", totalScore: 1200, rareAnswerCount: 3 },
      questionSets,
    );

    expect(update.records.find((record) => record.questionSetId === "theme-b")).toEqual(
      existing[1],
    );
  });

  it.each([
    [{ questionSetId: "unknown", totalScore: 1000, rareAnswerCount: 2 }, "questionSetId"],
    [{ questionSetId: "theme-a", totalScore: -1, rareAnswerCount: 2 }, "totalScore"],
    [{ questionSetId: "theme-a", totalScore: 1000, rareAnswerCount: 6 }, "rareAnswerCount"],
  ] as const)("不正な入力%sを拒否する", (params, message) => {
    expect(() => recordPracticeResult([], params, questionSets)).toThrow(message);
  });
});

describe("serializePracticeRecords", () => {
  it("正規化した値を復元できる", () => {
    const records: PracticeThemeRecord[] = [
      { questionSetId: "theme-b", playCount: 3, bestScore: 1300, bestRareAnswerCount: 3 },
      { questionSetId: "theme-a", playCount: 1, bestScore: 800, bestRareAnswerCount: 1 },
    ];

    expect(restorePracticeRecords(serializePracticeRecords(records, questionSets), questionSets)).toEqual([
      records[1],
      records[0],
    ]);
  });
});
