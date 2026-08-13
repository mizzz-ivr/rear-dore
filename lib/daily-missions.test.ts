import { describe, expect, it } from "vitest";
import {
  calculateDailyMissionProgress,
  getDailyMission,
  getDailyMissionProgress,
  type DailyMission,
} from "./daily-missions";
import {
  calculateResult,
  getDailyQuestionSet,
  type AnswerResult,
} from "./game";

function answer(
  rarity: AnswerResult["rarity"],
  score: number,
  questionId = `question-${rarity}-${score}`,
): AnswerResult {
  return {
    questionId,
    choiceId: `choice-${rarity}-${score}`,
    choiceLabel: `${rarity}の回答`,
    percentage: rarity === "多数派" ? 40 : rarity === "N" ? 20 : rarity === "R" ? 10 : rarity === "SR" ? 5 : rarity === "SSR" ? 2 : 1,
    rarity,
    score,
  };
}

function chooseBestAnswersForMission(dateKey: string): AnswerResult[] {
  const mission = getDailyMission(dateKey);
  const questionSet = getDailyQuestionSet(dateKey);

  return questionSet.questions.map((question) => {
    const candidates = question.choices.map((choice) => calculateResult(question.id, choice));

    return candidates.reduce((best, candidate) => {
      const bestValue = calculateDailyMissionProgress(mission, [best]).current;
      const candidateValue = calculateDailyMissionProgress(mission, [candidate]).current;
      return candidateValue > bestValue ? candidate : best;
    });
  });
}

describe("getDailyMission", () => {
  it("2026-08-08から7種類を固定順で返す", () => {
    expect([
      "2026-08-08",
      "2026-08-09",
      "2026-08-10",
      "2026-08-11",
      "2026-08-12",
      "2026-08-13",
      "2026-08-14",
    ].map((dateKey) => getDailyMission(dateKey).id)).toEqual([
      "minority-3",
      "r-or-better-2",
      "score-500",
      "minority-4",
      "sr-or-better-1",
      "score-750",
      "minority-5",
    ]);
  });

  it("翌週も同じ曜日位置のミッションを再現する", () => {
    expect(getDailyMission("2026-08-15").id).toBe(getDailyMission("2026-08-08").id);
    expect(getDailyMission("2026-08-21").id).toBe(getDailyMission("2026-08-14").id);
  });

  it("基準日より前も安定して循環する", () => {
    expect(getDailyMission("2026-08-07").id).toBe("minority-5");
  });

  it.each(["2026/08/13", "2026-02-30", "2026-13-01", "invalid"])(
    "不正な日付%sを拒否する",
    (dateKey) => {
      expect(() => getDailyMission(dateKey)).toThrow(RangeError);
    },
  );
});

describe("calculateDailyMissionProgress", () => {
  it("回答前は0から開始する", () => {
    const progress = getDailyMissionProgress("2026-08-08", []);

    expect(progress.current).toBe(0);
    expect(progress.completed).toBe(false);
  });

  it("多数派以外だけを少数派として数える", () => {
    const mission = getDailyMission("2026-08-08");
    const progress = calculateDailyMissionProgress(mission, [
      answer("多数派", 20),
      answer("N", 75),
      answer("R", 150),
      answer("SR", 300),
    ]);

    expect(progress.current).toBe(3);
    expect(progress.completed).toBe(true);
  });

  it("R以上ではR・SR・SSR・URだけを数える", () => {
    const mission = getDailyMission("2026-08-09");
    const progress = calculateDailyMissionProgress(mission, [
      answer("多数派", 20),
      answer("N", 75),
      answer("R", 150),
      answer("SR", 300),
      answer("SSR", 500),
      answer("UR", 1_000),
    ]);

    expect(progress.current).toBe(4);
    expect(progress.completed).toBe(true);
  });

  it("SR以上ではSR・SSR・URだけを数える", () => {
    const mission = getDailyMission("2026-08-12");

    expect(calculateDailyMissionProgress(mission, [answer("R", 150)]).completed).toBe(false);
    expect(calculateDailyMissionProgress(mission, [answer("SR", 300)]).completed).toBe(true);
  });

  it("合計点は回答済みスコアをそのまま加算する", () => {
    const mission = getDailyMission("2026-08-10");

    expect(
      calculateDailyMissionProgress(mission, [answer("R", 150), answer("SR", 300)]),
    ).toMatchObject({ current: 450, completed: false });
    expect(
      calculateDailyMissionProgress(mission, [answer("R", 150), answer("SR", 300), answer("N", 75)]),
    ).toMatchObject({ current: 525, completed: true });
  });

  it("目標値を超えても実際の現在値を保持する", () => {
    const mission: DailyMission = {
      id: "test-score",
      title: "テスト",
      description: "テスト",
      icon: "🧪",
      metric: "score",
      target: 100,
      unit: "点",
    };
    const progress = calculateDailyMissionProgress(mission, [answer("UR", 1_000)]);

    expect(progress.current).toBe(1_000);
    expect(progress.completed).toBe(true);
  });
});

describe("デイリーミッションと問題セットの整合性", () => {
  it.each([
    "2026-08-08",
    "2026-08-09",
    "2026-08-10",
    "2026-08-11",
    "2026-08-12",
    "2026-08-13",
    "2026-08-14",
  ])("%sのミッションは当日の5問で理論上達成できる", (dateKey) => {
    const mission = getDailyMission(dateKey);
    const bestAnswers = chooseBestAnswersForMission(dateKey);
    const progress = calculateDailyMissionProgress(mission, bestAnswers);

    expect(bestAnswers).toHaveLength(5);
    expect(progress.completed).toBe(true);
  });
});
