'use client';

import type { BirthWeightPercentileResult } from './types';

const CHART_COLORS: Record<number, string> = {
  5: '#3b82f6',
  10: '#ef4444',
  50: '#eab308',
  75: '#9ca3af',
  95: '#1e3a8a',
  you: '#7f1d1d',
};

const WIDTH = 560;
const HEIGHT = 320;
const PAD = { top: 16, right: 16, bottom: 36, left: 48 };
const X_MIN = 20;
const X_MAX = 45;
const Y_MIN = 0;
const Y_MAX = 5000;

function xScale(week: number): number {
  return (
    PAD.left +
    ((week - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - PAD.left - PAD.right)
  );
}

function yScale(grams: number): number {
  return (
    HEIGHT -
    PAD.bottom -
    ((grams - Y_MIN) / (Y_MAX - Y_MIN)) * (HEIGHT - PAD.top - PAD.bottom)
  );
}

interface BirthWeightPercentileChartProps {
  result: BirthWeightPercentileResult;
}

export function BirthWeightPercentileChart({
  result,
}: BirthWeightPercentileChartProps) {
  const plottable = result.bandKind !== 'unavailable';
  const youY = plottable ? yScale(result.weightGrams) : null;
  const youX = xScale(result.gestationalDay / 7);

  return (
    <div className="space-y-3">
      <p className="text-base font-semibold text-accent">{result.headline}</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-white p-3">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full min-w-[280px]"
          role="img"
          aria-label={result.accessibleChartSummary}
        >
          <title>Birthweight percentiles</title>
          <desc>{result.accessibleChartSummary}</desc>

          {[1000, 2000, 3000, 4000, 5000].map((g) => (
            <g key={g}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={yScale(g)}
                y2={yScale(g)}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={yScale(g) + 4}
                textAnchor="end"
                className="fill-muted-foreground"
                fontSize={10}
              >
                {g.toLocaleString('en-US')}
              </text>
            </g>
          ))}

          {[20, 25, 30, 35, 40, 45].map((w) => (
            <g key={w}>
              <line
                x1={xScale(w)}
                x2={xScale(w)}
                y1={PAD.top}
                y2={HEIGHT - PAD.bottom}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
              <text
                x={xScale(w)}
                y={HEIGHT - 12}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={10}
              >
                {w}
              </text>
            </g>
          ))}

          {result.chartCurves.map((curve) => {
            const d = curve.points
              .map((p, i) => {
                const cmd = i === 0 ? 'M' : 'L';
                return `${cmd}${xScale(p.week).toFixed(2)} ${yScale(p.grams).toFixed(2)}`;
              })
              .join(' ');
            return (
              <path
                key={curve.percentile}
                d={d}
                fill="none"
                stroke={CHART_COLORS[curve.percentile]}
                strokeWidth={2}
              />
            );
          })}

          {youY !== null ? (
            <>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={youY}
                y2={youY}
                stroke={CHART_COLORS.you}
                strokeWidth={2}
              />
              <circle
                cx={youX}
                cy={youY}
                r={4}
                fill={CHART_COLORS.you}
              />
            </>
          ) : null}
        </svg>

        <ul className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {([5, 10, 50, 75, 95] as const).map((p) => (
            <li key={p} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: CHART_COLORS[p] }}
                aria-hidden
              />
              {p === 5
                ? '5th'
                : p === 10
                  ? '10th'
                  : p === 50
                    ? '50th'
                    : p === 75
                      ? '75th'
                      : '95th'}
            </li>
          ))}
          <li className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: CHART_COLORS.you }}
              aria-hidden
            />
            You
          </li>
        </ul>
        <p className="mt-1 text-center text-[11px] italic text-muted-foreground">
          birthweight percentiles (grams vs. week)
        </p>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>
    </div>
  );
}
