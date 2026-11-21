'use client';

import type { FetalWeightPercentileResult } from './types';

const COLORS: Record<number | 'you', string> = {
  3: '#ef4444',
  10: '#eab308',
  25: '#d1d5db',
  50: '#1e3a8a',
  75: '#7f1d1d',
  90: '#92400e',
  97: '#4b5563',
  you: '#3b82f6',
};

const WIDTH = 560;
const HEIGHT = 300;
const PAD = { top: 16, right: 16, bottom: 36, left: 48 };

interface Props {
  result: FetalWeightPercentileResult;
}

export function FetalWeightPercentileChart({ result }: Props) {
  const weeks = result.chartCurves[0]?.points.map((p) => p.week) ?? [];
  const xMin = Math.max(18, (weeks[0] ?? 20) - 2);
  const xMax = Math.min(42, (weeks.at(-1) ?? 40) + 1);
  const yMin = 0;
  const yMax = Math.max(800, Math.ceil((result.efwGrams * 2.2) / 100) * 100);

  const xScale = (w: number) =>
    PAD.left + ((w - xMin) / (xMax - xMin)) * (WIDTH - PAD.left - PAD.right);
  const yScale = (g: number) =>
    HEIGHT -
    PAD.bottom -
    ((g - yMin) / (yMax - yMin)) * (HEIGHT - PAD.top - PAD.bottom);

  const youX = xScale(result.gestationalDay / 7);
  const youY = yScale(result.efwGrams);

  return (
    <div className="space-y-3">
      <p className="text-base font-semibold text-accent">{result.headline}</p>
      <p
        className={`text-sm ${
          result.normalRange ? 'text-emerald-700' : 'text-amber-700'
        }`}
      >
        {result.normalRange ? (
          <>
            ✓ Your baby&apos;s weight is within <strong>normal range</strong>.
          </>
        ) : (
          <>! {result.normalRangeText}</>
        )}
      </p>

      <div className="overflow-x-auto rounded-xl border border-border bg-white p-3">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full min-w-[280px]"
          role="img"
          aria-label={result.accessibleChartSummary}
        >
          <title>Fetal weight percentiles</title>
          <desc>{result.accessibleChartSummary}</desc>
          {result.chartCurves.map((curve) => {
            const pts = curve.points.filter(
              (p) => p.week >= xMin && p.week <= xMax,
            );
            const d = pts
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
                stroke={COLORS[curve.percentile]}
                strokeWidth={2}
              />
            );
          })}
          <circle cx={youX} cy={youY} r={5} fill={COLORS.you} />
        </svg>
        <ul className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <li className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: COLORS.you }}
            />
            You
          </li>
          {([3, 10, 25, 50, 75, 90, 97] as const).map((p) => (
            <li key={p} className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: COLORS[p] }}
              />
              {p === 3 ? '2.5th≈3rd' : p === 97 ? '97.5th≈97th' : `${p}th`}
            </li>
          ))}
        </ul>
        <p className="mt-1 text-center text-[11px] italic text-muted-foreground">
          Weeks vs. fetal weight for different percentiles.
        </p>
      </div>
      {result.sexNote ? (
        <p className="text-xs text-muted-foreground">{result.sexNote}</p>
      ) : null}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>
    </div>
  );
}
