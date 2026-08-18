import { additionalQuestionSets } from "./additional-question-sets";
import { extraQuestionSets } from "./extra-question-sets";
import { questionSets11To15 } from "./question-sets-11-15";

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

export type QuestionSet = {
  id: string;
  title: string;
  questions: Question[];
};

export type AnswerResult = {
  questionId: string;
  choiceId: string;
  choiceLabel: string;
  percentage: number;
  rarity: Rarity;
  score: number;
};

const LEGACY_ROTATION_EPOCH_UTC = Date.UTC(2026, 6, 28);
const STABLE_ROTATION_EPOCH_UTC = Date.UTC(2026, 7, 8);
const EXPANDED_ROTATION_EPOCH_UTC = Date.UTC(2026, 7, 15);
const FIFTEEN_THEME_ROTATION_EPOCH_UTC = Date.UTC(2026, 7, 25);
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const LEGACY_ROTATION_QUESTION_SET_IDS = [
  "daily-01-imagination",
  "daily-02-everyday",
  "daily-03-choice",
] as const;

const STABLE_ROTATION_QUESTION_SET_IDS = [
  "daily-03-choice",
  "daily-04-digital",
  "daily-05-food",
  "daily-06-outing",
  "daily-07-odd",
  "daily-01-imagination",
  "daily-02-everyday",
] as const;

const EXPANDED_ROTATION_QUESTION_SET_IDS = [
  "daily-08-work-study",
  "daily-09-hobbies",
  "daily-10-future-tech",
  "daily-03-choice",
  "daily-04-digital",
  "daily-05-food",
  "daily-06-outing",
  "daily-07-odd",
  "daily-01-imagination",
  "daily-02-everyday",
] as const;

const FIFTEEN_THEME_ROTATION_QUESTION_SET_IDS = [
  "daily-08-work-study",
  "daily-11-transport",
  "daily-12-shopping-money",
  "daily-13-communication",
  "daily-14-season-events",
  "daily-15-entertainment",
  "daily-09-hobbies",
  "daily-10-future-tech",
  "daily-03-choice",
  "daily-04-digital",
  "daily-05-food",
  "daily-06-outing",
  "daily-07-odd",
  "daily-01-imagination",
  "daily-02-everyday",
] as const;

