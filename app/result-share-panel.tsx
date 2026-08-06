"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AchievementPanel } from "@/app/achievement-panel";
import { AchievementUnlockNotice } from "@/app/achievement-unlock-notice";
import { PlayHistoryPanel } from "@/app/play-history-panel";
import {
  calculateLocalAchievements,
  calculateNewlyUnlockedAchievements,
  type LocalAchievement,
} from "@/lib/achievements";
import { getDailyQuestionSet, type AnswerResult } from "@/lib/game";
import {
  calculatePlayHistoryStats,
  calculatePlayHistoryTrend,
  createPlayHistoryEntry,
  PLAY_HISTORY_STORAGE_KEY,
  restorePlayHistory,
  serializePlayHistory,
  upsertPlayHistory,
  type PlayHistoryEntry,
} from "@/lib/history";
import {
  appendShareUrl,
  buildRarityGrid,
  buildShareText,
  buildXShareUrl,
} from "@/lib/share";

type ResultSharePanelProps = Readonly<{
  dateKey: string;
  questionSetTitle: string;
  totalScore: number;
  playerTitle: string;
  answers: readonly AnswerResult[];
}>;

type ShareStatus = "shared" | "copied" | "x-opened" | "failed" | null;

type HistoryInitialization = Readonly<{
  entrySignature: string;
  history: PlayHistoryEntry[];
  newlyUnlockedAchievements: readonly LocalAchievement[];
}>;

const statusMessage: Record<Exclude<ShareStatus, null>, string> = {
  shared: "結果を共有しました。",
  copied: "共有文面をクリップボードへコピーしました。",
  "x-opened": "Xの共有画面を開きました。",
  failed: "共有画面を開けませんでした。ブラウザのポップアップ設定を確認してください。",
};

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function ResultSharePanel({
  dateKey,
  questionSetTitle,
  totalScore,
  playerTitle,
  answers,
}: ResultSharePanelProps) {
  const [shareStatus, setShareStatus] = useState<ShareStatus>(null);
  const currentHistoryEntry = useMemo(() => {
    const questionSet = getDailyQuestionSet(dateKey);

    return createPlayHistoryEntry({
      dateKey,
      questionSetId: questionSet.id,
      questionSetTitle,
      totalScore,
      playerTitle,
      rarities: answers.map((answer) => answer.rarity),
    });
  }, [answers, dateKey, playerTitle, questionSetTitle, totalScore]);
  const currentEntrySignature = useMemo(
    () => JSON.stringify(currentHistoryEntry),
    [currentHistoryEntry],
  );
  const historyInitializationRef = useRef<HistoryInitialization | null>(null);
  const [playHistory, setPlayHistory] = useState<PlayHistoryEntry[]>(() => [currentHistoryEntry]);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<
    readonly LocalAchievement[]
  >([]);
  const rarityGrid = useMemo(() => buildRarityGrid(answers), [answers]);
  const rarityText = answers.map((answer) => answer.rarity).join("、");
  const shareText = useMemo(
    () =>
      buildShareText({
        dateKey,
        questionSetTitle,
        totalScore,
        playerTitle,
        answers,
      }),
    [answers, dateKey, playerTitle, questionSetTitle, totalScore],
  );
  const playHistoryStats = useMemo(
    () => calculatePlayHistoryStats(playHistory, dateKey),
    [dateKey, playHistory],
  );
  const playHistoryTrend = useMemo(
    () => calculatePlayHistoryTrend(playHistory),
    [playHistory],
  );
  const localAchievements = useMemo(
    () => calculateLocalAchievements(playHistory, playHistoryStats),
    [playHistory, playHistoryStats],
  );

  useEffect(() => {
    let initialization = historyInitializationRef.current;

    if (!initialization || initialization.entrySignature !== currentEntrySignature) {
      let nextHistory = [currentHistoryEntry];
      let unlockedAchievements: readonly LocalAchievement[] = [];

      try {
        const restoredHistory = restorePlayHistory(
          window.localStorage.getItem(PLAY_HISTORY_STORAGE_KEY),
        );
        nextHistory = upsertPlayHistory(restoredHistory, currentHistoryEntry);
        const candidateAchievements = calculateNewlyUnlockedAchievements(
          restoredHistory,
          nextHistory,
          dateKey,
        );
        window.localStorage.setItem(
          PLAY_HISTORY_STORAGE_KEY,
          serializePlayHistory(nextHistory),
        );
        unlockedAchievements = candidateAchievements;
      } catch {
        // 履歴の読み書きに失敗した場合は、誤った解除通知を出さず結果表示を継続する。
      }

      initialization = {
        entrySignature: currentEntrySignature,
        history: nextHistory,
        newlyUnlockedAchievements: unlockedAchievements,
      };
      historyInitializationRef.current = initialization;
    }

    const frameId = window.requestAnimationFrame(() => {
      setPlayHistory(initialization.history);
      setNewlyUnlockedAchievements(initialization.newlyUnlockedAchievements);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [currentEntrySignature, currentHistoryEntry, dateKey]);

  async function shareResult(): Promise<void> {
    setShareStatus(null);
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({ title: "レアどれ？", text: shareText, url });
        setShareStatus("shared");
        return;
      } catch (error) {
        if (isAbortError(error)) return;
      }
    }

    const textWithUrl = appendShareUrl(shareText, url);

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(textWithUrl);
        setShareStatus("copied");
        return;
      } catch {
        // Clipboardが利用できない場合はX共有へフォールバックする。
      }
    }

    const popup = window.open(buildXShareUrl(textWithUrl), "_blank");
    if (!popup) {
      setShareStatus("failed");
      return;
    }

    popup.opener = null;
    setShareStatus("x-opened");
  }

  return (
    <>
      <AchievementUnlockNotice achievements={newlyUnlockedAchievements} />

      <PlayHistoryPanel
        entries={playHistory}
        stats={playHistoryStats}
        trend={playHistoryTrend}
      />

      <AchievementPanel summary={localAchievements} />

      <section
        className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-5 sm:p-7"
        aria-labelledby="share-title"
      >
        <div className="text-center">
          <p id="share-title" className="text-sm font-semibold text-zinc-200">
            ネタバレなしで結果を共有
          </p>
          <p className="mt-2 text-4xl tracking-[0.18em] sm:text-5xl">
            <span aria-hidden="true">{rarityGrid}</span>
            <span className="sr-only">回答順のレア度: {rarityText}</span>
          </p>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            問題文・選択肢・回答内容は共有文面に含まれません。
          </p>
        </div>

        <button type="button" className="primary-button mt-6 w-full" onClick={shareResult}>
          結果を共有する
        </button>

        {shareStatus && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-6 ${shareStatus === "failed" ? "border-red-300/25 bg-red-300/8 text-red-100" : "border-lime-300/25 bg-lime-300/8 text-lime-100"}`}
            role={shareStatus === "failed" ? "alert" : "status"}
            aria-live="polite"
          >
            {statusMessage[shareStatus]}
          </div>
        )}
      </section>
    </>
  );
}
