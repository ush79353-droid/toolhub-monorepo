'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { EpfYearlyProjection } from './types';

interface EpfChartProps {
  schedule: EpfYearlyProjection[];
  currency: SupportedCurrency;
}

function polyline(
  values: number[],
  ages: number[],
  toX: (age: number) => number,
  toY: (v: number) => number,
): string {
  return values
    .map((v, i) => `${toX(ages[i]!).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(' ');
}

export function EpfChart({ schedule, currency }: EpfChartProps) {
  if (schedule.length < 2) return null;

  const width = 560;
  const height = 220;
  const padL = 52;
  const padR = 12;
  const padT = 16;
  const padB = 32;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const ages = schedule.map((r) => r.age);
  const minAge = ages[0]!;
  const maxAge = ages[ages.length - 1]!;
  const ageSpan = Math.max(1, maxAge - minAge);

  const maxVal = Math.max(
    1,
    ...schedule.flatMap((r) => [
      r.closingBalance,
      r.cumulativeEmployee + r.cumulativeEmployerEPF,
      r.cumulativeInterest,
    ]),
  );

  const toX = (age: number) => padL + ((age - minAge) / ageSpan) * plotW;
  const toY = (v: number) => padT + plotH - (v / maxVal) * plotH;

  const series = [
    {
      key: 'bal',
      label: 'EPF balance',
      color: '#087E8B',
      values: schedule.map((r) => r.closingBalance),
    },
    {
      key: 'dep',
      label: 'Cumulative EPF deposits',
      color: '#D4A017',
      values: schedule.map(
        (r) => r.cumulativeEmployee + r.cumulativeEmployerEPF,
      ),
    },
    {
      key: 'int',
      label: 'Cumulative interest',
      color: '#C44536',
      values: schedule.map((r) => r.cumulativeInterest),
    },
  ] as const;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => maxVal * f);
  const xTicks = [minAge, Math.round(minAge + ageSpan / 2), maxAge].filter(
    (v, i, arr) => arr.indexOf(v) === i,
  );

  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-accent">EPF Growth Chart</h3>
        <span className="text-xs text-muted-foreground">
          Balance by age (EPS excluded)
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-48 w-full min-w-[280px] sm:h-52"
        role="img"
        aria-label="EPF balance, cumulative deposits, and cumulative interest by age"
      >
        <title>EPF growth over the contribution horizon</title>
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
            points={polyline(s.values, ages, toX, toY)}
          />
        ))}
        {xTicks.map((age) => (
          <text
            key={age}
            x={toX(age)}
            y={height - 10}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="9"
          >
            {age}
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
