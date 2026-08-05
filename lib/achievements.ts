import type { PlayHistoryEntry, PlayHistoryStats } from "./history";

export type LocalAchievementId =
  | "first-play"
  | "five-play-days"
  | "three-day-streak"
  | "ur-discovery"
  | "score-3000"
  | "all-minority";

export type LocalAchievement = Readonly<{
  id: LocalAchievementId;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  current: number;
  target: number;
  unit: "日" | "回" | "点" | "問";
}>;

export type LocalAchievementSummary = Readonly<{
  unlockedCount: number;
  totalCount: number;
  achievements: readonly LocalAchievement[];
}>;

type AchievementInput = Omit<LocalAchievement, "unlocked">;

function createAchievement(input: AchievementInput): LocalAchievement {
  return {
    ...input,
    unlocked: input.current >= input.target,
  };
}

function countUrAnswers(entries: readonly PlayHistoryEntry[]): number {
  return entries.reduce(
    (total, entry) => total + entry.rarities.filter((rarity) => rarity === "UR").length,
    0,
  );
}

function getBestMinorityAnswerCount(entries: readonly PlayHistoryEntry[]): number {
  return entries.reduce(
    (best, entry) =>
      Math.max(best, entry.rarities.filter((rarity) => rarity !== "多数派").length),
    0,
  );
}

export function calculateLocalAchievements(
  entries: readonly PlayHistoryEntry[],
  stats: PlayHistoryStats,
): LocalAchievementSummary {
  const achievements: readonly LocalAchievement[] = [
    createAchievement({
      id: "first-play",
      icon: "🌱",
      title: "はじめの一歩",
      description: "1日分のゲームを最後まで完了する",
      current: stats.playCount,
      target: 1,
      unit: "日",
    }),
    createAchievement({
      id: "five-play-days",
      icon: "📅",
      title: "観測の常連",
      description: "5日分の結果をこのブラウザに残す",
      current: stats.playCount,
      target: 5,
      unit: "日",
    }),
    createAchievement({
      id: "three-day-streak",
      icon: "🔥",
      title: "三日連続観測",
      description: "3日連続でゲームを完了する",
      current: stats.longestStreak,
      target: 3,
      unit: "日",
    }),
    createAchievement({
      id: "ur-discovery",
      icon: "💎",
      title: "UR発見者",
      description: "URの回答を1回獲得する",
      current: countUrAnswers(entries),
      target: 1,
      unit: "回",
    }),
    createAchievement({
      id: "score-3000",
      icon: "🎯",
      title: "3,000点の壁",
      description: "1日の合計スコアで3,000点以上を記録する",
      current: stats.bestScore,
      target: 3_000,
      unit: "点",
    }),
    createAchievement({
      id: "all-minority",
      icon: "🧭",
      title: "全問少数派",
      description: "1日の5問すべてで「多数派」を避ける",
      current: getBestMinorityAnswerCount(entries),
      target: 5,
      unit: "問",
    }),
  ];

  return {
    unlockedCount: achievements.filter((achievement) => achievement.unlocked).length,
    totalCount: achievements.length,
    achievements,
  };
}
