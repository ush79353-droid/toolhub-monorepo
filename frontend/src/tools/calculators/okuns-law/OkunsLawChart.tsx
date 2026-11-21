'use client';

import type { OkunsLawResult } from './types';

interface OkunsLawChartProps {
  result: OkunsLawResult;
}

const W = 360;
const H = 200;
const PAD = { l: 44, r: 14, t: 16, b: 40 };

export function OkunsLawChart({ result }: OkunsLawChartProps) {
  if (!result.chartKind || result.chartPoints.length < 2) return null;

  const xs = result.chartPoints.map((p) => p.x);
  const ys = result.chartPoints.map((p) => p.y);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 0);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 0);
  const xSpan = maxX - minX || 1;
  const ySpan = maxY - minY || 1;

  const sx = (x: number) => PAD.l + ((x - minX) / xSpan) * (W - PAD.l - PAD.r);
  const sy = (y: number) =>
    H - PAD.b - ((y - minY) / ySpan) * (H - PAD.t - PAD.b);

  const path = result.chartPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x)} ${sy(p.y)}`)
    .join(' ');

  const xLabel =
    result.chartKind === 'output-gap'
      ? 'Unemployment gap (pp)'
      : 'GDP growth gap (%)';
  const yLabel =
    result.chartKind === 'output-gap'
      ? 'Output gap (%)'
      : 'Δu (pp)';

  return (
    <figure className="space-y-1">
      <figcaption className="text-xs font-medium text-accent">
        {result.chartKind === 'output-gap'
          ? "Okun's Law: unemployment and output gap"
          : "Okun's Law: growth gap and unemployment change"}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`Model line for ${result.formulaBreakdown}. Not an observed empirical dataset.`}
      >
        <line
          x1={sx(0)}
          y1={PAD.t}
          x2={sx(0)}
          y2={H - PAD.b}
          className="stroke-border"
          strokeWidth={1}
        />
        <line
          x1={PAD.l}
          y1={sy(0)}
          x2={W - PAD.r}
          y2={sy(0)}
          className="stroke-border"
          strokeWidth={1}
        />
        <path d={path} fill="none" className="stroke-primary" strokeWidth={2} />
        {result.highlight ? (
          <circle
            cx={sx(result.highlight.x)}
            cy={sy(result.highlight.y)}
            r={5}
            className="fill-rose-500"
          />
        ) : null}
        <text
          x={W / 2}
          y={H - 10}
          textAnchor="middle"
          fontSize={10}
          className="fill-muted-foreground"
        >
          {xLabel}
        </text>
        <text
          x={12}
          y={H / 2}
          textAnchor="middle"
          fontSize={10}
          className="fill-muted-foreground"
          transform={`rotate(-90 12 ${H / 2})`}
        >
          {yLabel}
        </text>
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Model relationship only — not plotted from historical data. Red mark =
        your result.
      </p>
    </figure>
  );
}
