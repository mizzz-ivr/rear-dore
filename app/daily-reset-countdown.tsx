"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/countdown";
import { getMillisecondsUntilNextJapanDay } from "@/lib/progress";

const COUNTDOWN_PLACEHOLDER = "--:--:--";

export function DailyResetCountdown() {
  const [remainingMilliseconds, setRemainingMilliseconds] = useState<number | null>(null);

  useEffect(() => {
    function updateRemainingTime(): void {
      try {
        setRemainingMilliseconds(getMillisecondsUntilNextJapanDay());
      } catch {
        setRemainingMilliseconds(null);
      }
    }

    function handleVisibilityChange(): void {
      if (document.visibilityState === "visible") {
        updateRemainingTime();
      }
    }

    updateRemainingTime();
    const intervalId = window.setInterval(updateRemainingTime, 1000);

    window.addEventListener("focus", updateRemainingTime);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", updateRemainingTime);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const countdown =
    remainingMilliseconds === null ? null : formatCountdown(remainingMilliseconds);

  return (
    <aside className="border-b border-white/10 bg-zinc-950/90" aria-label="問題更新時刻">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-zinc-200">次の問題更新まで</p>
          <p className="mt-0.5 text-[0.6875rem] text-zinc-500">毎日0時・日本時間</p>
        </div>
        <div
          role="timer"
          aria-live="off"
          aria-atomic="true"
          aria-label={
            countdown?.accessibleText ?? "次の問題更新時刻を計算しています。"
          }
          className="shrink-0 rounded-full border border-lime-300/20 bg-lime-300/8 px-3 py-1.5 font-mono text-sm font-bold tabular-nums tracking-[0.08em] text-lime-200 sm:text-base"
        >
          <span aria-hidden="true">{countdown?.text ?? COUNTDOWN_PLACEHOLDER}</span>
        </div>
      </div>
    </aside>
  );
}
