import type { AnswerResult } from "./game";

const DAILY_MISSION_EPOCH_UTC = Date.UTC(2026, 7, 8);
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export type DailyMissionMetric = "minority" | "r-or-better" | "sr-or-better" | "score";

export type DailyMission = Readonly<{
  id: string;
  title: string;
  description: string;
  icon: string;
  metric: DailyMissionMetric;
  target: number;
  unit: string;
}>;

export type DailyMissionProgress = Readonly<{
  mission: DailyMission;
  current: number;
  completed: boolean;
}>;

const DAILY_MISSIONS = [
  {
    id: "minority-3",
    title: "少数派ハンター",
    description: "5問中3問で「多数派」を避ける",
    icon: "🎯",
    metric: "minority",
    target: 3,
    unit: "問",
  },
  {
    id: "r-or-better-2",
    title: "レア狙い",
    description: "R以上を2回答獲得する",
    icon: "✨",
    metric: "r-or-better",
    target: 2,
    unit: "回答",
  },
  {
    id: "score-500",
    title: "500点チャレンジ",
    description: "5問の合計で500点以上獲得する",
    icon: "⚡",
    metric: "score",
    target: 500,
    unit: "点",
  },
  {
    id: "minority-4",
    title: "少数派マスター",
    description: "5問中4問で「多数派」を避ける",
    icon: "🧭",
    metric: "minority",
    target: 4,
    unit: "問",
  },
  {
    id: "sr-or-better-1",
    title: "SRチャレンジ",
    description: "SR以上を1回答獲得する",
    icon: "💎",
    metric: "sr-or-better",
    target: 1,
    unit: "回答",
  },
  {
    id: "score-750",
    title: "750点チャレンジ",
    description: "5問の合計で750点以上獲得する",
    icon: "🔥",
    metric: "score",
    target: 750,
    unit: "点",
  },
  {
    id: "minority-5",
    title: "完全少数派",
    description: "5問すべてで「多数派」を避ける",
    icon: "👑",
    metric: "minority",
    target: 5,
    unit: "問",
  },
] as const satisfies readonly DailyMission[];

const DAILY_MISSION_ROTATION_IDS = [
  "minority-3",
  "r-or-better-2",
  "score-500",
  "minority-4",
  "sr-or-better-1",
  "score-750",
  "minority-5",
] as const;

function parseDateKey(dateKey: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) {
    throw new RangeError("dateKeyはYYYY-MM-DD形式で指定してください。");
  }

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
    throw new RangeError("dateKeyに実在する日付を指定してください。");
  }

  return timestamp;
}

function getMissionById(missionId: string): DailyMission {
  const mission = DAILY_MISSIONS.find((candidate) => candidate.id === missionId);
  if (!mission) {
    throw new RangeError(`デイリーミッション「${missionId}」が見つかりません。`);
  }
  return mission;
}

function countRarityAtLeastR(answers: readonly AnswerResult[]): number {
  return answers.filter((answer) =>
    answer.rarity === "R" ||
    answer.rarity === "SR" ||
    answer.rarity === "SSR" ||
    answer.rarity === "UR"
  ).length;
}

function countRarityAtLeastSr(answers: readonly AnswerResult[]): number {
  return answers.filter((answer) =>
    answer.rarity === "SR" || answer.rarity === "SSR" || answer.rarity === "UR"
  ).length;
}

function calculateCurrentValue(
  mission: DailyMission,
  answers: readonly AnswerResult[],
): number {
  switch (mission.metric) {
    case "minority":
      return answers.filter((answer) => answer.rarity !== "多数派").length;
    case "r-or-better":
      return countRarityAtLeastR(answers);
    case "sr-or-better":
      return countRarityAtLeastSr(answers);
    case "score":
      return answers.reduce((sum, answer) => sum + answer.score, 0);
  }
}

export function getDailyMission(dateKey: string): DailyMission {
  const timestamp = parseDateKey(dateKey);
  const elapsedDays = Math.floor((timestamp - DAILY_MISSION_EPOCH_UTC) / DAY_IN_MILLISECONDS);
  const rotationIndex =
    ((elapsedDays % DAILY_MISSION_ROTATION_IDS.length) + DAILY_MISSION_ROTATION_IDS.length) %
    DAILY_MISSION_ROTATION_IDS.length;

  return getMissionById(DAILY_MISSION_ROTATION_IDS[rotationIndex]);
}

export function calculateDailyMissionProgress(
  mission: DailyMission,
  answers: readonly AnswerResult[],
): DailyMissionProgress {
  const current = calculateCurrentValue(mission, answers);

  return {
    mission,
    current,
    completed: current >= mission.target,
  };
}

export function getDailyMissionProgress(
  dateKey: string,
  answers: readonly AnswerResult[],
): DailyMissionProgress {
  return calculateDailyMissionProgress(getDailyMission(dateKey), answers);
}
