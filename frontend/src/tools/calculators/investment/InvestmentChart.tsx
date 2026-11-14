'use client';

import type { AnnualBalancePoint } from './types';

interface InvestmentChartProps {
  points: AnnualBalancePoint[];
}

export function InvestmentChart({ points }: InvestmentChartProps) {
  if (points.length < 2) return null;

  const w = 560;
  const h = 240;
  const pad = { t: 16, r: 16, b: 40, l: 48 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const maxY = Math.max(...points.map((p) => p.totalBalance), 1);
  const maxYear = Math.max(...points.map((p) => p.year), 1);

  const toX = (year: number) => pad.l + (year / maxYear) * innerW;
  const toY = (value: number) => pad.t + innerH * (1 - value / maxY);

  const series = (key: keyof Pick<AnnualBalancePoint, 'principal' | 'interest' | 'totalBalance'>) =>
    points.map((p) => `${toX(p.year)},${toY(p[key])}`).join(' ');

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xLabels = points
    .filter(
      (p, i) =>
        p.year === 0 ||
        p.year === maxYear ||
        i % Math.max(1, Math.ceil(points.length / 6)) === 0
    )
    .map((p) => p.year);

  return (
    <div className="space-y-3">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label="Annual balances for principal, interest, and total"
      >
        {yTicks.map((t) => {
          const y = pad.t + innerH * (1 - t);
          const label = maxY * t;
          const text =
            label >= 1000 ? `${(label / 1000).toFixed(0)}k` : String(Math.round(label));
          return (
            <g key={t}>
              <line
                x1={pad.l}
                x2={w - pad.r}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeWidth={1}
              />
              <text
                x={pad.l - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {text}
              </text>
            </g>
          );
        })}
        {xLabels.map((year) => (
          <text
            key={year}
            x={toX(year)}
            y={h - 14}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {year}
          </text>
        ))}
        <text x={w / 2} y={h - 2} textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Year
        </text>
        <polyline
          fill="none"
          stroke="#087E8B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={series('principal')}
        />
        <polyline
          fill="none"
          stroke="#E85D4C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={series('interest')}
        />
        <polyline
          fill="none"
          stroke="#C9A227"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={series('totalBalance')}
        />
      </svg>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#087E8B]" /> Principal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E85D4C]" /> Interest
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#C9A227]" /> Total balance
        </span>
      </div>
    </div>
  );
}
