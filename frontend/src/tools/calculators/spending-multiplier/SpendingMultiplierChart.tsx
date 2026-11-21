'use client';

import type { SpendingMultiplierResult } from './types';

interface SpendingMultiplierChartProps {
  result: SpendingMultiplierResult;
}

const W = 360;
const H = 200;
const PAD = { l: 36, r: 12, t: 16, b: 40 };

export function SpendingMultiplierChart({
  result,
}: SpendingMultiplierChartProps) {
  const rounds = result.rounds;
  if (rounds.length === 0) {
    return (
      <p className="mt-2 text-[11px] text-muted-foreground">
        Enter autonomous spending with MPC &lt; 1 to visualize finite spending
        rounds.
      </p>
    );
  }

  const maxAdd = Math.max(...rounds.map((r) => Math.abs(r.additionalSpending)), 1);
  const chartH = H - PAD.t - PAD.b;
  const gap = 4;
  const barW = Math.min(
    28,
    (W - PAD.l - PAD.r - gap * (rounds.length - 1)) / rounds.length
  );
  const alt = rounds
    .map((r) => `${r.label} ${r.formattedAdditional}`)
    .join('; ');

  return (
    <figure className="mt-3">
      <figcaption className="mb-1 text-xs font-medium text-accent">
        Spending by round (finite series)
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`Spending rounds: ${alt}. Partial total compared with theoretical infinite-series limit.`}
      >
        {rounds.map((r, i) => {
          const h = (Math.abs(r.additionalSpending) / maxAdd) * chartH;
          const x = PAD.l + i * (barW + gap);
          const y = H - PAD.b - h;
          return (
            <g key={r.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, 1)}
                rx={2}
                className="fill-primary/75"
              />
              <text
                x={x + barW / 2}
                y={H - PAD.b + 12}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={8}
              >
                {r.round === 0 ? '0' : String(r.round)}
              </text>
            </g>
          );
        })}
      </svg>
      {result.roundsPartialShare != null ? (
        <p className="mt-1 text-[11px] text-muted-foreground">
          Finite rounds capture about{' '}
          {result.roundsPartialShare.toFixed(1)}% of the theoretical infinite
          series total (no unbounded loop).
        </p>
      ) : null}
    </figure>
  );
}
