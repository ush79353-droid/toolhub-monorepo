'use client';

import type { VelocityOfMoneyResult } from './types';

interface VelocityOfMoneyChartProps {
  result: VelocityOfMoneyResult;
}

const W = 360;
const H = 180;
const PAD = { l: 16, r: 16, t: 20, b: 40 };

export function VelocityOfMoneyChart({ result }: VelocityOfMoneyChartProps) {
  const parts = result.chartParts;
  if (parts.length < 2) return null;

  const max = Math.max(...parts.map((p) => p.value), 1);
  const chartH = H - PAD.t - PAD.b;
  const barW = 64;
  const gap = 48;
  const startX =
    PAD.l + (W - PAD.l - PAD.r - parts.length * barW - (parts.length - 1) * gap) / 2;

  const alt = `Comparison: ${parts.map((p) => `${p.label} ${p.formatted}`).join(', ')}. Velocity ${result.formattedVelocity}.`;

  return (
    <figure className="mt-3">
      <figcaption className="mb-1 text-xs font-medium text-accent">
        {result.mode === 'gdp' ? 'Nominal GDP vs money stock' : 'Nominal flow vs money stock'}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={alt}
      >
        {parts.map((p, i) => {
          const h = (p.value / max) * chartH;
          const x = startX + i * (barW + gap);
          const y = PAD.t + chartH - h;
          return (
            <g key={p.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, 1)}
                rx={3}
                className={i === 0 ? 'fill-primary/75' : 'fill-accent/60'}
              />
              <text
                x={x + barW / 2}
                y={H - 16}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={11}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
        {parts.map((p) => (
          <li key={p.label}>
            {p.label}: {p.formatted}
          </li>
        ))}
      </ul>
    </figure>
  );
}
