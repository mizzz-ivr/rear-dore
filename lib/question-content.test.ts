import { describe, expect, it } from "vitest";
import { questionSets, type Choice, type Question, type QuestionSet } from "./game";
import { validateQuestionSets } from "./question-content";

function createChoices(prefix: string, percentages = [40, 30, 20, 10]): Choice[] {
  return percentages.map((percentage, index) => ({
    id: `${prefix}-choice-${index + 1}`,
    label: `選択肢${index + 1}`,
    percentage,
  }));
}

function createQuestion(setIndex: number, questionIndex: number): Question {
  const prefix = `set-${setIndex}-question-${questionIndex}`;
  return {
    id: prefix,
    prompt: `問題文${setIndex}-${questionIndex}`,
    choices: createChoices(prefix),
  };
}

function createQuestionSet(setIndex: number): QuestionSet {
  return {
    id: `set-${setIndex}`,
    title: `セット${setIndex}`,
    questions: Array.from({ length: 5 }, (_, questionIndex) =>
      createQuestion(setIndex, questionIndex + 1),
    ),
  };
}

function createValidQuestionSets(): QuestionSet[] {
  return Array.from({ length: 3 }, (_, index) => createQuestionSet(index + 1));
}

describe("validateQuestionSets", () => {
  it("現在の問題データがすべての整合性ルールを満たす", () => {
    expect(validateQuestionSets(questionSets)).toEqual([]);
  });

  it("問題セット数不足をルートパス付きで返す", () => {
    expect(validateQuestionSets([createQuestionSet(1)])).toContainEqual({
      path: "questionSets",
      code: "minimum-question-set-count",
      message: "問題セットは3件以上登録してください。現在は1件です。",
    });
  });

  it("空白値とID重複を対象パス付きでまとめて返す", () => {
    const sets = createValidQuestionSets();
    sets[0].id = " ";
    sets[0].title = "\t";
    sets[0].questions[0].id = "";
    sets[0].questions[0].prompt = "  ";
    sets[0].questions[0].choices[0].label = "\n";
    sets[1].id = sets[2].id;
    sets[1].questions[0].id = sets[2].questions[0].id;
    sets[1].questions[0].choices[0].id = sets[2].questions[0].choices[0].id;

    const issues = validateQuestionSets(sets);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "questionSets[0].id", code: "blank-value" }),
        expect.objectContaining({ path: "questionSets[0].title", code: "blank-value" }),
        expect.objectContaining({
          path: "questionSets[0].questions[0].id",
          code: "blank-value",
        }),
        expect.objectContaining({
          path: "questionSets[0].questions[0].prompt",
          code: "blank-value",
        }),
        expect.objectContaining({
          path: "questionSets[0].questions[0].choices[0].label",
          code: "blank-value",
        }),
        expect.objectContaining({ path: "questionSets[2].id", code: "duplicate-id" }),
        expect.objectContaining({
          path: "questionSets[2].questions[0].id",
          code: "duplicate-id",
        }),
        expect.objectContaining({
          path: "questionSets[2].questions[0].choices[0].id",
          code: "duplicate-id",
        }),
      ]),
    );
  });

  it("問題数と選択肢数の不正を検出する", () => {
    const sets = createValidQuestionSets();
    sets[0].questions.pop();
    sets[1].questions[0].choices = sets[1].questions[0].choices.slice(0, 3);
    sets[2].questions[0].choices.push({
      id: "set-3-question-1-choice-5",
      label: "選択肢5",
      percentage: 0,
    });
    sets[2].questions[0].choices.push({
      id: "set-3-question-1-choice-6",
      label: "選択肢6",
      percentage: 0,
    });

    const issues = validateQuestionSets(sets);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "questionSets[0].questions", code: "question-count" }),
        expect.objectContaining({
          path: "questionSets[1].questions[0].choices",
          code: "choice-count",
        }),
        expect.objectContaining({
          path: "questionSets[2].questions[0].choices",
          code: "choice-count",
        }),
      ]),
    );
  });

  it("有限範囲外の選択率をそれぞれ検出する", () => {
    const sets = createValidQuestionSets();
    const choices = sets[0].questions[0].choices;
    choices[0].percentage = Number.NaN;
    choices[1].percentage = Number.POSITIVE_INFINITY;
    choices[2].percentage = -1;
    choices[3].percentage = 101;

    const issues = validateQuestionSets(sets).filter(
      (issue) => issue.code === "invalid-percentage",
    );

    expect(issues.map((issue) => issue.path)).toEqual([
      "questionSets[0].questions[0].choices[0].percentage",
      "questionSets[0].questions[0].choices[1].percentage",
      "questionSets[0].questions[0].choices[2].percentage",
      "questionSets[0].questions[0].choices[3].percentage",
    ]);
  });

  it("小数を含む合計100を許容し、過不足だけを検出する", () => {
    const sets = createValidQuestionSets();
    sets[0].questions[0].choices = createChoices("decimal-valid", [33.3, 33.3, 33.4, 0]);
    sets[0].questions[1].choices = createChoices("total-99", [40, 30, 20, 9]);
    sets[0].questions[2].choices = createChoices("total-101", [40, 30, 20, 11]);

    const issues = validateQuestionSets(sets).filter(
      (issue) => issue.code === "percentage-total",
    );

    expect(issues.map((issue) => issue.path)).toEqual([
      "questionSets[0].questions[1].choices",
      "questionSets[0].questions[2].choices",
    ]);
  });
});
