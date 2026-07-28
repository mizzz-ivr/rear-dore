import { describe, expect, it } from "vitest";
import { calculateResult, questions } from "./game";
import {
  createDailyProgress,
  getJapanDateKey,
  restoreDailyProgress,
  serializeDailyProgress,
} from "./progress";

const dateKey = "2026-07-28";
const firstAnswer = calculateResult(questions[0].id, questions[0].choices[3]);
const secondAnswer = calculateResult(questions[1].id, questions[1].choices[4]);

function serialize(value: unknown): string {
  return JSON.stringify(value);
}

describe("getJapanDateKey", () => {
  it("日本時間の日付切り替わりを判定する", () => {
    expect(getJapanDateKey(new Date("2026-07-27T14:59:59.000Z"))).toBe("2026-07-27");
    expect(getJapanDateKey(new Date("2026-07-27T15:00:00.000Z"))).toBe("2026-07-28");
  });

  it("不正な日時を拒否する", () => {
    expect(() => getJapanDateKey(new Date(Number.NaN))).toThrow(RangeError);
  });
});

describe("restoreDailyProgress", () => {
  it("回答直後の結果表示を復元する", () => {
    const stored = createDailyProgress({
      dateKey,
      questions,
      answers: [firstAnswer],
      questionIndex: 0,
      completed: false,
    });

    expect(restoreDailyProgress(serializeDailyProgress(stored), dateKey, questions)).toEqual({
      answers: [firstAnswer],
      questionIndex: 0,
      selectedChoiceId: firstAnswer.choiceId,
      completed: false,
    });
  });

  it("次の未回答問題を復元する", () => {
    const stored = createDailyProgress({
      dateKey,
      questions,
      answers: [firstAnswer],
      questionIndex: 1,
      completed: false,
    });

    expect(restoreDailyProgress(serializeDailyProgress(stored), dateKey, questions)).toEqual({
      answers: [firstAnswer],
      questionIndex: 1,
      selectedChoiceId: null,
      completed: false,
    });
  });

  it("全問完了後の結果画面を復元する", () => {
    const answers = questions.map((question) => calculateResult(question.id, question.choices[0]));
    const stored = createDailyProgress({
      dateKey,
      questions,
      answers,
      questionIndex: questions.length - 1,
      completed: true,
    });

    expect(restoreDailyProgress(serializeDailyProgress(stored), dateKey, questions)).toEqual({
      answers,
      questionIndex: questions.length - 1,
      selectedChoiceId: null,
      completed: true,
    });
  });

  it.each([
    null,
    "{broken-json",
    serialize({ version: 1, dateKey: "2026-07-27", phase: "question", activeQuestionId: questions[0].id, answers: [] }),
    serialize({ version: 1, dateKey, phase: "question", activeQuestionId: "unknown", answers: [] }),
    serialize({
      version: 1,
      dateKey,
      phase: "result",
      activeQuestionId: questions[0].id,
      answers: [{ questionId: questions[0].id, choiceId: "unknown" }],
    }),
    serialize({
      version: 1,
      dateKey,
      phase: "question",
      activeQuestionId: questions[1].id,
      answers: [
        { questionId: questions[1].id, choiceId: secondAnswer.choiceId },
      ],
    }),
  ])("不正または不整合な保存値を破棄する", (rawValue) => {
    expect(restoreDailyProgress(rawValue, dateKey, questions)).toBeNull();
  });
});
