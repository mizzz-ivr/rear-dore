import type { LocalAchievement, LocalAchievementSummary } from "@/lib/achievements";

type AchievementPanelProps = Readonly<{
  summary: LocalAchievementSummary;
}>;

function formatNumber(value: number): string {
  return value.toLocaleString("ja-JP");
}

function formatProgress(achievement: LocalAchievement): string {
  const current = Math.min(achievement.current, achievement.target);
  return `${formatNumber(current)}/${formatNumber(achievement.target)}${achievement.unit}`;
}

function getProgressPercentage(achievement: LocalAchievement): number {
  return Math.min(100, Math.round((achievement.current / achievement.target) * 100));
}

export function AchievementPanel({ summary }: AchievementPanelProps) {
  return (
    <section
      className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-5 sm:p-7"
      aria-labelledby="achievement-title"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-amber-200">ACHIEVEMENTS</p>
          <h2 id="achievement-title" className="mt-2 text-xl font-bold">
            このブラウザの実績
          </h2>
        </div>
        <p className="shrink-0 text-right text-sm font-semibold tabular-nums text-amber-100">
          {summary.unlockedCount}/{summary.totalCount} 解除
        </p>
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="実績一覧">
        {summary.achievements.map((achievement) => {
          const progressText = formatProgress(achievement);
          const progressPercentage = getProgressPercentage(achievement);

          return (
            <li
              key={achievement.id}
              className={`rounded-2xl border p-4 ${achievement.unlocked ? "border-amber-200/30 bg-amber-200/8" : "border-white/8 bg-white/[0.03]"}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-2xl ${achievement.unlocked ? "bg-amber-200/15" : "bg-white/5 grayscale"}`}
                  aria-hidden="true"
                >
                  {achievement.icon}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-zinc-100">{achievement.title}</h3>
                    <span
                      className={`rounded-full border px-2 py-1 text-[0.65rem] font-bold tracking-wide ${achievement.unlocked ? "border-amber-200/30 bg-amber-200/10 text-amber-100" : "border-white/10 bg-white/5 text-zinc-500"}`}
                    >
                      {achievement.unlocked ? "解除済み" : "未解除"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {achievement.unlocked ? (
                <p className="mt-4 text-xs font-semibold text-amber-100">
                  条件を達成しました。
                </p>
              ) : (
                <div className="mt-4">
                  <div
                    className="h-2 overflow-hidden rounded-full bg-white/8"
                    role="progressbar"
                    aria-label={`${achievement.title}の解除進捗`}
                    aria-valuemin={0}
                    aria-valuemax={achievement.target}
                    aria-valuenow={Math.min(achievement.current, achievement.target)}
                    aria-valuetext={progressText}
                  >
                    <div
                      className="h-full rounded-full bg-amber-200"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-xs font-medium tabular-nums text-zinc-500">
                    {progressText}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs leading-5 text-zinc-500">
        実績はこのブラウザの最大30日分の履歴から計算します。ブラウザデータの削除や開発者ツールでの編集により変化するため、達成の証明には利用できません。
      </p>
    </section>
  );
}
