import Link from "next/link";
import type {
  ThemeCollectionBadge,
  ThemeCollectionItem,
} from "@/lib/theme-collection";

type ThemeDiscoveryNoticeProps = Readonly<{
  theme: ThemeCollectionItem | null;
  badges: readonly ThemeCollectionBadge[];
}>;

export function ThemeDiscoveryNotice({ theme, badges }: ThemeDiscoveryNoticeProps) {
  if (!theme && badges.length === 0) return null;

  return (
    <section
      className="rounded-[2rem] border border-violet-300/30 bg-violet-300/10 p-5 sm:p-7"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="theme-discovery-notice-title"
    >
      <div className="text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
          COLLECTION UPDATE
        </p>
        <h2
          id="theme-discovery-notice-title"
          className="mt-2 text-2xl font-black text-violet-100"
        >
          {theme ? "新しいテーマを発見！" : "コレクションバッジを解除！"}
        </h2>

        {theme?.title && (
          <div className="mt-4 rounded-2xl bg-black/20 p-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-violet-300">NEW THEME</p>
            <p className="mt-2 text-xl font-bold">{theme.title}</p>
          </div>
        )}
      </div>

      {badges.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {badges.map((badge) => (
            <div key={badge.id} className="rounded-2xl border border-violet-300/20 bg-black/20 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {badge.icon}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-violet-100">{badge.title}</p>
                  <p className="mt-1 text-sm leading-5 text-zinc-300">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/collection" className="secondary-button mt-5 block w-full text-center">
        テーマコレクションを見る
      </Link>
    </section>
  );
}
