"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { questionSets } from "@/lib/game";
import {
  PLAY_HISTORY_STORAGE_KEY,
  restorePlayHistory,
} from "@/lib/history";
import {
  calculateThemeCollectionSummary,
  restoreThemeCollection,
  serializeThemeCollection,
  synchronizeThemeCollection,
  THEME_COLLECTION_STORAGE_KEY,
  type ThemeCollectionSummary,
} from "@/lib/theme-collection";

const emptySummary = calculateThemeCollectionSummary([], questionSets);

function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-");
  return `${year}.${month}.${day}`;
}

type CollectionState = Readonly<{
  summary: ThemeCollectionSummary;
  failed: boolean;
}>;

function readCollectionState(): CollectionState {
  try {
    const history = restorePlayHistory(
      window.localStorage.getItem(PLAY_HISTORY_STORAGE_KEY),
    );
    const restoredCollection = restoreThemeCollection(
      window.localStorage.getItem(THEME_COLLECTION_STORAGE_KEY),
      questionSets,
    );
    const synchronized = synchronizeThemeCollection(
      restoredCollection,
      history,
      questionSets,
    );

    window.localStorage.setItem(
      THEME_COLLECTION_STORAGE_KEY,
      serializeThemeCollection(synchronized, questionSets),
    );

    return {
      summary: calculateThemeCollectionSummary(synchronized, questionSets),
      failed: false,
    };
  } catch {
    return {
      summary: emptySummary,
      failed: true,
    };
  }
}

export default function CollectionPage() {
  const [summary, setSummary] = useState<ThemeCollectionSummary>(emptySummary);
  const [storageReady, setStorageReady] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);

  useEffect(() => {
    function applyState(): void {
      const nextState = readCollectionState();
      const frameId = window.requestAnimationFrame(() => {
        setSummary(nextState.summary);
        setStorageFailed(nextState.failed);
        setStorageReady(true);
      });

      return window.cancelAnimationFrame.bind(window, frameId);
    }

    let cancelFrame = applyState();

    function handleStorage(event: StorageEvent): void {
      if (
        event.key !== PLAY_HISTORY_STORAGE_KEY &&
        event.key !== THEME_COLLECTION_STORAGE_KEY
      ) {
        return;
      }

      cancelFrame();
      cancelFrame = applyState();
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      cancelFrame();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  if (!storageReady) {
    return (
      <main
        id="main-content"
        className="min-h-screen px-4 py-8 sm:px-6 sm:py-14"
        aria-busy="true"
        tabIndex={-1}
      >
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <header>
            <p className="text-xs font-medium tracking-[0.22em] text-violet-300">
              THEME COLLECTION
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">テーマコレクション</h1>
          </header>
          <div
            className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-6 text-center sm:p-10"
            role="status"
          >
            <p className="font-semibold">発見済みテーマを確認しています</p>
          </div>
        </section>
      </main>
    );
  }

  const progress = summary.totalCount === 0
    ? 0
    : (summary.discoveredCount / summary.totalCount) * 100;

  return (
    <main
      id="main-content"
      className="min-h-screen px-4 py-8 sm:px-6 sm:py-14"
      tabIndex={-1}
    >
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header>
          <p className="text-xs font-medium tracking-[0.22em] text-violet-300">
            THEME COLLECTION
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            テーマコレクション
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            デイリーで出会ったテーマを集めます。未発見テーマの名前は、遊ぶまで秘密です。
          </p>
        </header>

        {storageFailed && (
          <div
            className="rounded-2xl border border-amber-300/25 bg-amber-300/8 p-4 text-sm leading-6 text-amber-100"
            role="status"
          >
            このブラウザの保存領域を利用できないため、コレクションを読み込めませんでした。
          </div>
        )}

        <section
          className="rounded-[2rem] border border-violet-300/20 bg-violet-300/8 p-5 sm:p-7"
          aria-labelledby="collection-progress-title"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-[0.18em] text-violet-300">
                DISCOVERED
              </p>
              <h2 id="collection-progress-title" className="mt-1 text-xl font-bold">
                発見したテーマ
              </h2>
            </div>
            <p className="text-2xl font-black tabular-nums text-violet-200">
              {summary.discoveredCount}
              <span className="ml-1 text-sm font-semibold text-zinc-400">
                / {summary.totalCount}
              </span>
            </p>
          </div>

          <div
            className="mt-5 h-3 overflow-hidden rounded-full bg-black/20"
            role="progressbar"
            aria-label="テーマコレクション進捗"
            aria-valuemin={0}
            aria-valuemax={summary.totalCount}
            aria-valuenow={summary.discoveredCount}
            aria-valuetext={`${summary.totalCount}テーマ中${summary.discoveredCount}テーマ発見`}
          >
            <div
              className="h-full rounded-full bg-violet-300 transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section aria-labelledby="theme-list-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-[0.18em] text-zinc-500">COLLECTION</p>
              <h2 id="theme-list-title" className="mt-1 text-xl font-bold">
                テーマ図鑑
              </h2>
            </div>
            <p className="text-xs leading-5 text-zinc-500">各テーマ5問</p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {summary.items.map((item, index) => (
              <article
                key={item.questionSetId}
                className={`min-w-0 rounded-2xl border p-5 ${
                  item.discovered
                    ? "border-violet-300/25 bg-violet-300/8"
                    : "border-white/10 bg-zinc-950/75"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium tracking-[0.16em] text-zinc-500">
                    THEME {String(index + 1).padStart(2, "0")}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.discovered
                        ? "bg-violet-300/15 text-violet-200"
                        : "bg-white/5 text-zinc-500"
                    }`}
                  >
                    {item.discovered ? "発見済み" : "未発見"}
                  </span>
                </div>

                <h3 className="mt-4 break-words text-xl font-bold">
                  {item.title ?? "？？？"}
                </h3>

                {item.discovered && item.discoveredOn ? (
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    初回発見日: {formatDateKey(item.discoveredOn)}
                  </p>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    デイリーでこのテーマに出会うと解放されます。
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link href="/" className="primary-button text-center">
            本日のデイリーへ
          </Link>
          <Link href="/practice" className="secondary-button text-center">
            練習モードへ
          </Link>
        </div>

        <p className="text-center text-xs leading-5 text-zinc-500">
          コレクションはこのブラウザだけに保存されます。ブラウザデータを削除すると発見状態も失われます。
        </p>
      </section>
    </main>
  );
}
