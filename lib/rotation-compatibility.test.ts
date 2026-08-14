import { expect, it } from "vitest";
import { calculateDailyMissionProgress, getDailyMission } from "./daily-missions";
import { calculateResult, getDailyQuestionSet } from "./game";

const DAY = 24 * 60 * 60 * 1000;
const START = Date.UTC(2026, 7, 15);

function getDateKey(index: number): string {
  return new Date(START + index * DAY).toISOString().slice(0, 10);
}

it("10テーマと7ミッションの全組み合わせを達成可能にする", () => {
  const combinations = new Set<string>();

  for (let index = 0; index < 70; index += 1) {
    const dateKey = getDateKey(index);
    const mission = getDailyMission(dateKey);
    const questionSet = getDailyQuestionSet(dateKey);
    const answers = questionSet.questions.map((question) => {
      const candidates = question.choices.map((choice) =>
        calculateResult(question.id, choice),
      );

      return candidates.reduce((best, candidate) => {
        const bestValue = calculateDailyMissionProgress(mission, [best]).current;
        const candidateValue = calculateDailyMissionProgress(mission, [candidate]).current;
        return candidateValue > bestValue ? candidate : best;
      });
    });

    expect(calculateDailyMissionProgress(mission, answers).completed).toBe(true);
    combinations.add(`${questionSet.id}:${mission.id}`);
  }

  expect(combinations.size).toBe(70);
});
