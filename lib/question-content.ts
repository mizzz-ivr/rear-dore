import type { QuestionSet } from "./game";

export const QUESTION_CONTENT_RULES = {
  minimumQuestionSetCount: 3,
  questionsPerSet: 5,
  minimumChoicesPerQuestion: 4,
  maximumChoicesPerQuestion: 5,
  percentageTotal: 100,
  percentageTolerance: 0.000001,
} as const;

export type QuestionContentValidationCode =
  | "minimum-question-set-count"
  | "blank-value"
  | "duplicate-id"
  | "question-count"
  | "choice-count"
  | "invalid-percentage"
  | "percentage-total";

export type QuestionContentValidationIssue = Readonly<{
  path: string;
  code: QuestionContentValidationCode;
  message: string;
}>;

type IdKind = "問題セット" | "問題" | "選択肢";

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function addBlankValueIssue(
  issues: QuestionContentValidationIssue[],
  path: string,
  label: string,
  value: string,
): void {
  if (!isBlank(value)) return;

  issues.push({
    path,
    code: "blank-value",
    message: `${label}は空白以外の文字を含めてください。`,
  });
}

function registerUniqueId(
  issues: QuestionContentValidationIssue[],
  seenIds: Map<string, string>,
  id: string,
  path: string,
  kind: IdKind,
): void {
  if (isBlank(id)) {
    issues.push({
      path,
      code: "blank-value",
      message: `${kind}IDは空白以外の文字を含めてください。`,
    });
    return;
  }

  const firstPath = seenIds.get(id);
  if (firstPath) {
    issues.push({
      path,
      code: "duplicate-id",
      message: `${kind}ID「${id}」は${firstPath}と重複しています。`,
    });
    return;
  }

  seenIds.set(id, path);
}

export function validateQuestionSets(
  questionSets: readonly QuestionSet[],
): QuestionContentValidationIssue[] {
  const issues: QuestionContentValidationIssue[] = [];
  const questionSetIds = new Map<string, string>();
  const questionIds = new Map<string, string>();
  const choiceIds = new Map<string, string>();

  if (questionSets.length < QUESTION_CONTENT_RULES.minimumQuestionSetCount) {
    issues.push({
      path: "questionSets",
      code: "minimum-question-set-count",
      message: `問題セットは${QUESTION_CONTENT_RULES.minimumQuestionSetCount}件以上登録してください。現在は${questionSets.length}件です。`,
    });
  }

  questionSets.forEach((questionSet, questionSetIndex) => {
    const questionSetPath = `questionSets[${questionSetIndex}]`;

    registerUniqueId(
      issues,
      questionSetIds,
      questionSet.id,
      `${questionSetPath}.id`,
      "問題セット",
    );
    addBlankValueIssue(issues, `${questionSetPath}.title`, "問題セット名", questionSet.title);

    if (questionSet.questions.length !== QUESTION_CONTENT_RULES.questionsPerSet) {
      issues.push({
        path: `${questionSetPath}.questions`,
        code: "question-count",
        message: `問題数は${QUESTION_CONTENT_RULES.questionsPerSet}問にしてください。現在は${questionSet.questions.length}問です。`,
      });
    }

    questionSet.questions.forEach((question, questionIndex) => {
      const questionPath = `${questionSetPath}.questions[${questionIndex}]`;

      registerUniqueId(issues, questionIds, question.id, `${questionPath}.id`, "問題");
      addBlankValueIssue(issues, `${questionPath}.prompt`, "問題文", question.prompt);

      if (
        question.choices.length < QUESTION_CONTENT_RULES.minimumChoicesPerQuestion ||
        question.choices.length > QUESTION_CONTENT_RULES.maximumChoicesPerQuestion
      ) {
        issues.push({
          path: `${questionPath}.choices`,
          code: "choice-count",
          message: `選択肢は${QUESTION_CONTENT_RULES.minimumChoicesPerQuestion}〜${QUESTION_CONTENT_RULES.maximumChoicesPerQuestion}件にしてください。現在は${question.choices.length}件です。`,
        });
      }

      let hasInvalidPercentage = false;
      let percentageTotal = 0;

      question.choices.forEach((choice, choiceIndex) => {
        const choicePath = `${questionPath}.choices[${choiceIndex}]`;

        registerUniqueId(issues, choiceIds, choice.id, `${choicePath}.id`, "選択肢");
        addBlankValueIssue(issues, `${choicePath}.label`, "選択肢ラベル", choice.label);

        if (
          !Number.isFinite(choice.percentage) ||
          choice.percentage < 0 ||
          choice.percentage > 100
        ) {
          hasInvalidPercentage = true;
          issues.push({
            path: `${choicePath}.percentage`,
            code: "invalid-percentage",
            message: "選択率は有限の0以上100以下で指定してください。",
          });
          return;
        }

        percentageTotal += choice.percentage;
      });

      if (
        !hasInvalidPercentage &&
        Math.abs(percentageTotal - QUESTION_CONTENT_RULES.percentageTotal) >
          QUESTION_CONTENT_RULES.percentageTolerance
      ) {
        issues.push({
          path: `${questionPath}.choices`,
          code: "percentage-total",
          message: `選択率の合計は${QUESTION_CONTENT_RULES.percentageTotal}%にしてください。現在は${percentageTotal}%です。`,
        });
      }
    });
  });

  return issues;
}
