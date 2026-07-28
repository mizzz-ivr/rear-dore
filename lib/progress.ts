import { calculateResult, type AnswerResult, type Question } from "./game";

export const DAILY_PROGRESS_STORAGE_KEY = "rear-dore:daily-progress";

const DAILY_PROGRESS_VERSION = 2;
const JAPAN_UTC_OFFSET_MILLISECONDS = 9 * 60 * 60 * 1000;

type ProgressPhase = "question" | "result" | "completed";

type StoredAnswer = {
  questionId: string;
  choiceId: string;
};

type StoredDailyProgress = {
  version: typeof DAILY_PROGRESS_VERSION;
  dateKey: string;
  questionSetId: string;
  phase: ProgressPhase;
  activeQuestionId: string;
  answers: StoredAnswer[];
};

export type RestoredDailyProgress = {
  answers: AnswerResult[];
  questionIndex: number;
  selectedChoiceId: string | null;
  completed: boolean;
};

export type ExternalProgressUpdate =
  | { type: "restore"; progress: RestoredDailyProgress }
  | { type: "reset" }
  | { type: "ignore" };

type CreateDailyProgressParams = {
  dateKey: string;
  questionSetId: string;
  questions: Question[];
  answers: AnswerResult[];
  questionIndex: number;
  completed: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertValidDate(date: Date): void {
  if (!Number.isFinite(date.getTime())) {
    throw new RangeError("有効な日時を指定してください。");
  }
}

export function getJapanDateKey(date: Date = new Date()): string {
  assertValidDate(date);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = new Map(parts.map((part) => [part.type, part.value]));
  const year = values.get("year");
  const month = values.get("month");
  const day = values.get("day");

  if (!year || !month || !day) {
    throw new RangeError("日本時間の日付を生成できませんでした。");
  }

  return `${year}-${month}-${day}`;
}

export function getMillisecondsUntilNextJapanDay(date: Date = new Date()): number {
  assertValidDate(date);

  const [year, month, day] = getJapanDateKey(date).split("-").map(Number);
  const nextJapanDayStart = Date.UTC(year, month - 1, day + 1) - JAPAN_UTC_OFFSET_MILLISECONDS;

  return nextJapanDayStart - date.getTime();
}

export function createDailyProgress({
  dateKey,
  questionSetId,
  questions,
  answers,
  questionIndex,
  completed,
}: CreateDailyProgressParams): StoredDailyProgress {
  if (!questionSetId) {
    throw new RangeError("questionSetIdを指定してください。");
  }

  const activeQuestion = questions[questionIndex];

  if (!activeQuestion) {
    throw new RangeError("表示中の問題が問題セットに存在しません。");
  }

  const currentAnswer = answers.find((answer) => answer.questionId === activeQuestion.id);
  const phase: ProgressPhase = completed ? "completed" : currentAnswer ? "result" : "question";

  return {
    version: DAILY_PROGRESS_VERSION,
    dateKey,
    questionSetId,
    phase,
    activeQuestionId: activeQuestion.id,
    answers: answers.map((answer) => ({
      questionId: answer.questionId,
      choiceId: answer.choiceId,
    })),
  };
}

export function serializeDailyProgress(progress: StoredDailyProgress): string {
  return JSON.stringify(progress);
}

export function restoreDailyProgress(
  rawValue: string | null,
  expectedDateKey: string,
  expectedQuestionSetId: string,
  questions: Question[],
): RestoredDailyProgress | null {
  if (!rawValue || !expectedQuestionSetId || questions.length === 0) return null;

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) return null;
  if (parsed.version !== DAILY_PROGRESS_VERSION) return null;
  if (parsed.dateKey !== expectedDateKey) return null;
  if (parsed.questionSetId !== expectedQuestionSetId) return null;
  if (parsed.phase !== "question" && parsed.phase !== "result" && parsed.phase !== "completed") return null;
  if (typeof parsed.activeQuestionId !== "string") return null;
  if (!Array.isArray(parsed.answers)) return null;

  const answers: AnswerResult[] = [];

  for (const [index, storedAnswer] of parsed.answers.entries()) {
    if (!isRecord(storedAnswer)) return null;
    if (typeof storedAnswer.questionId !== "string" || typeof storedAnswer.choiceId !== "string") return null;

    const question = questions[index];
    if (!question || question.id !== storedAnswer.questionId) return null;

    const choice = question.choices.find((candidate) => candidate.id === storedAnswer.choiceId);
    if (!choice) return null;

    answers.push(calculateResult(question.id, choice));
  }

  const questionIndex = questions.findIndex((question) => question.id === parsed.activeQuestionId);
  if (questionIndex < 0) return null;

  if (parsed.phase === "question" && answers.length !== questionIndex) return null;
  if (parsed.phase === "result" && answers.length !== questionIndex + 1) return null;
  if (
    parsed.phase === "completed" &&
    (answers.length !== questions.length || questionIndex !== questions.length - 1)
  ) {
    return null;
  }

  return {
    answers,
    questionIndex,
    selectedChoiceId: parsed.phase === "result" ? answers[questionIndex]?.choiceId ?? null : null,
    completed: parsed.phase === "completed",
  };
}

export function resolveExternalProgressUpdate(
  rawValue: string | null,
  expectedDateKey: string,
  expectedQuestionSetId: string,
  questions: Question[],
): ExternalProgressUpdate {
  if (rawValue === null) {
    return { type: "reset" };
  }

  const progress = restoreDailyProgress(
    rawValue,
    expectedDateKey,
    expectedQuestionSetId,
    questions,
  );

  if (!progress) {
    return { type: "ignore" };
  }

  return { type: "restore", progress };
}
