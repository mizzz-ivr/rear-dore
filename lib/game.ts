export type Rarity = "UR" | "SSR" | "SR" | "R" | "N" | "多数派";

export type Choice = {
  id: string;
  label: string;
  percentage: number;
};

export type Question = {
  id: string;
  prompt: string;
  choices: Choice[];
};

export type AnswerResult = {
  questionId: string;
  choiceId: string;
  choiceLabel: string;
  percentage: number;
  rarity: Rarity;
  score: number;
};

export const questions: Question[] = [
  {
    id: "invisible-hour",
    prompt: "透明人間になれるのは1時間だけ。最初に何をする？",
    choices: [
      { id: "celebrity", label: "有名人を見に行く", percentage: 38 },
      { id: "cinema", label: "映画館へ入る", percentage: 17 },
      { id: "family", label: "家族や友達を驚かせる", percentage: 27 },
      { id: "floating-clothes", label: "鏡の前で服だけ浮かせる", percentage: 3 },
      { id: "quiet-walk", label: "誰にも会わず散歩する", percentage: 15 },
    ],
  },
  {
    id: "unexpected-holiday",
    prompt: "急に学校や会社が休みになった。どう過ごす？",
    choices: [
      { id: "sleep", label: "二度寝する", percentage: 44 },
      { id: "game", label: "ゲームや動画を見る", percentage: 31 },
      { id: "go-out", label: "予定を立てずに出かける", percentage: 13 },
      { id: "clean", label: "部屋を徹底的に掃除する", percentage: 8 },
      { id: "normal", label: "普段どおりの時間に作業する", percentage: 4 },
    ],
  },
  {
    id: "rpg-party",
    prompt: "RPGで最初に仲間へ誘いたい職業は？",
    choices: [
      { id: "warrior", label: "戦士", percentage: 29 },
      { id: "mage", label: "魔法使い", percentage: 34 },
      { id: "priest", label: "僧侶", percentage: 22 },
      { id: "thief", label: "盗賊", percentage: 12 },
      { id: "merchant", label: "商人", percentage: 3 },
    ],
  },
  {
    id: "one-million-yen",
    prompt: "100万円を今日中に使い切るなら？",
    choices: [
      { id: "travel", label: "旅行を予約する", percentage: 28 },
      { id: "computer", label: "パソコンや機材を買う", percentage: 36 },
      { id: "food", label: "高級な食事を楽しむ", percentage: 19 },
      { id: "gifts", label: "周りの人へプレゼントする", percentage: 15 },
      { id: "snacks", label: "全部お菓子にする", percentage: 2 },
    ],
  },
  {
    id: "teleport",
    prompt: "今すぐ一度だけ瞬間移動できる。どこへ行く？",
    choices: [
      { id: "overseas", label: "行ったことのない海外", percentage: 37 },
      { id: "home", label: "自分の家や部屋", percentage: 21 },
      { id: "space", label: "宇宙から地球が見える場所", percentage: 24 },
      { id: "friend", label: "会いたい人の隣", percentage: 17 },
      { id: "convenience-store", label: "近所のコンビニ", percentage: 1 },
    ],
  },
];

export function getRarity(percentage: number): Rarity {
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw new RangeError("percentageは0以上100以下で指定してください。");
  }
  if (percentage <= 1) return "UR";
  if (percentage <= 3) return "SSR";
  if (percentage <= 8) return "SR";
  if (percentage <= 15) return "R";
  if (percentage <= 30) return "N";
  return "多数派";
}

export function getScore(percentage: number): number {
  const rarity = getRarity(percentage);
  const scoreByRarity: Record<Rarity, number> = {
    UR: 1000,
    SSR: 500,
    SR: 300,
    R: 150,
    N: 75,
    多数派: 20,
  };
  return scoreByRarity[rarity];
}

export function calculateResult(questionId: string, choice: Choice): AnswerResult {
  return {
    questionId,
    choiceId: choice.id,
    choiceLabel: choice.label,
    percentage: choice.percentage,
    rarity: getRarity(choice.percentage),
    score: getScore(choice.percentage),
  };
}

export function getPlayerTitle(totalScore: number): string {
  if (totalScore >= 3000) return "少数派の預言者";
  if (totalScore >= 1800) return "人類の裏を読む者";
  if (totalScore >= 900) return "逆張りの探索者";
  return "多数派からの旅人";
}
