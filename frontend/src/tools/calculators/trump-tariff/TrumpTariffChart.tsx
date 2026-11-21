'use client';

import type { TrumpTariffResult } from './types';

interface TrumpTariffChartProps {
  result: TrumpTariffResult;
}

const W = 360;
const H = 200;
const PAD = { l: 12, r: 12, t: 16, b: 56 };

export function TrumpTariffChart({ result }: TrumpTariffChartProps) {
  const parts = result.chartParts.filter((p) => p.value > 0);
  if (parts.length === 0) return null;

  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const chartH = H - PAD.t - PAD.b;
  const barW = Math.min(40, (W - PAD.l - PAD.r) / (parts.length * 1.6));
  const gap = barW * 0.6;
  const startX =
    PAD.l +
    (W - PAD.l - PAD.r - parts.length * barW - (parts.length - 1) * gap) / 2;
  const max = Math.max(...parts.map((p) => p.value), 1);

  const alt = `Cost breakdown totaling ${result.formattedLanded}: ${parts
    .map((p) => `${p.label} ${p.formatted}`)
    .join(', ')}.`;

  return (
    <figure className="mt-3">
      <figcaption className="mb-1 text-xs font-medium text-accent">
        Cost breakdown
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
                className="fill-primary/75"
              />
              <text
                x={x + barW / 2}
                y={H - 28}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={9}
              >
                {p.label.length > 10 ? `${p.label.slice(0, 9)}…` : p.label}
              </text>
              <text
                x={x + barW / 2}
                y={H - 14}
                textAnchor="middle"
                className="fill-accent"
                fontSize={9}
              >
                {((p.value / total) * 100).toFixed(0)}%
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
