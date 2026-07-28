import type { PlayHistoryEntry } from "@/lib/history";
import { buildRarityGrid } from "@/lib/share";

type PlayHistoryPanelProps = Readonly<{
  entries: readonly PlayHistoryEntry[];
  currentStreak: number;
}>;

function formatDate(dateKey: string): string {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export function PlayHistoryPanel({ entries, currentStreak }: PlayHistoryPanelProps) {
  const visibleEntries = entries.slice(0, 7);

  return (
    <section
      className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-5 sm:p-7"
      aria-labelledby="play-history-title"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-sky-200">PLAY HISTORY</p>
          <h2 id="play-history-title" className="mt-2 text-xl font-bold">
            このブラウザの記録
          </h2>
        </div>
        <p className="text-xs text-zinc-500">最大30日分</p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/5 p-4">
          <dt className="text-sm text-zinc-400">連続プレイ</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-sky-200">
            {currentStreak}日
          </dd>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <dt className="text-sm text-zinc-400">保存日数</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums">{entries.length}日</dd>
        </div>
      </dl>

      {visibleEntries.length > 0 ? (
        <ol className="mt-5 divide-y divide-white/8" aria-label="直近のプレイ履歴">
          {visibleEntries.map((entry) => {
            const rarityGrid = buildRarityGrid(
              entry.rarities.map((rarity) => ({ rarity })),
            );

            return (
              <li key={entry.dateKey} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-200">
                    <time dateTime={entry.dateKey}>{formatDate(entry.dateKey)}</time>
                    <span className="ml-2 text-zinc-500">{entry.questionSetTitle}</span>
                  </p>
                  <p className="mt-1 truncate text-xs text-zinc-500">{entry.playerTitle}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className="text-lg tracking-[0.12em]"
                    aria-label={`レア度: ${entry.rarities.join("、")}`}
                  >
                    {rarityGrid}
                  </p>
                  <p className="mt-1 text-sm font-semibold tabular-nums text-zinc-300">
                    {entry.totalScore.toLocaleString("ja-JP")}点
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-5 rounded-2xl bg-white/5 px-4 py-5 text-center text-sm text-zinc-400">
          完了した結果がここに保存されます。
        </p>
      )}

      {entries.length > visibleEntries.length && (
        <p className="mt-3 text-center text-xs text-zinc-500">
          直近7件を表示しています。
        </p>
      )}
    </section>
  );
}
