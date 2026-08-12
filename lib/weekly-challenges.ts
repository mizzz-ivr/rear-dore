import type { Rarity } from "./game";
import type { PlayHistoryEntry } from "./history";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const PLAY_DAYS_TARGET = 3;
const RARE_ANSWERS_TARGET = 6;
const TOTAL_SCORE_TARGET = 6_000;
const RARE_RARITIES: readonly Rarity[] = ["UR", "SSR", "SR"];

export type WeeklyChallengeId = "play-days" | "rare-answers" | "total-score";

export type WeeklyChallenge = Readonly<{
  id: WeeklyChallengeId;
  icon: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  completed: boolean;
}>;

export type WeeklyChallengeSummary = Readonly<{
  weekStartDateKey: string;
  weekEndDateKey: string;
  completedCount: number;
  totalCount: number;
  allCompleted: boolean;
  challenges: readonly WeeklyChallenge[];
}>;

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

function formatDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekRange(currentTimestamp: number): Readonly<{
  startTimestamp: number;
  endTimestamp: number;
}> {
  const dayOfWeek = new Date(currentTimestamp).getUTCDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const startTimestamp = currentTimestamp - daysSinceMonday * DAY_IN_MILLISECONDS;

  return {
    startTimestamp,
    endTimestamp: startTimestamp + 6 * DAY_IN_MILLISECONDS,
  };
}

function getCurrentWeekEntries(
  entries: readonly PlayHistoryEntry[],
  startTimestamp: number,
  currentTimestamp: number,
): PlayHistoryEntry[] {
  const byDate = new Map<string, PlayHistoryEntry>();

  for (const entry of entries) {
    const timestamp = parseDateKey(entry.dateKey);
    if (timestamp === null || timestamp < startTimestamp || timestamp > currentTimestamp) continue;
    byDate.set(entry.dateKey, entry);
  }

  return [...byDate.values()].sort((left, right) => left.dateKey.localeCompare(right.dateKey));
}

function createChallenge(
  id: WeeklyChallengeId,
  icon: string,
  title: string,
  description: string,
  current: number,
  target: number,
  unit: string,
): WeeklyChallenge {
  return {
    id,
    icon,
    title,
    description,
    current,
    target,
    unit,
    completed: current >= target,
  };
}

export function calculateWeeklyChallengeSummary(
  entries: readonly PlayHistoryEntry[],
  currentDateKey: string,
): WeeklyChallengeSummary {
  const currentTimestamp = parseDateKey(currentDateKey);
  if (currentTimestamp === null) {
    throw new RangeError("currentDateKeyは実在するYYYY-MM-DD形式で指定してください。");
  }

  const { startTimestamp, endTimestamp } = getWeekRange(currentTimestamp);
  const currentWeekEntries = getCurrentWeekEntries(entries, startTimestamp, currentTimestamp);
  const rareAnswerCount = currentWeekEntries.reduce(
    (total, entry) =>
      total + entry.rarities.filter((rarity) => RARE_RARITIES.includes(rarity)).length,
    0,
  );
  const totalScore = currentWeekEntries.reduce((total, entry) => total + entry.totalScore, 0);

  const challenges: readonly WeeklyChallenge[] = [
    createChallenge(
      "play-days",
      "📅",
      "今週3日プレイ",
      "月曜から日曜までに3日分のデイリーを完了する",
      currentWeekEntries.length,
      PLAY_DAYS_TARGET,
      "日",
    ),
    createChallenge(
      "rare-answers",
      "💎",
      "SR以上を6回答",
      "今週のデイリーでUR・SSR・SRを合計6回答獲得する",
      rareAnswerCount,
      RARE_ANSWERS_TARGET,
      "回答",
    ),
    createChallenge(
      "total-score",
      "⚡",
      "週間6,000点",
      "今週のデイリースコアを合計6,000点以上にする",
      totalScore,
      TOTAL_SCORE_TARGET,
      "点",
    ),
  ];
  const completedCount = challenges.filter((challenge) => challenge.completed).length;

  return {
    weekStartDateKey: formatDateKey(startTimestamp),
    weekEndDateKey: formatDateKey(endTimestamp),
    completedCount,
    totalCount: challenges.length,
    allCompleted: completedCount === challenges.length,
    challenges,
  };
}