export const questionSets: QuestionSet[] = [
  {
    id: "daily-01-imagination",
    title: "もしも編",
    questions: [
      {
        id: "invisible-hour",
        prompt: "透明人間になれるのは1時間だけ。最初に何をする？",
        choices: [
          { id: "invisible-hour-celebrity", label: "有名人を見に行く", percentage: 38 },
          { id: "invisible-hour-cinema", label: "映画館へ入る", percentage: 17 },
          { id: "invisible-hour-family", label: "家族や友達を驚かせる", percentage: 27 },
          { id: "invisible-hour-floating-clothes", label: "鏡の前で服だけ浮かせる", percentage: 3 },
          { id: "invisible-hour-quiet-walk", label: "誰にも会わず散歩する", percentage: 15 },
        ],
      },
      {
        id: "unexpected-holiday",
        prompt: "急に学校や会社が休みになった。どう過ごす？",
        choices: [
          { id: "unexpected-holiday-sleep", label: "二度寝する", percentage: 44 },
          { id: "unexpected-holiday-game", label: "ゲームや動画を見る", percentage: 31 },
          { id: "unexpected-holiday-go-out", label: "予定を立てずに出かける", percentage: 13 },
          { id: "unexpected-holiday-clean", label: "部屋を徹底的に掃除する", percentage: 8 },
          { id: "unexpected-holiday-normal", label: "普段どおりの時間に作業する", percentage: 4 },
        ],
      },
      {
        id: "rpg-party",
        prompt: "RPGで最初に仲間へ誘いたい職業は？",
        choices: [
          { id: "rpg-party-warrior", label: "戦士", percentage: 29 },
          { id: "rpg-party-mage", label: "魔法使い", percentage: 34 },
          { id: "rpg-party-priest", label: "僧侶", percentage: 22 },
          { id: "rpg-party-thief", label: "盗賊", percentage: 12 },
          { id: "rpg-party-merchant", label: "商人", percentage: 3 },
        ],
      },
      {
        id: "one-million-yen",
        prompt: "100万円を今日中に使い切るなら？",
        choices: [
          { id: "one-million-yen-travel", label: "旅行を予約する", percentage: 28 },
          { id: "one-million-yen-computer", label: "パソコンや機材を買う", percentage: 36 },
          { id: "one-million-yen-food", label: "高級な食事を楽しむ", percentage: 19 },
          { id: "one-million-yen-gifts", label: "周りの人へプレゼントする", percentage: 15 },
          { id: "one-million-yen-snacks", label: "全部お菓子にする", percentage: 2 },
        ],
      },
      {
        id: "teleport",
        prompt: "今すぐ一度だけ瞬間移動できる。どこへ行く？",
        choices: [
          { id: "teleport-overseas", label: "行ったことのない海外", percentage: 37 },
          { id: "teleport-home", label: "自分の家や部屋", percentage: 21 },
          { id: "teleport-space", label: "宇宙から地球が見える場所", percentage: 24 },
          { id: "teleport-friend", label: "会いたい人の隣", percentage: 17 },
          { id: "teleport-convenience-store", label: "近所のコンビニ", percentage: 1 },
        ],
      },
    ],
  },
  {
    id: "daily-02-everyday",
    title: "日常のクセ編",
    questions: [
      {
        id: "elevator-silence",
        prompt: "エレベーターで気まずい沈黙。どう過ごす？",
        choices: [
          { id: "elevator-silence-phone", label: "スマホを見る", percentage: 42 },
          { id: "elevator-silence-floor", label: "階数表示を見つめる", percentage: 30 },
          { id: "elevator-silence-talk", label: "天気の話をする", percentage: 9 },
          { id: "elevator-silence-hum", label: "小さく鼻歌を歌う", percentage: 2 },
          { id: "elevator-silence-eyes", label: "目を閉じる", percentage: 17 },
        ],
      },
      {
        id: "alien-food",
        prompt: "宇宙人に地球の食べ物を1つだけ紹介するなら？",
        choices: [
          { id: "alien-food-sushi", label: "寿司", percentage: 32 },
          { id: "alien-food-curry", label: "カレー", percentage: 28 },
          { id: "alien-food-ramen", label: "ラーメン", percentage: 25 },
          { id: "alien-food-natto", label: "納豆", percentage: 4 },
          { id: "alien-food-onigiri", label: "コンビニのおにぎり", percentage: 11 },
        ],
      },
      {
        id: "one-weather",
        prompt: "一年中ひとつの天気だけになるなら？",
        choices: [
          { id: "one-weather-sunny", label: "晴れ", percentage: 41 },
          { id: "one-weather-cloudy", label: "くもり", percentage: 23 },
          { id: "one-weather-rain", label: "弱い雨", percentage: 7 },
          { id: "one-weather-snow", label: "雪", percentage: 18 },
          { id: "one-weather-thunder", label: "雷雨", percentage: 11 },
        ],
      },
      {
        id: "lost-save-data",
        prompt: "ゲームのセーブデータが消えた。どうする？",
        choices: [
          { id: "lost-save-data-restart", label: "最初からやり直す", percentage: 24 },
          { id: "lost-save-data-restore", label: "復元方法を全力で探す", percentage: 49 },
          { id: "lost-save-data-speedrun", label: "最短ルートで追いつく", percentage: 8 },
          { id: "lost-save-data-video", label: "動画で結末だけ見る", percentage: 16 },
          { id: "lost-save-data-uninstall", label: "そのままアンインストールする", percentage: 3 },
        ],
      },
      {
        id: "wake-up-cat",
        prompt: "朝起きたら猫になっていた。最初に何をする？",
        choices: [
          { id: "wake-up-cat-sleep", label: "もう一度寝る", percentage: 31 },
          { id: "wake-up-cat-meow", label: "鳴き声を確認する", percentage: 27 },
          { id: "wake-up-cat-food", label: "ごはんを探す", percentage: 24 },
          { id: "wake-up-cat-outside", label: "外を探検する", percentage: 13 },
          { id: "wake-up-cat-keyboard", label: "キーボードの上に乗る", percentage: 5 },
        ],
      },
    ],
  },
  {
    id: "daily-03-choice",
    title: "究極の選択編",
    questions: [
      {
        id: "animal-conversation",
        prompt: "1日だけ動物と会話できる。最初に話す相手は？",
        choices: [
          { id: "animal-conversation-dog", label: "犬", percentage: 34 },
          { id: "animal-conversation-cat", label: "猫", percentage: 38 },
          { id: "animal-conversation-crow", label: "カラス", percentage: 9 },
          { id: "animal-conversation-fish", label: "魚", percentage: 3 },
          { id: "animal-conversation-insects", label: "昆虫", percentage: 16 },
        ],
      },
      {
        id: "three-hour-clone",
        prompt: "自分のクローンが3時間だけ現れた。何を頼む？",
        choices: [
          { id: "three-hour-clone-chores", label: "家事を全部任せる", percentage: 38 },
          { id: "three-hour-clone-work", label: "仕事や勉強を分担する", percentage: 29 },
          { id: "three-hour-clone-debate", label: "自分同士で議論する", percentage: 11 },
          { id: "three-hour-clone-prank", label: "知人を驚かせる", percentage: 6 },
          { id: "three-hour-clone-nap", label: "二人で昼寝する", percentage: 16 },
        ],
      },
      {
        id: "time-machine",
        prompt: "タイムマシンを一度だけ使える。いつへ行く？",
        choices: [
          { id: "time-machine-yesterday", label: "昨日", percentage: 21 },
          { id: "time-machine-childhood", label: "自分の子ども時代", percentage: 29 },
          { id: "time-machine-dinosaurs", label: "恐竜の時代", percentage: 24 },
          { id: "time-machine-future", label: "100年後", percentage: 23 },
          { id: "time-machine-five-minutes", label: "5分前", percentage: 3 },
        ],
      },
      {
        id: "world-button",
        prompt: "世界に効くボタンを1つだけ持てるなら？",
        choices: [
          { id: "world-button-pause", label: "時間を一時停止する", percentage: 37 },
          { id: "world-button-mute", label: "世界を無音にする", percentage: 18 },
          { id: "world-button-undo", label: "直前の出来事を取り消す", percentage: 31 },
          { id: "world-button-confetti", label: "どこでも紙吹雪を出す", percentage: 4 },
          { id: "world-button-translate", label: "動物の言葉を翻訳する", percentage: 10 },
        ],
      },
      {
        id: "last-convenience-item",
        prompt: "コンビニで欲しい商品が最後の1個。どうする？",
        choices: [
          { id: "last-convenience-item-buy", label: "迷わず買う", percentage: 46 },
          { id: "last-convenience-item-leave", label: "次の人のために残す", percentage: 22 },
          { id: "last-convenience-item-ask", label: "店員に在庫を聞く", percentage: 9 },
          { id: "last-convenience-item-coin", label: "コイントスで決める", percentage: 18 },
          { id: "last-convenience-item-photo", label: "記念撮影だけする", percentage: 5 },
        ],
      },
    ],
  },
  ...extraQuestionSets,
  ...additionalQuestionSets,
  ...questionSets11To15,
];

