"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateResult,
  DEFAULT_QUESTION_SET,
  getDailyQuestionSet,
  getPlayerTitle,
  type AnswerResult,
} from "@/lib/game";
import {
  createDailyProgress,
  DAILY_PROGRESS_STORAGE_KEY,
  getJapanDateKey,
  getMillisecondsUntilNextJapanDay,
  restoreDailyProgress,
  serializeDailyProgress,
} from "@/lib/progress";

function formatPercentage(value: number): string {
  return `${value.toFixed(value < 10 ? 1 : 0)}%`;
}

function clearStoredDailyProgress(): void {
  try {
    window.localStorage.removeItem(DAILY_PROGRESS_STORAGE_KEY);
  } catch {
    // localStorageを利用できない環境でも、画面状態の更新は継続する。
  }
}

function StorageLoadingState() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10" aria-busy="true">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header>
          <p className="text-xs font-medium tracking-[0.22em] text-lime-300">RARE DORE?</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">レアどれ？</h1>
        </header>
        <div className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-6 text-center sm:p-10" role="status">
          <p className="font-semibold">今日の問題と記録を確認しています</p>
          <p className="mt-2 text-sm text-zinc-400">回答途中の場合は、同じ問題セットの続きから再開します。</p>
        </div>
      </section>
    </main>
  );
}

type DayChangeNoticeProps = Readonly<{
  onDismiss: () => void;
}>;

function DayChangeNotice({ onDismiss }: DayChangeNoticeProps) {
  return (
    <div
      className="flex items-start justify-between gap-4 rounded-2xl border border-lime-300/25 bg-lime-300/8 px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <div>
        <p className="font-semibold text-lime-200">日付が変わりました</p>
        <p className="mt-1 text-sm leading-6 text-zinc-300">本日の新しい5問へ自動で切り替えました。</p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white"
        onClick={onDismiss}
      >
        閉じる
      </button>
    </div>
  );
}

