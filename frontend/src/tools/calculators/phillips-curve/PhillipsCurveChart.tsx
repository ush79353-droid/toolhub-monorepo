'use client';

import type { PhillipsCurveResult } from './types';

interface Props {
  result: PhillipsCurveResult;
}

const W = 360;
const H = 200;
const PAD = { l: 44, r: 14, t: 16, b: 40 };

export function PhillipsCurveChart({ result }: Props) {
  if (result.chartPoints.length < 2) return null;

  const xs = result.chartPoints.map((p) => p.x);
  const ys = result.chartPoints.map((p) => p.y);
  const refXs = result.referenceLines
    .map((r) => r.x)
    .filter((v): v is number => v != null);
  const refYs = result.referenceLines
    .map((r) => r.y)
    .filter((v): v is number => v != null);
  const minX = Math.min(...xs, ...refXs, 0);
  const maxX = Math.max(...xs, ...refXs, 0);
  const minY = Math.min(...ys, ...refYs, 0);
  const maxY = Math.max(...ys, ...refYs, 0);
  const xSpan = maxX - minX || 1;
  const ySpan = maxY - minY || 1;

  const sx = (x: number) => PAD.l + ((x - minX) / xSpan) * (W - PAD.l - PAD.r);
  const sy = (y: number) =>
    H - PAD.b - ((y - minY) / ySpan) * (H - PAD.t - PAD.b);

  const path = result.chartPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x)} ${sy(p.y)}`)
    .join(' ');

  return (
    <figure className="space-y-1">
      <figcaption className="text-xs font-medium text-accent">
        {result.chartTitle}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`${result.chartTitle}. Model relationship for ${result.formulaBreakdown}. Not historical data.`}
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
        {result.referenceLines.map((r) =>
          r.x != null ? (
            <line
              key={`vx-${r.label}`}
              x1={sx(r.x)}
              y1={PAD.t}
              x2={sx(r.x)}
              y2={H - PAD.b}
              className="stroke-muted-foreground"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          ) : r.y != null ? (
            <line
              key={`hy-${r.label}`}
              x1={PAD.l}
              y1={sy(r.y)}
              x2={W - PAD.r}
              y2={sy(r.y)}
              className="stroke-muted-foreground"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          ) : null
        )}
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
          {result.chartXLabel}
        </text>
        <text
          x={12}
          y={H / 2}
          textAnchor="middle"
          fontSize={10}
          className="fill-muted-foreground"
          transform={`rotate(-90 12 ${H / 2})`}
        >
          {result.chartYLabel}
        </text>
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Modeled curve only — not observed historical data. Red mark = your
        result.
        {result.referenceLines.length
          ? ` Dashed: ${result.referenceLines.map((r) => r.label).join(', ')}.`
          : ''}
      </p>
    </figure>
  );
}
