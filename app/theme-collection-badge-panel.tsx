import type { ThemeCollectionBadge } from "@/lib/theme-collection";

type ThemeCollectionBadgePanelProps = Readonly<{
  badges: readonly ThemeCollectionBadge[];
}>;

export function ThemeCollectionBadgePanel({ badges }: ThemeCollectionBadgePanelProps) {
  if (badges.length === 0) return null;

  return (
    <section aria-labelledby="collection-badges-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-zinc-500">BADGES</p>
          <h2 id="collection-badges-title" className="mt-1 text-xl font-bold">
            コレクションバッジ
          </h2>
        </div>
        <p className="text-xs leading-5 text-zinc-500">
          {badges.filter((badge) => badge.unlocked).length} / {badges.length} 解除
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {badges.map((badge) => {
          const displayedCurrent = Math.min(badge.current, badge.target);
          const progress = (displayedCurrent / badge.target) * 100;

          return (
            <article
              key={badge.id}
              className={`rounded-2xl border p-4 ${
                badge.unlocked
                  ? "border-violet-300/25 bg-violet-300/8"
                  : "border-white/10 bg-zinc-950/75"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {badge.icon}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    badge.unlocked
                      ? "bg-violet-300/15 text-violet-200"
                      : "bg-white/5 text-zinc-500"
                  }`}
                >
                  {badge.unlocked ? "解除済み" : "挑戦中"}
                </span>
              </div>

              <h3 className="mt-3 font-bold">{badge.title}</h3>
              <p className="mt-1 text-sm leading-5 text-zinc-400">{badge.description}</p>

              <div
                className="mt-4 h-2 overflow-hidden rounded-full bg-black/25"
                role="progressbar"
                aria-label={`${badge.title}の進捗`}
                aria-valuemin={0}
                aria-valuemax={badge.target}
                aria-valuenow={displayedCurrent}
                aria-valuetext={`${displayedCurrent}/${badge.target}テーマ`}
              >
                <div
                  className="h-full rounded-full bg-violet-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs tabular-nums text-zinc-500">
                {displayedCurrent} / {badge.target}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
