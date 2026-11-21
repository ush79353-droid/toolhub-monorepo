'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { LumpsumScheduleRow } from './types';

interface LumpsumChartProps {
  schedule: LumpsumScheduleRow[];
  principal: number;
  currency: SupportedCurrency;
}

function polyline(
  values: number[],
  years: number[],
  toX: (y: number) => number,
  toY: (v: number) => number,
): string {
  return values
    .map((v, i) => `${toX(years[i]!).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(' ');
}

export function LumpsumChart({
  schedule,
  principal,
  currency,
}: LumpsumChartProps) {
  if (schedule.length < 1) return null;

  const width = 560;
  const height = 220;
  const padL = 52;
  const padR = 12;
  const padT = 16;
  const padB = 32;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const points = [
    {
      year: 0,
      closingBalance: principal,
      inflationAdjustedBalance: principal,
      returnsCum: 0,
    },
    ...schedule.map((r) => ({
      year: r.year,
      closingBalance: r.closingBalance,
      inflationAdjustedBalance: r.inflationAdjustedBalance,
      returnsCum: r.closingBalance - principal,
    })),
  ];

  const years = points.map((p) => p.year);
  const minYear = 0;
  const maxYear = years[years.length - 1]!;
  const yearSpan = Math.max(1, maxYear - minYear);
  const maxVal = Math.max(
    1,
    ...points.flatMap((p) => [
      p.closingBalance,
      p.inflationAdjustedBalance,
      principal,
    ]),
  );

  const toX = (year: number) => padL + ((year - minYear) / yearSpan) * plotW;
  const toY = (v: number) => padT + plotH - (v / maxVal) * plotH;

  const series = [
    {
      key: 'bal',
      label: 'Nominal balance',
      color: '#087E8B',
      values: points.map((p) => p.closingBalance),
    },
    {
      key: 'real',
      label: 'Inflation-adjusted',
      color: '#C44536',
      values: points.map((p) => p.inflationAdjustedBalance),
    },
    {
      key: 'prin',
      label: 'Principal',
      color: '#D4A017',
      values: points.map(() => principal),
    },
  ] as const;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => maxVal * f);
  const xTicks = [minYear, Math.round(minYear + yearSpan / 2), maxYear].filter(
    (v, i, arr) => arr.indexOf(v) === i,
  );

  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-accent">
          Investment Growth Chart
        </h3>
        <span className="text-xs text-muted-foreground">Balance by year</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-48 w-full min-w-[280px] sm:h-52"
        role="img"
        aria-label="Lumpsum investment balance, inflation-adjusted value, and principal over time"
      >
        <title>Lumpsum investment growth</title>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padL}
              x2={width - padR}
              y1={toY(tick)}
              y2={toY(tick)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <text
              x={padL - 6}
              y={toY(tick) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize="9"
            >
              {formatCurrencyValue(tick, currency).replace(/\.00$/, '')}
            </text>
          </g>
        ))}
        {series.map((s) => (
          <polyline
            key={s.key}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeDasharray={s.key === 'prin' ? '4 3' : undefined}
            points={polyline(s.values, years, toX, toY)}
          />
        ))}
        {xTicks.map((year) => (
          <text
            key={year}
            x={toX(year)}
            y={height - 10}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="9"
          >
            {year}
          </text>
        ))}
      </svg>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-accent">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
