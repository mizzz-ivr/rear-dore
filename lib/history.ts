import type { Rarity } from "./game";

export const PLAY_HISTORY_STORAGE_KEY = "rear-dore:play-history";

const PLAY_HISTORY_VERSION = 1;
const MAX_HISTORY_ENTRIES = 30;
const MAX_TOTAL_SCORE = 5_000;
const REQUIRED_RARITY_COUNT = 5;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const VALID_RARITIES: readonly Rarity[] = ["UR", "SSR", "SR", "R", "N", "多数派"];

export type PlayHistoryEntry = {
  dateKey: string;
  questionSetId: string;
  questionSetTitle: string;
  totalScore: number;
  playerTitle: string;
  rarities: Rarity[];
};

export type PlayHistoryStats = Readonly<{
  playCount: number;
  currentStreak: number;
  longestStreak: number;
  bestScore: number;
  averageScore: number;
}>;

type StoredPlayHistory = {
  version: typeof PLAY_HISTORY_VERSION;
  entries: unknown[];
};

type CreatePlayHistoryEntryParams = {
  dateKey: string;
  questionSetId: string;
  questionSetTitle: string;
  totalScore: number;
  playerTitle: string;
  rarities: readonly Rarity[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseDateKey(dateKey: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return timestamp;
}

function isTrimmedText(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= maxLength &&
    value === value.trim()
  );
}

function isRarity(value: unknown): value is Rarity {
  return typeof value === "string" && VALID_RARITIES.includes(value as Rarity);
}

function parseEntry(value: unknown): PlayHistoryEntry | null {
  if (!isRecord(value)) return null;
  if (typeof value.dateKey !== "string" || parseDateKey(value.dateKey) === null) return null;
  if (!isTrimmedText(value.questionSetId, 100)) return null;
  if (!isTrimmedText(value.questionSetTitle, 100)) return null;
  if (
    typeof value.totalScore !== "number" ||
    !Number.isSafeInteger(value.totalScore) ||
    value.totalScore < 0 ||
    value.totalScore > MAX_TOTAL_SCORE
  ) {
    return null;
  }
  if (!isTrimmedText(value.playerTitle, 100)) return null;
  if (!Array.isArray(value.rarities) || value.rarities.length !== REQUIRED_RARITY_COUNT) return null;
  if (!value.rarities.every(isRarity)) return null;

  return {
    dateKey: value.dateKey,
    questionSetId: value.questionSetId,
    questionSetTitle: value.questionSetTitle,
    totalScore: value.totalScore,
    playerTitle: value.playerTitle,
    rarities: [...value.rarities],
  };
}

function normalizeEntries(entries: readonly PlayHistoryEntry[]): PlayHistoryEntry[] {
  const byDate = new Map<string, PlayHistoryEntry>();

  for (const entry of entries) {
    byDate.set(entry.dateKey, entry);
  }

  return [...byDate.values()]
    .sort((left, right) => right.dateKey.localeCompare(left.dateKey))
    .slice(0, MAX_HISTORY_ENTRIES);
}

function getPlayedTimestamps(entries: readonly PlayHistoryEntry[]): number[] {
  return entries
    .map((entry) => parseDateKey(entry.dateKey))
    .filter((timestamp): timestamp is number => timestamp !== null)
    .sort((left, right) => left - right);
}

function calculateCurrentStreakFromTimestamps(
  playedTimestamps: readonly number[],
  currentTimestamp: number,
): number {
  const playedTimestampSet = new Set(playedTimestamps);
  const todayPlayed = playedTimestampSet.has(currentTimestamp);
  const startTimestamp = todayPlayed ? currentTimestamp : currentTimestamp - DAY_IN_MILLISECONDS;

  if (!playedTimestampSet.has(startTimestamp)) return 0;

  let streak = 0;
  let cursor = startTimestamp;

  while (playedTimestampSet.has(cursor)) {
    streak += 1;
    cursor -= DAY_IN_MILLISECONDS;
  }

  return streak;
}

function calculateLongestStreak(playedTimestamps: readonly number[]): number {
  let longestStreak = 0;
  let currentStreak = 0;
  let previousTimestamp: number | null = null;

  for (const timestamp of playedTimestamps) {
    currentStreak =
      previousTimestamp !== null && timestamp === previousTimestamp + DAY_IN_MILLISECONDS
        ? currentStreak + 1
        : 1;
    longestStreak = Math.max(longestStreak, currentStreak);
    previousTimestamp = timestamp;
  }

  return longestStreak;
}

export function createPlayHistoryEntry({
  dateKey,
  questionSetId,
  questionSetTitle,
  totalScore,
  playerTitle,
  rarities,
}: CreatePlayHistoryEntryParams): PlayHistoryEntry {
  const entry = parseEntry({
    dateKey,
    questionSetId,
    questionSetTitle,
    totalScore,
    playerTitle,
    rarities: [...rarities],
  });

  if (!entry) {
    throw new RangeError("有効なプレイ履歴を指定してください。");
  }

  return entry;
}

export function restorePlayHistory(rawValue: string | null): PlayHistoryEntry[] {
  if (!rawValue) return [];

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return [];
  }

  if (!isRecord(parsed)) return [];
  if (parsed.version !== PLAY_HISTORY_VERSION || !Array.isArray(parsed.entries)) return [];

  const entries = parsed.entries
    .map(parseEntry)
    .filter((entry): entry is PlayHistoryEntry => entry !== null);

  return normalizeEntries(entries);
}

export function upsertPlayHistory(
  entries: readonly PlayHistoryEntry[],
  newEntry: PlayHistoryEntry,
): PlayHistoryEntry[] {
  const validatedEntry = createPlayHistoryEntry(newEntry);
  return normalizeEntries([...entries, validatedEntry]);
}

export function serializePlayHistory(entries: readonly PlayHistoryEntry[]): string {
  const stored: StoredPlayHistory = {
    version: PLAY_HISTORY_VERSION,
    entries: normalizeEntries(entries),
  };

  return JSON.stringify(stored);
}

export function calculatePlayHistoryStats(
  entries: readonly PlayHistoryEntry[],
  currentDateKey: string,
): PlayHistoryStats {
  const currentTimestamp = parseDateKey(currentDateKey);
  if (currentTimestamp === null) {
    throw new RangeError("currentDateKeyは実在するYYYY-MM-DD形式で指定してください。");
  }

  const normalized = normalizeEntries(entries);
  const playedTimestamps = getPlayedTimestamps(normalized);
  const totalScore = normalized.reduce((sum, entry) => sum + entry.totalScore, 0);

  return {
    playCount: normalized.length,
    currentStreak: calculateCurrentStreakFromTimestamps(playedTimestamps, currentTimestamp),
    longestStreak: calculateLongestStreak(playedTimestamps),
    bestScore: normalized.reduce((best, entry) => Math.max(best, entry.totalScore), 0),
    averageScore: normalized.length === 0 ? 0 : Math.round(totalScore / normalized.length),
  };
}

export function calculateCurrentStreak(
  entries: readonly PlayHistoryEntry[],
  currentDateKey: string,
): number {
  return calculatePlayHistoryStats(entries, currentDateKey).currentStreak;
}