export const DEFAULT_QUESTION_SET = questionSets[0];
export const questions = DEFAULT_QUESTION_SET.questions;

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

function getQuestionSetById(questionSetId: string): QuestionSet {
  const questionSet = questionSets.find((candidate) => candidate.id === questionSetId);
  if (!questionSet) {
    throw new RangeError(`ローテーション対象の問題セット「${questionSetId}」が見つかりません。`);
  }
  return questionSet;
}

function getRotationQuestionSet(
  timestamp: number,
  epochTimestamp: number,
  questionSetIds: readonly string[],
): QuestionSet {
  if (questionSetIds.length === 0) {
    throw new RangeError("ローテーション対象の問題セットが登録されていません。");
  }

  const elapsedDays = Math.floor((timestamp - epochTimestamp) / DAY_IN_MILLISECONDS);
  const index = ((elapsedDays % questionSetIds.length) + questionSetIds.length) % questionSetIds.length;
  return getQuestionSetById(questionSetIds[index]);
}

export function getDailyQuestionSet(dateKey: string): QuestionSet {
  const timestamp = parseDateKey(dateKey);

  if (timestamp < STABLE_ROTATION_EPOCH_UTC) {
    return getRotationQuestionSet(
      timestamp,
      LEGACY_ROTATION_EPOCH_UTC,
      LEGACY_ROTATION_QUESTION_SET_IDS,
    );
  }

  if (timestamp < EXPANDED_ROTATION_EPOCH_UTC) {
    return getRotationQuestionSet(
      timestamp,
      STABLE_ROTATION_EPOCH_UTC,
      STABLE_ROTATION_QUESTION_SET_IDS,
    );
  }

  if (timestamp < FIFTEEN_THEME_ROTATION_EPOCH_UTC) {
    return getRotationQuestionSet(
      timestamp,
      EXPANDED_ROTATION_EPOCH_UTC,
      EXPANDED_ROTATION_QUESTION_SET_IDS,
    );
  }

  return getRotationQuestionSet(
    timestamp,
    FIFTEEN_THEME_ROTATION_EPOCH_UTC,
    FIFTEEN_THEME_ROTATION_QUESTION_SET_IDS,
  );
}

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
