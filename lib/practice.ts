import type { QuestionSet } from "./game";
import type { PlayHistoryEntry } from "./history";

export function getUnlockedPracticeQuestionSets(
  entries: readonly PlayHistoryEntry[],
  availableQuestionSets: readonly QuestionSet[],
): QuestionSet[] {
  const availableById = new Map(availableQuestionSets.map((questionSet) => [questionSet.id, questionSet]));
  const unlocked: QuestionSet[] = [];
  const seenIds = new Set<string>();

  const newestFirst = [...entries].sort((left, right) => right.dateKey.localeCompare(left.dateKey));

  for (const entry of newestFirst) {
    if (seenIds.has(entry.questionSetId)) continue;

    const questionSet = availableById.get(entry.questionSetId);
    if (!questionSet) continue;

    seenIds.add(questionSet.id);
    unlocked.push(questionSet);
  }

  return unlocked;
}
