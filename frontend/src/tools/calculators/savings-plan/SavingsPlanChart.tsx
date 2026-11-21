'use client';

import type { PeriodBalance } from './types';

interface SavingsPlanChartProps {
  balances: PeriodBalance[];
  periodAxisLabel: string;
}

export function SavingsPlanChart({ balances, periodAxisLabel }: SavingsPlanChartProps) {
  if (balances.length === 0) return null;

  const width = 560;
  const height = 220;
  const padL = 40;
  const padR = 12;
  const padT = 12;
  const padB = 36;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const maxBal = Math.max(...balances.map((b) => b.balance), 1);
  const barGap = balances.length > 80 ? 0.5 : balances.length > 40 ? 1 : 2;
  const barW = Math.max(1.5, plotW / balances.length - barGap);

  const labelStep = Math.max(1, Math.ceil(balances.length / 16));

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-52 w-full min-w-[280px]"
          role="img"
          aria-label={`Principal balance over ${periodAxisLabel.toLowerCase()}`}
        >
          <title>Principal balance growth</title>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = padT + plotH * (1 - t);
            const label = maxBal * t;
            const text =
              label >= 1000
                ? `${(label / 1000).toFixed(label >= 10_000 ? 0 : 1)}k`
                : String(Math.round(label));
            return (
              <g key={t}>
                <line
                  x1={padL}
                  x2={width - padR}
                  y1={y}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text x={padL - 6} y={y + 3} textAnchor="end" className="fill-muted-foreground" fontSize="9">
                  {text}
                </text>
              </g>
            );
          })}
          {balances.map((row, index) => {
            const x = padL + index * (barW + barGap);
            const h = (Math.max(0, row.balance) / maxBal) * plotH;
            const y = padT + plotH - h;
            const showLabel =
              index === 0 ||
              index === balances.length - 1 ||
              (index + 1) % labelStep === 0;
            return (
              <g key={row.period}>
                <rect x={x} y={y} width={barW} height={h} fill="#087E8B" rx={0.5} />
                {showLabel ? (
                  <text
                    x={x + barW / 2}
                    y={height - 18}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    fontSize="8"
                  >
                    {row.period}
                  </text>
                ) : null}
              </g>
            );
          })}
          <text
            x={width / 2}
            y={height - 4}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="10"
          >
            {periodAxisLabel}
          </text>
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden />
          Principal balance
        </span>
      </div>
    </div>
  );
}
