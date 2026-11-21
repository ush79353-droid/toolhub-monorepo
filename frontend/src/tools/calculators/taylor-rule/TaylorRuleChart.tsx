'use client';

import type { TaylorRuleResult } from './types';

interface TaylorRuleChartProps {
  result: TaylorRuleResult;
}

const W = 360;
const H = 180;
const PAD = { l: 40, r: 16, t: 20, b: 48 };

export function TaylorRuleChart({ result }: TaylorRuleChartProps) {
  const parts = [
    { label: 'r*', value: result.neutralRealRate },
    { label: 'π', value: result.currentInflation },
    {
      label: `a·gap`,
      value: result.inflationCoefficient * result.inflationGap,
    },
    {
      label: `b·y`,
      value: result.outputCoefficient * result.outputGap,
    },
  ];
  const max = Math.max(...parts.map((p) => Math.abs(p.value)), 1);
  const chartH = H - PAD.t - PAD.b;
  const barW = 48;
  const gap = 24;
  const startX = PAD.l + 20;
  const zeroY = PAD.t + chartH / 2;

  const alt = `Taylor rule components summing to ${result.formattedCustomRate}: ${parts
    .map((p) => `${p.label} ${p.value.toFixed(2)}`)
    .join(', ')}.`;

  return (
    <figure className="mt-3">
      <figcaption className="mb-1 text-xs font-medium text-accent">
        Rate components (custom coefficients)
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={alt}
      >
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={zeroY}
          y2={zeroY}
          className="stroke-border"
          strokeWidth={1}
        />
        {parts.map((p, i) => {
          const h = (Math.abs(p.value) / max) * (chartH / 2);
          const x = startX + i * (barW + gap);
          const y = p.value >= 0 ? zeroY - h : zeroY;
          return (
            <g key={p.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, 1)}
                rx={3}
                className={
                  p.value >= 0 ? 'fill-primary/75' : 'fill-rose-400/70'
                }
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
      <p className="mt-1 text-[11px] text-muted-foreground">
        Standard rate {result.formattedStandardRate} · Custom{' '}
        {result.formattedCustomRate} · Difference{' '}
        {result.formattedDifference}.
      </p>
    </figure>
  );
}
