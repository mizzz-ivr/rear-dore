import type { QuestionSet } from "./game";
import type { PlayHistoryEntry } from "./history";

export const THEME_COLLECTION_STORAGE_KEY = "rear-dore:theme-collection";

const THEME_COLLECTION_VERSION = 1;
const MAX_DISCOVERIES = 100;

const COLLECTION_BADGE_DEFINITIONS = [
  {
    id: "discover-3",
    icon: "🧭",
    title: "テーマ探索者",
    description: "3テーマを発見する",
    target: 3,
  },
  {
    id: "discover-5",
    icon: "📚",
    title: "コレクター",
    description: "5テーマを発見する",
    target: 5,
  },
  {
    id: "discover-10",
    icon: "👑",
    title: "テーママスター",
    description: "10テーマを発見する",
    target: 10,
  },
  {
    id: "discover-15",
    icon: "🏆",
    title: "テーマ図鑑コンプリート",
    description: "15テーマを発見する",
    target: 15,
  },
] as const;

export type ThemeDiscovery = Readonly<{
  questionSetId: string;
  discoveredOn: string;
}>;

export type ThemeCollectionItem = Readonly<{
  questionSetId: string;
  title: string | null;
  discovered: boolean;
  discoveredOn: string | null;
}>;

export type ThemeCollectionSummary = Readonly<{
  discoveredCount: number;
  totalCount: number;
  items: readonly ThemeCollectionItem[];
}>;

export type ThemeCollectionBadge = Readonly<{
  id: (typeof COLLECTION_BADGE_DEFINITIONS)[number]["id"];
  icon: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unlocked: boolean;
}>;

type StoredThemeCollection = Readonly<{
  version: typeof THEME_COLLECTION_VERSION;
  discoveries: readonly ThemeDiscovery[];
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDateKey(dateKey: unknown): dateKey is string {
  if (typeof dateKey !== "string") return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function getKnownQuestionSetIds(questionSets: readonly QuestionSet[]): Set<string> {
  return new Set(questionSets.map((questionSet) => questionSet.id));
}

function normalizeDiscoveries(
  discoveries: readonly ThemeDiscovery[],
  questionSets: readonly QuestionSet[],
): ThemeDiscovery[] {
  const knownIds = getKnownQuestionSetIds(questionSets);
  const earliestById = new Map<string, string>();

  for (const discovery of discoveries) {
    if (!knownIds.has(discovery.questionSetId)) continue;
    if (!isValidDateKey(discovery.discoveredOn)) continue;

    const current = earliestById.get(discovery.questionSetId);
    if (!current || discovery.discoveredOn < current) {
      earliestById.set(discovery.questionSetId, discovery.discoveredOn);
    }
  }

  return [...earliestById.entries()]
    .map(([questionSetId, discoveredOn]) => ({ questionSetId, discoveredOn }))
    .sort((left, right) => {
      const dateOrder = left.discoveredOn.localeCompare(right.discoveredOn);
      return dateOrder === 0 ? left.questionSetId.localeCompare(right.questionSetId) : dateOrder;
    })
    .slice(0, MAX_DISCOVERIES);
}

export function restoreThemeCollection(
  rawValue: string | null,
  questionSets: readonly QuestionSet[],
): ThemeDiscovery[] {
  if (!rawValue) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return [];
  }

  if (!isRecord(parsed)) return [];
  if (parsed.version !== THEME_COLLECTION_VERSION || !Array.isArray(parsed.discoveries)) {
    return [];
  }

  const discoveries: ThemeDiscovery[] = [];
  for (const value of parsed.discoveries) {
    if (!isRecord(value)) continue;
    if (typeof value.questionSetId !== "string" || !isValidDateKey(value.discoveredOn)) continue;

    discoveries.push({
      questionSetId: value.questionSetId,
      discoveredOn: value.discoveredOn,
    });
  }

  return normalizeDiscoveries(discoveries, questionSets);
}

export function synchronizeThemeCollection(
  discoveries: readonly ThemeDiscovery[],
  history: readonly PlayHistoryEntry[],
  questionSets: readonly QuestionSet[],
): ThemeDiscovery[] {
  const historyDiscoveries = history.map((entry) => ({
    questionSetId: entry.questionSetId,
    discoveredOn: entry.dateKey,
  }));

  return normalizeDiscoveries([...discoveries, ...historyDiscoveries], questionSets);
}

export function serializeThemeCollection(
  discoveries: readonly ThemeDiscovery[],
  questionSets: readonly QuestionSet[],
): string {
  const stored: StoredThemeCollection = {
    version: THEME_COLLECTION_VERSION,
    discoveries: normalizeDiscoveries(discoveries, questionSets),
  };

  return JSON.stringify(stored);
}

export function calculateThemeCollectionSummary(
  discoveries: readonly ThemeDiscovery[],
  questionSets: readonly QuestionSet[],
): ThemeCollectionSummary {
  const normalized = normalizeDiscoveries(discoveries, questionSets);
  const discoveryById = new Map(
    normalized.map((discovery) => [discovery.questionSetId, discovery.discoveredOn]),
  );

  const items = questionSets.map((questionSet): ThemeCollectionItem => {
    const discoveredOn = discoveryById.get(questionSet.id) ?? null;
    const discovered = discoveredOn !== null;

    return {
      questionSetId: questionSet.id,
      title: discovered ? questionSet.title : null,
      discovered,
      discoveredOn,
    };
  });

  return {
    discoveredCount: normalized.length,
    totalCount: questionSets.length,
    items,
  };
}

export function getNewlyDiscoveredTheme(
  previousDiscoveries: readonly ThemeDiscovery[],
  nextDiscoveries: readonly ThemeDiscovery[],
  questionSetId: string,
  questionSets: readonly QuestionSet[],
): ThemeCollectionItem | null {
  const previousIds = new Set(
    normalizeDiscoveries(previousDiscoveries, questionSets).map(
      (discovery) => discovery.questionSetId,
    ),
  );
  if (previousIds.has(questionSetId)) return null;

  const nextDiscovery = normalizeDiscoveries(nextDiscoveries, questionSets).find(
    (discovery) => discovery.questionSetId === questionSetId,
  );
  if (!nextDiscovery) return null;

  const questionSet = questionSets.find((candidate) => candidate.id === questionSetId);
  if (!questionSet) return null;

  return {
    questionSetId,
    title: questionSet.title,
    discovered: true,
    discoveredOn: nextDiscovery.discoveredOn,
  };
}

export function calculateThemeCollectionBadges(
  discoveries: readonly ThemeDiscovery[],
  questionSets: readonly QuestionSet[],
): readonly ThemeCollectionBadge[] {
  const current = normalizeDiscoveries(discoveries, questionSets).length;

  return COLLECTION_BADGE_DEFINITIONS.filter(
    (definition) => definition.target <= questionSets.length,
  ).map((definition) => ({
    ...definition,
    current,
    unlocked: current >= definition.target,
  }));
}

export function calculateNewlyUnlockedThemeCollectionBadges(
  previousDiscoveries: readonly ThemeDiscovery[],
  nextDiscoveries: readonly ThemeDiscovery[],
  questionSets: readonly QuestionSet[],
): readonly ThemeCollectionBadge[] {
  const previouslyUnlockedIds = new Set(
    calculateThemeCollectionBadges(previousDiscoveries, questionSets)
      .filter((badge) => badge.unlocked)
      .map((badge) => badge.id),
  );

  return calculateThemeCollectionBadges(nextDiscoveries, questionSets).filter(
    (badge) => badge.unlocked && !previouslyUnlockedIds.has(badge.id),
  );
}
