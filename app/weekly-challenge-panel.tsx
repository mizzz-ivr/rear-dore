import type { WeeklyChallenge, WeeklyChallengeSummary } from "@/lib/weekly-challenges";

type WeeklyChallengePanelProps = Readonly<{
  summary: WeeklyChallengeSummary;
}>;

function formatNumber(value: number): string {
  return value.toLocaleString("ja-JP");
}

function formatShortDate(dateKey: string): string {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function formatProgress(challenge: WeeklyChallenge): string {
  return `${formatNumber(challenge.current)}/${formatNumber(challenge.target)}${challenge.unit}`;
}

function getProgressPercentage(challenge: WeeklyChallenge): number {
  return Math.min(100, Math.round((challenge.current / challenge.target) * 100));
}

export function WeeklyChallengePanel({ summary }: WeeklyChallengePanelProps) {
  const weekLabel = `${formatShortDate(summary.weekStartDateKey)}〜${formatShortDate(summary.weekEndDateKey)}`;

  return (
    <section
      className="rounded-[2rem] border border-violet-300/20 bg-violet-300/[0.06] p-5 sm:p-7"
      aria-labelledby="weekly-challenge-title"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-violet-200">WEEKLY CHALLENGE</p>
          <h2 id="weekly-challenge-title" className="mt-2 text-xl font-bold">
            今週のチャレンジ
          </h2>
          <p className="mt-1 text-xs text-zinc-400">{weekLabel}・日本時間</p>
        </div>
        <p className="shrink-0 text-sm font-semibold tabular-nums text-violet-100">
          {summary.completedCount}/{summary.totalCount} 達成
        </p>
      </div>

      {summary.allCompleted && (
        <div
          className="mt-5 rounded-2xl border border-violet-200/30 bg-violet-200/10 px-4 py-3"
          role="status"
        >
          <p className="font-bold text-violet-100">🎉 今週のチャレンジをコンプリート！</p>
          <p className="mt-1 text-xs leading-5 text-zinc-300">
            3つの週間目標をすべて達成しました。次の月曜日に新しい週としてリセットされます。
          </p>
        </div>
      )}

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="今週のチャレンジ一覧">
        {summary.challenges.map((challenge) => {
          const progressText = formatProgress(challenge);
          const progressPercentage = getProgressPercentage(challenge);

          return (
            <li
              key={challenge.id}
              className={`rounded-2xl border p-4 ${challenge.completed ? "border-violet-200/30 bg-violet-200/8" : "border-white/8 bg-zinc-950/45"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {challenge.icon}
                </span>
                <span
                  className={`rounded-full border px-2 py-1 text-[0.65rem] font-bold ${challenge.completed ? "border-violet-200/30 bg-violet-200/10 text-violet-100" : "border-white/10 bg-white/5 text-zinc-500"}`}
                >
                  {challenge.completed ? "達成" : "挑戦中"}
                </span>
              </div>

              <h3 className="mt-3 font-bold text-zinc-100">{challenge.title}</h3>
              <p className="mt-2 text-xs leading-5 text-zinc-400">{challenge.description}</p>

              <div className="mt-4">
                <div
                  className="h-2 overflow-hidden rounded-full bg-white/8"
                  role="progressbar"
                  aria-label={`${challenge.title}の進捗`}
                  aria-valuemin={0}
                  aria-valuemax={challenge.target}
                  aria-valuenow={Math.min(challenge.current, challenge.target)}
                  aria-valuetext={progressText}
                >
                  <div
                    className="h-full rounded-full bg-violet-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-xs font-semibold tabular-nums text-violet-100">
                  {progressText}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs leading-5 text-zinc-500">
        今週のデイリー履歴だけから計算します。練習モードの結果は加算されず、月曜日に自動で新しい週へ切り替わります。
      </p>
    </section>
  );
}