export default function HomePage() {
  const [questionSet, setQuestionSet] = useState(DEFAULT_QUESTION_SET);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [completed, setCompleted] = useState(false);
  const [dailyDateKey, setDailyDateKey] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [dayChangeNoticeVisible, setDayChangeNoticeVisible] = useState(false);

  const questions = questionSet.questions;
  const question = questions[questionIndex];
  const currentAnswer = answers.find((answer) => answer.questionId === question.id);
  const selectedChoice = question.choices.find((choice) => choice.id === selectedChoiceId);

  const totalScore = useMemo(
    () => answers.reduce((sum, answer) => sum + answer.score, 0),
    [answers],
  );
  const rareAnswerCount = answers.filter((answer) => answer.percentage <= 8).length;
  const bestAnswer = [...answers].sort((a, b) => a.percentage - b.percentage)[0];

  useEffect(() => {
    const dateKey = getJapanDateKey();
    const dailyQuestionSet = getDailyQuestionSet(dateKey);
    let restoredProgress: ReturnType<typeof restoreDailyProgress> = null;

    try {
      const rawValue = window.localStorage.getItem(DAILY_PROGRESS_STORAGE_KEY);
      restoredProgress = restoreDailyProgress(
        rawValue,
        dateKey,
        dailyQuestionSet.id,
        dailyQuestionSet.questions,
      );

      if (!restoredProgress && rawValue) {
        window.localStorage.removeItem(DAILY_PROGRESS_STORAGE_KEY);
      }
    } catch {
      // localStorageが利用できない環境でも、ゲーム自体は継続する。
    }

    const frameId = window.requestAnimationFrame(() => {
      setQuestionSet(dailyQuestionSet);

      if (restoredProgress) {
        setAnswers(restoredProgress.answers);
        setQuestionIndex(restoredProgress.questionIndex);
        setSelectedChoiceId(restoredProgress.selectedChoiceId);
        setCompleted(restoredProgress.completed);
      }

      setDailyDateKey(dateKey);
      setStorageReady(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!storageReady || !dailyDateKey) return;

    try {
      const progress = createDailyProgress({
        dateKey: dailyDateKey,
        questionSetId: questionSet.id,
        questions,
        answers,
        questionIndex,
        completed,
      });
      window.localStorage.setItem(DAILY_PROGRESS_STORAGE_KEY, serializeDailyProgress(progress));
    } catch {
      // 保存に失敗しても回答操作は止めない。
    }
  }, [answers, completed, dailyDateKey, questionIndex, questionSet.id, questions, storageReady]);

  useEffect(() => {
    if (!storageReady || !dailyDateKey) return;

    let activeDateKey = dailyDateKey;
    let timerId: number | undefined;

    function switchToCurrentDay(): boolean {
      const currentDateKey = getJapanDateKey();
      if (currentDateKey === activeDateKey) return false;

      activeDateKey = currentDateKey;
      const currentQuestionSet = getDailyQuestionSet(currentDateKey);

      clearStoredDailyProgress();
      setQuestionSet(currentQuestionSet);
      setQuestionIndex(0);
      setSelectedChoiceId(null);
      setAnswers([]);
      setCompleted(false);
      setDailyDateKey(currentDateKey);
      setDayChangeNoticeVisible(true);

      return true;
    }

    function scheduleNextDayCheck(): void {
      timerId = window.setTimeout(() => {
        const switched = switchToCurrentDay();

        if (!switched) {
          scheduleNextDayCheck();
        }
      }, getMillisecondsUntilNextJapanDay() + 250);
    }

    function handleVisibilityChange(): void {
      if (document.visibilityState === "visible") {
        switchToCurrentDay();
      }
    }

    scheduleNextDayCheck();
    window.addEventListener("focus", switchToCurrentDay);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
      window.removeEventListener("focus", switchToCurrentDay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dailyDateKey, storageReady]);

  function confirmAnswer() {
    if (!selectedChoice || currentAnswer) return;

    const result = calculateResult(question.id, selectedChoice);
    setAnswers((current) => [...current, result]);
  }

  function moveNext() {
    if (!currentAnswer) return;

    if (questionIndex === questions.length - 1) {
      setCompleted(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedChoiceId(null);
  }

  function restart() {
    const shouldRestart = window.confirm("今日の回答記録を消して、最初から遊び直しますか？");
    if (!shouldRestart) return;

    clearStoredDailyProgress();
    setQuestionIndex(0);
    setSelectedChoiceId(null);
    setAnswers([]);
    setCompleted(false);
  }

  async function shareResult() {
    const title = getPlayerTitle(totalScore);
    const text = `今日のレアどれ？「${questionSet.title}」は${totalScore.toLocaleString("ja-JP")}点。称号「${title}」でした。 #レアどれ`;
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({ title: "レアどれ？", text, url });
        return;
      } catch {
        return;
      }
    }

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text}\n${url}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (!storageReady) {
    return <StorageLoadingState />;
  }

  if (completed) {
    const title = getPlayerTitle(totalScore);

    return (
      <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-14">
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-8">
          <header className="text-center">
            <p className="text-sm font-medium tracking-[0.24em] text-lime-300">TODAY&apos;S RESULT</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">レアどれ？</h1>
            <p className="mt-2 text-sm text-zinc-400">本日の5問・{questionSet.title}</p>
          </header>

          <div className="result-shell overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 sm:p-10">
            <p className="text-center text-sm text-zinc-400">今日のレア回答力</p>
            <p className="mt-2 text-center text-6xl font-black tabular-nums text-lime-300 sm:text-7xl">
              {totalScore.toLocaleString("ja-JP")}
              <span className="ml-2 text-lg text-zinc-400">点</span>
            </p>
            <div className="mt-8 rounded-2xl border border-lime-300/20 bg-lime-300/8 p-5 text-center">
              <p className="text-xs font-medium tracking-[0.2em] text-lime-200">称号</p>
              <p className="mt-2 text-2xl font-bold">{title}</p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <dt className="text-sm text-zinc-400">SR以上</dt>
                <dd className="mt-1 text-2xl font-bold">{rareAnswerCount} / {questions.length}</dd>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <dt className="text-sm text-zinc-400">最レア回答</dt>
                <dd className="mt-1 text-2xl font-bold">{bestAnswer ? formatPercentage(bestAnswer.percentage) : "-"}</dd>
              </div>
            </dl>

            {bestAnswer && (
              <p className="mt-5 text-center text-sm leading-6 text-zinc-400">
                一番レアだった選択は「<span className="text-zinc-100">{bestAnswer.choiceLabel}</span>」でした。
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" className="primary-button" onClick={shareResult}>
              結果を共有する
            </button>
            <button type="button" className="secondary-button" onClick={restart}>
              記録を消して遊び直す
            </button>
          </div>

          <p className="text-center text-xs leading-5 text-zinc-500">
            回答はこのブラウザに、日本時間の当日分として保存されます。問題は毎日0時に自動更新されます。
          </p>
        </section>
      </main>
    );
  }

  const progress = ((questionIndex + (currentAnswer ? 1 : 0)) / questions.length) * 100;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-lime-300">RARE DORE?</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">レアどれ？</h1>
            <p className="mt-1 text-xs text-zinc-500">本日の5問・{questionSet.title}</p>
          </div>
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold tabular-nums">
            {questionIndex + 1} / {questions.length}
          </p>
        </header>

        {dayChangeNoticeVisible && (
          <DayChangeNotice onDismiss={() => setDayChangeNoticeVisible(false)} />
        )}

        <div aria-label="回答進捗" className="h-2 overflow-hidden rounded-full bg-white/8">
          <div className="h-full rounded-full bg-lime-300 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
        </div>

        <article className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-5 sm:p-8">
          <p className="text-sm font-medium text-zinc-400">みんなが選ばなそうな答えは、どれ？</p>
          <h2 className="mt-3 text-2xl font-bold leading-snug sm:text-4xl">{question.prompt}</h2>

          <fieldset className="mt-7 space-y-3" disabled={Boolean(currentAnswer)}>
            <legend className="sr-only">回答を1つ選択してください</legend>
            {question.choices.map((choice, index) => {
              const selected = selectedChoiceId === choice.id;

              return (
                <label
                  key={choice.id}
                  className={`choice-card ${selected ? "choice-card-selected" : ""} ${currentAnswer ? "cursor-default" : "cursor-pointer"}`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={choice.id}
                    checked={selected}
                    onChange={() => setSelectedChoiceId(choice.id)}
                    className="sr-only"
                  />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-semibold leading-6">{choice.label}</span>
                </label>
              );
            })}
          </fieldset>

          {!currentAnswer ? (
            <button type="button" className="primary-button mt-6 w-full" disabled={!selectedChoiceId} onClick={confirmAnswer}>
              この答えで決定
            </button>
          ) : (
            <section className="mt-7 border-t border-white/10 pt-7" aria-live="polite">
              <div className="flex flex-col gap-3 rounded-2xl border border-lime-300/25 bg-lime-300/8 p-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-lime-200">あなたの回答は</p>
                  <p className="mt-1 text-3xl font-black">{currentAnswer.rarity}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-4xl font-black tabular-nums text-lime-300">{formatPercentage(currentAnswer.percentage)}</p>
                  <p className="mt-1 text-sm text-zinc-400">+{currentAnswer.score.toLocaleString("ja-JP")}点</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {question.choices.map((choice) => (
                  <div key={choice.id}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className={choice.id === currentAnswer.choiceId ? "font-bold text-lime-200" : "text-zinc-300"}>{choice.label}</span>
                      <span className="shrink-0 tabular-nums text-zinc-400">{formatPercentage(choice.percentage)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                      <div
                        className={`h-full rounded-full ${choice.id === currentAnswer.choiceId ? "bg-lime-300" : "bg-zinc-600"}`}
                        style={{ width: `${choice.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" className="primary-button mt-7 w-full" onClick={moveNext}>
                {questionIndex === questions.length - 1 ? "総合結果を見る" : "次の問題へ"}
              </button>
            </section>
          )}
        </article>

        <p className="text-center text-xs leading-5 text-zinc-500">
          回答するまで全体の分布は表示されません。問題は毎日0時（日本時間）に自動更新されます。
        </p>
      </section>
    </main>
  );
}
