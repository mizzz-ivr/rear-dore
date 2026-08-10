"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateResult,
  getPlayerTitle,
  questionSets,
  type AnswerResult,
  type QuestionSet,
} from "@/lib/game";
import { PLAY_HISTORY_STORAGE_KEY, restorePlayHistory } from "@/lib/history";
import { getUnlockedPracticeQuestionSets } from "@/lib/practice";

function formatPercentage(value: number): string {
  return `${value.toFixed(value < 10 ? 1 : 0)}%`;
}

type PendingFocusTarget = "themes" | "question" | "result" | null;

export default function PracticePage() {
  const [unlockedQuestionSets, setUnlockedQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<QuestionSet | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [completed, setCompleted] = useState(false);
  const [historyReady, setHistoryReady] = useState(false);
  const [historyReadFailed, setHistoryReadFailed] = useState(false);
  const themesHeadingRef = useRef<HTMLHeadingElement>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const pendingFocusRef = useRef<PendingFocusTarget>(null);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(PLAY_HISTORY_STORAGE_KEY);
      const history = restorePlayHistory(rawValue);
      setUnlockedQuestionSets(getUnlockedPracticeQuestionSets(history, questionSets));
    } catch {
      setHistoryReadFailed(true);
      setUnlockedQuestionSets([]);
    } finally {
      setHistoryReady(true);
    }
  }, []);

  useEffect(() => {
    const targetName = pendingFocusRef.current;
    if (!historyReady || !targetName) return;

    pendingFocusRef.current = null;
    const target =
      targetName === "themes"
        ? themesHeadingRef.current
        : targetName === "result"
          ? resultHeadingRef.current
          : questionHeadingRef.current;
    if (!target) return;

    const frameId = window.requestAnimationFrame(() => target.focus());
    return () => window.cancelAnimationFrame(frameId);
  }, [completed, historyReady, questionIndex, selectedQuestionSet]);

  const questions = selectedQuestionSet?.questions ?? [];
  const question = questions[questionIndex];
  const currentAnswer = question
    ? answers.find((answer) => answer.questionId === question.id)
    : undefined;
  const selectedChoice = question?.choices.find((choice) => choice.id === selectedChoiceId);
  const totalScore = useMemo(
    () => answers.reduce((sum, answer) => sum + answer.score, 0),
    [answers],
  );
  const rareAnswerCount = answers.filter((answer) => answer.percentage <= 8).length;
  const bestAnswer = [...answers].sort((left, right) => left.percentage - right.percentage)[0];

  function startPractice(questionSet: QuestionSet): void {
    pendingFocusRef.current = "question";
    setSelectedQuestionSet(questionSet);
    setQuestionIndex(0);
    setSelectedChoiceId(null);
    setAnswers([]);
    setCompleted(false);
  }

  function confirmAnswer(): void {
    if (!question || !selectedChoice || currentAnswer) return;

    setAnswers((current) => [...current, calculateResult(question.id, selectedChoice)]);
  }

  function moveNext(): void {
    if (!question || !currentAnswer) return;

    if (questionIndex === questions.length - 1) {
      pendingFocusRef.current = "result";
      setCompleted(true);
      return;
    }

    pendingFocusRef.current = "question";
    setQuestionIndex((current) => current + 1);
    setSelectedChoiceId(null);
  }

  function restartPractice(): void {
    if (!selectedQuestionSet) return;
    startPractice(selectedQuestionSet);
  }

  function returnToThemes(): void {
    pendingFocusRef.current = "themes";
    setSelectedQuestionSet(null);
    setQuestionIndex(0);
    setSelectedChoiceId(null);
    setAnswers([]);
    setCompleted(false);
  }

  if (!historyReady) {
    return (
      <main id="main-content" className="min-h-screen px-4 py-8 sm:px-6 sm:py-14" aria-busy="true" tabIndex={-1}>
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <header>
            <p className="text-xs font-medium tracking-[0.22em] text-sky-300">PRACTICE MODE</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">練習モード</h1>
          </header>
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-6 text-center sm:p-10" role="status">
            <p className="font-semibold">プレイ済みテーマを確認しています</p>
          </div>
        </section>
      </main>
    );
  }

  if (!selectedQuestionSet) {
    return (
      <main id="main-content" className="min-h-screen px-4 py-8 sm:px-6 sm:py-14" tabIndex={-1}>
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <header>
            <p className="text-xs font-medium tracking-[0.22em] text-sky-300">PRACTICE MODE</p>
            <h1 ref={themesHeadingRef} tabIndex={-1} className="focus-target mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              練習モード
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              一度クリアしたテーマを、記録に影響せず何度でも遊べます。
            </p>
          </header>

          <div className="rounded-2xl border border-sky-300/20 bg-sky-300/8 p-4 text-sm leading-6 text-zinc-300">
            <p className="font-semibold text-sky-200">練習結果は保存されません</p>
            <p className="mt-1">
              合計点、連続プレイ、履歴、実績、今日の回答進捗には反映しません。
            </p>
          </div>

          {historyReadFailed && (
            <div className="rounded-2xl border border-amber-300/25 bg-amber-300/8 p-4 text-sm leading-6 text-amber-100" role="status">
              このブラウザのプレイ履歴を読み込めなかったため、解放済みテーマを表示できませんでした。
            </div>
          )}

          <section aria-labelledby="unlocked-themes-heading" className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-5 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.18em] text-zinc-500">UNLOCKED</p>
                <h2 id="unlocked-themes-heading" className="mt-1 text-xl font-bold">プレイ済みテーマ</h2>
              </div>
              <p className="text-sm font-semibold tabular-nums text-zinc-400">
                {unlockedQuestionSets.length} / {questionSets.length}
              </p>
            </div>

            {unlockedQuestionSets.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-white/5 p-5 text-center">
                <p className="font-semibold">まだ練習できるテーマがありません</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  本日のデイリーを5問クリアすると、そのテーマが練習モードに追加されます。
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {unlockedQuestionSets.map((questionSet) => (
                  <button
                    key={questionSet.id}
                    type="button"
                    onClick={() => startPractice(questionSet)}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-sky-300/35 hover:bg-sky-300/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                  >
                    <span className="block text-xs font-medium tracking-[0.16em] text-sky-300">5 QUESTIONS</span>
                    <span className="mt-2 block text-lg font-bold">{questionSet.title}</span>
                    <span className="mt-1 block text-sm text-zinc-400">このテーマを練習する</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <Link href="/" className="secondary-button w-full text-center">
            本日のデイリーへ戻る
          </Link>
        </section>
      </main>
    );
  }

  if (completed) {
    const playerTitle = getPlayerTitle(totalScore);

    return (
      <main id="main-content" className="min-h-screen px-4 py-8 sm:px-6 sm:py-14" tabIndex={-1}>
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <header className="text-center">
            <p className="text-sm font-medium tracking-[0.22em] text-sky-300">PRACTICE RESULT</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{selectedQuestionSet.title}</h1>
            <p className="mt-2 text-sm text-zinc-400">練習モード・記録には反映されません</p>
          </header>

          <div className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 sm:p-10">
            <h2 ref={resultHeadingRef} tabIndex={-1} className="focus-target text-center text-sm text-zinc-400">
              今回のレア回答力
            </h2>
            <p className="mt-2 text-center text-6xl font-black tabular-nums text-sky-300 sm:text-7xl">
              {totalScore.toLocaleString("ja-JP")}
              <span className="ml-2 text-lg text-zinc-400">点</span>
            </p>

            <div className="mt-8 rounded-2xl border border-sky-300/20 bg-sky-300/8 p-5 text-center">
              <p className="text-xs font-medium tracking-[0.2em] text-sky-200">称号</p>
              <p className="mt-2 text-2xl font-bold">{playerTitle}</p>
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

          <button type="button" className="primary-button w-full" onClick={restartPractice}>
            同じテーマをもう一度
          </button>
          <button type="button" className="secondary-button w-full" onClick={returnToThemes}>
            別のテーマを選ぶ
          </button>
          <Link href="/" className="secondary-button w-full text-center">
            本日のデイリーへ戻る
          </Link>
        </section>
      </main>
    );
  }

  if (!question) {
    return null;
  }

  const completedQuestionCount = questionIndex + (currentAnswer ? 1 : 0);
  const progress = (completedQuestionCount / questions.length) * 100;

  return (
    <main id="main-content" className="min-h-screen px-4 py-6 sm:px-6 sm:py-10" tabIndex={-1}>
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-sky-300">PRACTICE MODE</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{selectedQuestionSet.title}</h1>
            <p className="mt-1 text-xs text-zinc-500">練習結果は保存されません</p>
          </div>
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold tabular-nums">
            {questionIndex + 1} / {questions.length}
          </p>
        </header>

        <div
          role="progressbar"
          aria-label="練習回答進捗"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={completedQuestionCount}
          aria-valuetext={`${questions.length}問中${completedQuestionCount}問完了`}
          className="h-2 overflow-hidden rounded-full bg-white/8"
        >
          <div
            className="h-full rounded-full bg-sky-300 transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        <article className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-5 sm:p-8">
          <p className="text-sm font-medium text-zinc-400">みんなが選ばなそうな答えは、どれ？</p>
          <h2
            id="practice-question-heading"
            ref={questionHeadingRef}
            tabIndex={-1}
            className="focus-target mt-3 text-2xl font-bold leading-snug sm:text-4xl"
          >
            {question.prompt}
          </h2>

          <fieldset className="mt-7 space-y-3" disabled={Boolean(currentAnswer)} aria-labelledby="practice-question-heading">
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
            <button
              type="button"
              className="primary-button mt-6 w-full"
              disabled={!selectedChoiceId}
              onClick={confirmAnswer}
            >
              この答えで決定
            </button>
          ) : (
            <section className="mt-7 border-t border-white/10 pt-7">
              <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                回答結果。{currentAnswer.rarity}。選択率{formatPercentage(currentAnswer.percentage)}。{currentAnswer.score.toLocaleString("ja-JP")}点獲得。
              </p>

              <div className="flex flex-col gap-3 rounded-2xl border border-sky-300/25 bg-sky-300/8 p-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-sky-200">あなたの回答は</p>
                  <p className="mt-1 text-3xl font-black">{currentAnswer.rarity}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-4xl font-black tabular-nums text-sky-300">{formatPercentage(currentAnswer.percentage)}</p>
                  <p className="mt-1 text-sm text-zinc-400">+{currentAnswer.score.toLocaleString("ja-JP")}点</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {question.choices.map((choice) => (
                  <div key={choice.id}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className={choice.id === currentAnswer.choiceId ? "font-bold text-sky-200" : "text-zinc-300"}>
                        {choice.label}
                      </span>
                      <span className="shrink-0 tabular-nums text-zinc-400">{formatPercentage(choice.percentage)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                      <div
                        className={`h-full rounded-full ${choice.id === currentAnswer.choiceId ? "bg-sky-300" : "bg-zinc-600"}`}
                        style={{ width: `${choice.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" className="primary-button mt-7 w-full" onClick={moveNext}>
                {questionIndex === questions.length - 1 ? "練習結果を見る" : "次の問題へ"}
              </button>
            </section>
          )}
        </article>

        <button type="button" className="secondary-button w-full" onClick={returnToThemes}>
          テーマ選択へ戻る
        </button>
      </section>
    </main>
  );
}
