'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { PpfYearlyRecord } from './types';

interface PpfChartProps {
  schedule: PpfYearlyRecord[];
}

function polyline(
  values: number[],
  xs: number[],
  toX: (i: number) => number,
  toY: (v: number) => number,
): string {
  return values
    .map((v, i) => `${toX(xs[i]!).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(' ');
}

export function PpfChart({ schedule }: PpfChartProps) {
  if (schedule.length < 2) return null;

  const width = 560;
  const height = 220;
  const padL = 52;
  const padR = 12;
  const padT = 16;
  const padB = 36;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const xs = schedule.map((_, i) => i);
  const maxX = Math.max(1, xs[xs.length - 1]!);
  const maxVal = Math.max(
    1,
    ...schedule.flatMap((r) => [
      r.closingBalance,
      r.cumulativeInvestment,
      r.cumulativeInterest,
    ]),
  );

  const toX = (i: number) => padL + (i / maxX) * plotW;
  const toY = (v: number) => padT + plotH - (v / maxVal) * plotH;

  const series = [
    {
      key: 'bal',
      label: 'Account balance',
      color: '#087E8B',
      values: schedule.map((r) => r.closingBalance),
    },
    {
      key: 'inv',
      label: 'Cumulative investment',
      color: '#D4A017',
      values: schedule.map((r) => r.cumulativeInvestment),
    },
    {
      key: 'int',
      label: 'Cumulative interest',
      color: '#C44536',
      values: schedule.map((r) => r.cumulativeInterest),
    },
  ] as const;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => maxVal * f);
  const xIdx = [0, Math.round(maxX / 2), maxX].filter(
    (v, i, arr) => arr.indexOf(v) === i,
  );

  return (
    <div className="space-y-2" role="img" aria-label="PPF investment growth chart">
      <h4 className="text-sm font-semibold text-accent">PPF Investment Growth</h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={padL}
              x2={width - padR}
              y1={toY(t)}
              y2={toY(t)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <text
              x={padL - 6}
              y={toY(t) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={9}
            >
              {formatCurrencyValue(t, 'INR').replace(/\.00$/, '')}
            </text>
          </g>
        ))}
        {series.map((s) => (
          <polyline
            key={s.key}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            points={polyline(s.values, xs, toX, toY)}
          />
        ))}
        {xIdx.map((i) => (
          <text
            key={i}
            x={toX(i)}
            y={height - 10}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={9}
          >
            {schedule[i]?.financialYear ?? ''}
          </text>
        ))}
      </svg>
      <ul className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        {series.map((s) => (
          <li key={s.key} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: s.color }}
            />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
