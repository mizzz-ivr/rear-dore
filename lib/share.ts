import type { AnswerResult, Rarity } from "./game";

const raritySymbolByRarity: Record<Rarity, string> = {
  UR: "🟪",
  SSR: "🟥",
  SR: "🟨",
  R: "🟩",
  N: "🟦",
  多数派: "⬜",
};

type ShareAnswer = Pick<AnswerResult, "rarity">;

type BuildShareTextParams = {
  dateKey: string;
  questionSetTitle: string;
  totalScore: number;
  playerTitle: string;
  answers: readonly ShareAnswer[];
};

export function getRaritySymbol(rarity: Rarity): string {
  return raritySymbolByRarity[rarity];
}

export function buildRarityGrid(answers: readonly ShareAnswer[]): string {
  return answers.map((answer) => getRaritySymbol(answer.rarity)).join("");
}

export function buildShareText({
  dateKey,
  questionSetTitle,
  totalScore,
  playerTitle,
  answers,
}: BuildShareTextParams): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    throw new RangeError("dateKeyはYYYY-MM-DD形式で指定してください。");
  }
  if (!questionSetTitle.trim()) {
    throw new RangeError("questionSetTitleを指定してください。");
  }
  if (!Number.isSafeInteger(totalScore) || totalScore < 0) {
    throw new RangeError("totalScoreは0以上の安全な整数で指定してください。");
  }
  if (!playerTitle.trim()) {
    throw new RangeError("playerTitleを指定してください。");
  }
  if (answers.length === 0) {
    throw new RangeError("answersを1件以上指定してください。");
  }

  return [
    `レアどれ？ ${dateKey}`,
    `「${questionSetTitle}」`,
    buildRarityGrid(answers),
    `${totalScore.toLocaleString("ja-JP")}点｜${playerTitle}`,
    "#レアどれ",
  ].join("\n");
}

export function appendShareUrl(text: string, url: string): string {
  if (!text.trim()) {
    throw new RangeError("textを指定してください。");
  }

  const parsedUrl = new URL(url);
  return `${text}\n${parsedUrl.toString()}`;
}

export function buildXShareUrl(textWithUrl: string): string {
  if (!textWithUrl.trim()) {
    throw new RangeError("textWithUrlを指定してください。");
  }

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(textWithUrl)}`;
}
