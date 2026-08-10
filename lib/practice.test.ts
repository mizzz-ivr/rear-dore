import { describe, expect, it } from "vitest";
import { questionSets, type QuestionSet, type Rarity } from "./game";
import type { PlayHistoryEntry } from "./history";
import { getUnlockedPracticeQuestionSets } from "./practice";

const DEFAULT_RARITIES: Rarity[] = ["N", "R", "SR", "多数派", "SSR"];

function createEntry(dateKey: string, questionSet: Pick<QuestionSet, "id" | "title">): PlayHistoryEntry {
  return {
    dateKey,
    questionSetId: questionSet.id,
    questionSetTitle: questionSet.title,
    totalScore: 1_045,
    playerTitle: "逆張りの探索者",
    rarities: [...DEFAULT_RARITIES],
  };
}

describe("getUnlockedPracticeQuestionSets", () => {
  it("履歴がない場合は何も解放しない", () => {
    expect(getUnlockedPracticeQuestionSets([], questionSets)).toEqual([]);
  });

  it("プレイ済みの現行テーマだけを解放する", () => {
    const entries = [createEntry("2026-08-10", questionSets[2])];

    expect(getUnlockedPracticeQuestionSets(entries, questionSets).map((set) => set.id)).toEqual([
      questionSets[2].id,
    ]);
  });

  it("同じテーマを複数回遊んでいても1件だけ返す", () => {
    const entries = [
      createEntry("2026-08-10", questionSets[2]),
      createEntry("2026-08-03", questionSets[2]),
    ];

    expect(getUnlockedPracticeQuestionSets(entries, questionSets).map((set) => set.id)).toEqual([
      questionSets[2].id,
    ]);
  });

  it("最新プレイ日の順でテーマを返す", () => {
    const entries = [
      createEntry("2026-08-01", questionSets[0]),
      createEntry("2026-08-10", questionSets[2]),
      createEntry("2026-08-09", questionSets[1]),
    ];

    expect(getUnlockedPracticeQuestionSets(entries, questionSets).map((set) => set.id)).toEqual([
      questionSets[2].id,
      questionSets[1].id,
      questionSets[0].id,
    ]);
  });

  it("現行問題データに存在しない履歴IDを無視する", () => {
    const removedQuestionSet: Pick<QuestionSet, "id" | "title"> = {
      id: "removed-question-set",
      title: "削除済みテーマ",
    };
    const entries = [
      createEntry("2026-08-10", removedQuestionSet),
      createEntry("2026-08-09", questionSets[1]),
    ];

    expect(getUnlockedPracticeQuestionSets(entries, questionSets).map((set) => set.id)).toEqual([
      questionSets[1].id,
    ]);
  });

  it("利用可能な問題セット配列を変更しても履歴にないテーマは解放しない", () => {
    const entries = [createEntry("2026-08-10", questionSets[0])];
    const availableSets = [...questionSets, {
      ...questionSets[0],
      id: "future-practice-set",
      title: "未プレイテーマ",
    }];

    expect(getUnlockedPracticeQuestionSets(entries, availableSets).map((set) => set.id)).toEqual([
      questionSets[0].id,
    ]);
  });
});
