import type { QuestionSet } from "./game";

export const PRACTICE_RECORDS_STORAGE_KEY = "rear-dore:practice-records";

const PRACTICE_RECORDS_VERSION = 1;
const MAX_PLAY_COUNT = 999_999;
const MAX_TOTAL_SCORE = 5_000;
const MAX_RARE_ANSWER_COUNT = 5;

export type PracticeThemeRecord = Readonly<{
  questionSetId: string;
  playCount: number;
  bestScore: number;
  bestRareAnswerCount: number;
}>;

type StoredPracticeRecords = Readonly<{
  version: typeof PRACTICE_RECORDS_VERSION;
  records: readonly PracticeThemeRecord[];
}>;

type RecordPracticeResultParams = Readonly<{
  questionSetId: string;
  totalScore: number;
  rareAnswerCount: number;
}>;

export type PracticeRecordUpdate = Readonly<{
  records: readonly PracticeThemeRecord[];
  record: PracticeThemeRecord;
  previousRecord: PracticeThemeRecord | null;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeIntegerInRange(value: unknown, min: number, max: number): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= min &&
    value <= max
  );
}

function parsePracticeRecord(value: unknown): PracticeThemeRecord | null {
  if (!isRecord(value)) return null;
  if (typeof value.questionSetId !== "string" || value.questionSetId.trim() !== value.questionSetId) {
    return null;
  }
  if (value.questionSetId.length === 0 || value.questionSetId.length > 100) return null;
  if (!isSafeIntegerInRange(value.playCount, 1, MAX_PLAY_COUNT)) return null;
  if (!isSafeIntegerInRange(value.bestScore, 0, MAX_TOTAL_SCORE)) return null;
  if (!isSafeIntegerInRange(value.bestRareAnswerCount, 0, MAX_RARE_ANSWER_COUNT)) return null;

  return {
    questionSetId: value.questionSetId,
    playCount: value.playCount,
    bestScore: value.bestScore,
    bestRareAnswerCount: value.bestRareAnswerCount,
  };
}

function normalizePracticeRecords(
  records: readonly PracticeThemeRecord[],
  questionSets: readonly QuestionSet[],
): PracticeThemeRecord[] {
  const orderById = new Map(questionSets.map((questionSet, index) => [questionSet.id, index]));
  const mergedById = new Map<string, PracticeThemeRecord>();

  for (const record of records) {
    if (!orderById.has(record.questionSetId)) continue;

    const current = mergedById.get(record.questionSetId);
    if (!current) {
      mergedById.set(record.questionSetId, record);
      continue;
    }

    mergedById.set(record.questionSetId, {
      questionSetId: record.questionSetId,
      playCount: Math.max(current.playCount, record.playCount),
      bestScore: Math.max(current.bestScore, record.bestScore),
      bestRareAnswerCount: Math.max(
        current.bestRareAnswerCount,
        record.bestRareAnswerCount,
      ),
    });
  }

  return [...mergedById.values()].sort(
    (left, right) =>
      (orderById.get(left.questionSetId) ?? Number.MAX_SAFE_INTEGER) -
      (orderById.get(right.questionSetId) ?? Number.MAX_SAFE_INTEGER),
  );
}

export function restorePracticeRecords(
  rawValue: string | null,
  questionSets: readonly QuestionSet[],
): PracticeThemeRecord[] {
  if (!rawValue) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return [];
  }

  if (!isRecord(parsed)) return [];
  if (parsed.version !== PRACTICE_RECORDS_VERSION || !Array.isArray(parsed.records)) {
    return [];
  }

  const records = parsed.records
    .map(parsePracticeRecord)
    .filter((record): record is PracticeThemeRecord => record !== null);

  return normalizePracticeRecords(records, questionSets);
}

export function serializePracticeRecords(
  records: readonly PracticeThemeRecord[],
  questionSets: readonly QuestionSet[],
): string {
  const stored: StoredPracticeRecords = {
    version: PRACTICE_RECORDS_VERSION,
    records: normalizePracticeRecords(records, questionSets),
  };

  return JSON.stringify(stored);
}

export function recordPracticeResult(
  records: readonly PracticeThemeRecord[],
  params: RecordPracticeResultParams,
  questionSets: readonly QuestionSet[],
): PracticeRecordUpdate {
  if (!questionSets.some((questionSet) => questionSet.id === params.questionSetId)) {
    throw new RangeError("questionSetIdに登録済みテーマを指定してください。");
  }
  if (!isSafeIntegerInRange(params.totalScore, 0, MAX_TOTAL_SCORE)) {
    throw new RangeError(`totalScoreは0から${MAX_TOTAL_SCORE}の整数で指定してください。`);
  }
  if (!isSafeIntegerInRange(params.rareAnswerCount, 0, MAX_RARE_ANSWER_COUNT)) {
    throw new RangeError(
      `rareAnswerCountは0から${MAX_RARE_ANSWER_COUNT}の整数で指定してください。`,
    );
  }

  const normalized = normalizePracticeRecords(records, questionSets);
  const previousRecord =
    normalized.find((record) => record.questionSetId === params.questionSetId) ?? null;
  const record: PracticeThemeRecord = {
    questionSetId: params.questionSetId,
    playCount: Math.min((previousRecord?.playCount ?? 0) + 1, MAX_PLAY_COUNT),
    bestScore: Math.max(previousRecord?.bestScore ?? 0, params.totalScore),
    bestRareAnswerCount: Math.max(
      previousRecord?.bestRareAnswerCount ?? 0,
      params.rareAnswerCount,
    ),
  };

  return {
    records: normalizePracticeRecords(
      [...normalized.filter((item) => item.questionSetId !== params.questionSetId), record],
      questionSets,
    ),
    record,
    previousRecord,
  };
}
