import type { AnswerResult } from "@/lib/game";
import { getDailyMissionProgress } from "@/lib/daily-missions";

type DailyMissionPanelProps = Readonly<{
  dateKey: string;
  answers: readonly AnswerResult[];
  gameCompleted?: boolean;
}>;

function formatNumber(value: number): string {
  return value.toLocaleString("ja-JP");
}

export function DailyMissionPanel({
  dateKey,
  answers,
  gameCompleted = false,
}: DailyMissionPanelProps) {
  const progress = getDailyMissionProgress(dateKey, answers);
  const { mission } = progress;
  const progressPercentage = Math.min(100, Math.round((progress.current / mission.target) * 100));
  const progressText = `${formatNumber(Math.min(progress.current, mission.target))}/${formatNumber(mission.target)}${mission.unit}`;

  return (
    <section
      className={`rounded-[2rem] border p-5 sm:p-6 ${progress.completed ? "border-violet-300/35 bg-violet-300/10" : "border-violet-300/20 bg-violet-300/[0.06]"}`}
      aria-labelledby="daily-mission-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-200">DAILY MISSION</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              {mission.icon}
            </span>
            <h2 id="daily-mission-title" className="text-lg font-bold text-zinc-100 sm:text-xl">
              {mission.title}
            </h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{mission.description}</p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${progress.completed ? "border-violet-200/40 bg-violet-200/15 text-violet-100" : "border-white/10 bg-white/5 text-zinc-400"}`}
        >
          {progress.completed ? "達成" : gameCompleted ? "未達成" : "挑戦中"}
        </span>
      </div>

      <div className="mt-5">
        <div
          className="h-2.5 overflow-hidden rounded-full bg-white/8"
          role="progressbar"
          aria-label={`${mission.title}の進捗`}
          aria-valuemin={0}
          aria-valuemax={mission.target}
          aria-valuenow={Math.min(progress.current, mission.target)}
          aria-valuetext={progressText}
        >
          <div
            className="h-full rounded-full bg-violet-300 transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs">
          <span className="text-zinc-500">回答すると進捗が更新されます</span>
          <span className="shrink-0 font-semibold tabular-nums text-violet-100">{progressText}</span>
        </div>
      </div>

      {gameCompleted && (
        <p
          className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold leading-6 ${progress.completed ? "border-violet-200/25 bg-violet-200/10 text-violet-100" : "border-white/10 bg-black/10 text-zinc-400"}`}
          role="status"
        >
          {progress.completed
            ? "MISSION COMPLETE！ 今日の追加目標を達成しました。"
            : "本日のミッションは未達成でした。次のミッションは日本時間0時に切り替わります。"}
        </p>
      )}
    </section>
  );
}
