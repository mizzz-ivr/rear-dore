import type { LocalAchievement } from "@/lib/achievements";

type AchievementUnlockNoticeProps = Readonly<{
  achievements: readonly LocalAchievement[];
}>;

export function AchievementUnlockNotice({
  achievements,
}: AchievementUnlockNoticeProps) {
  if (achievements.length === 0) return null;

  const heading =
    achievements.length === 1
      ? "新しい実績を解除しました！"
      : `${achievements.length}件の実績を解除しました！`;

  return (
    <section
      className="rounded-[2rem] border border-amber-200/35 bg-gradient-to-br from-amber-200/15 via-zinc-950/90 to-orange-300/10 p-5 shadow-[0_0_40px_rgba(251,191,36,0.08)] sm:p-7"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="achievement-unlock-title"
    >
      <div className="text-center">
        <p className="text-xs font-bold tracking-[0.22em] text-amber-200">
          NEW ACHIEVEMENT
        </p>
        <h2 id="achievement-unlock-title" className="mt-2 text-xl font-black sm:text-2xl">
          {heading}
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          今回のプレイで新しく条件を達成しました。
        </p>
      </div>

      <ul
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
        aria-label="今回解除した実績"
      >
        {achievements.map((achievement) => (
          <li
            key={achievement.id}
            className="flex items-start gap-3 rounded-2xl border border-amber-100/20 bg-black/20 p-4"
          >
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-200/15 text-2xl"
              aria-hidden="true"
            >
              {achievement.icon}
            </span>
            <div className="min-w-0">
              <p className="font-bold text-amber-50">{achievement.title}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-300">
                {achievement.description}
              </p>
              <p className="mt-2 text-xs font-bold text-amber-200">解除済み</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
