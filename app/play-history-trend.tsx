import type { PlayHistoryTrend } from "@/lib/history";

const CHART_WIDTH = 560;
const CHART_HEIGHT = 190;
const PLOT_LEFT = 72;
const PLOT_RIGHT = 544;
const PLOT_TOP = 20;
const PLOT_BOTTOM = 140;

type PlayHistoryTrendChartProps = Readonly<{
  trend: PlayHistoryTrend;
}>;

type ChartPoint = Readonly<{
  dateKey: string;
  totalScore: number;
  x: number;
  y: number;
}>;

function formatDate(dateKey: string): string {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function formatScore(score: number): string {
  return score.toLocaleString("ja-JP");
}

function formatChange(change: number | null): string {
  if (change === null) return "初回記録";
  if (change === 0) return "前回比 ±0点";

  const sign = change > 0 ? "+" : "-";
  return `前回比 ${sign}${formatScore(Math.abs(change))}点`;
}

function getChangeClassName(change: number | null): string {
  if (change === null || change === 0) {
    return "border-white/10 bg-white/5 text-zinc-300";
  }

  return change > 0
    ? "border-lime-300/25 bg-lime-300/8 text-lime-200"
    : "border-rose-300/25 bg-rose-300/8 text-rose-200";
}

function buildAccessibleSummary(trend: PlayHistoryTrend): string {
  const latestPoint = trend.points.at(-1);
  if (!latestPoint) return "スコア履歴はまだありません。";

  const rangeText = `期間内の最低は${formatScore(trend.minScore)}点、最高は${formatScore(trend.maxScore)}点です。`;

  if (trend.latestChange === null) {
    return `直近1回のスコアは${formatScore(latestPoint.totalScore)}点です。比較できる前回記録はありません。${rangeText}`;
  }

  if (trend.latestChange === 0) {
    return `直近${trend.points.length}回の最新スコアは${formatScore(latestPoint.totalScore)}点で、前回と同点です。${rangeText}`;
  }

  const direction = trend.latestChange > 0 ? "上昇" : "低下";
  return `直近${trend.points.length}回の最新スコアは${formatScore(latestPoint.totalScore)}点で、前回より${formatScore(Math.abs(trend.latestChange))}点${direction}しています。${rangeText}`;
}

function createChartPoints(trend: PlayHistoryTrend): ChartPoint[] {
  const plotWidth = PLOT_RIGHT - PLOT_LEFT;
  const plotHeight = PLOT_BOTTOM - PLOT_TOP;

  return trend.points.map((point) => ({
    dateKey: point.dateKey,
    totalScore: point.totalScore,
    x: PLOT_LEFT + point.position * plotWidth,
    y: PLOT_BOTTOM - point.scoreRatio * plotHeight,
  }));
}

export function PlayHistoryTrendChart({ trend }: PlayHistoryTrendChartProps) {
  const latestPoint = trend.points.at(-1);
  const firstPoint = trend.points[0];
  if (!latestPoint || !firstPoint) return null;

  const chartPoints = createChartPoints(trend);
  const polylinePoints = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const accessibleSummary = buildAccessibleSummary(trend);

  return (
    <section
      className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5"
      aria-labelledby="score-trend-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.6875rem] font-medium tracking-[0.18em] text-lime-200">
            SCORE TREND
          </p>
          <h3 id="score-trend-title" className="mt-1 text-base font-bold text-zinc-100">
            直近のスコア推移
          </h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tabular-nums text-zinc-100">
            {formatScore(latestPoint.totalScore)}点
          </p>
          <p
            className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums ${getChangeClassName(trend.latestChange)}`}
          >
            {formatChange(trend.latestChange)}
          </p>
        </div>
      </div>

      <p className="sr-only">{accessibleSummary}</p>

      <svg
        className="mt-4 h-auto w-full"
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        {[PLOT_TOP, (PLOT_TOP + PLOT_BOTTOM) / 2, PLOT_BOTTOM].map((y) => (
          <line
            key={y}
            x1={PLOT_LEFT}
            x2={PLOT_RIGHT}
            y1={y}
            y2={y}
            stroke="currentColor"
            strokeDasharray="5 8"
            className="text-white/10"
          />
        ))}

        <text x="8" y={PLOT_TOP + 4} className="fill-zinc-500 text-xs">
          {formatScore(trend.maxScore)}
        </text>
        <text x="8" y={PLOT_BOTTOM + 4} className="fill-zinc-500 text-xs">
          {formatScore(trend.minScore)}
        </text>

        {chartPoints.length > 1 && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-lime-300"
          />
        )}

        {chartPoints.map((point, index) => {
          const isLatest = index === chartPoints.length - 1;

          return (
            <circle
              key={point.dateKey}
              cx={point.x}
              cy={point.y}
              r={isLatest ? 8 : 6}
              fill="currentColor"
              stroke="#18181b"
              strokeWidth="4"
              className={isLatest ? "text-lime-200" : "text-zinc-300"}
            >
              <title>
                {formatDate(point.dateKey)} {formatScore(point.totalScore)}点
              </title>
            </circle>
          );
        })}

        {chartPoints.length === 1 ? (
          <text
            x={(PLOT_LEFT + PLOT_RIGHT) / 2}
            y="178"
            textAnchor="middle"
            className="fill-zinc-500 text-xs"
          >
            {formatDate(firstPoint.dateKey)}
          </text>
        ) : (
          <>
            <text x={PLOT_LEFT} y="178" textAnchor="start" className="fill-zinc-500 text-xs">
              {formatDate(firstPoint.dateKey)}
            </text>
            <text x={PLOT_RIGHT} y="178" textAnchor="end" className="fill-zinc-500 text-xs">
              {formatDate(latestPoint.dateKey)}
            </text>
          </>
        )}
      </svg>

      <p className="mt-1 text-center text-xs leading-5 text-zinc-500">
        このブラウザに保存された直近{trend.points.length}回を表示しています。
      </p>
    </section>
  );
}
