'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { ScheduleRow } from './types';

interface MoratoriumChartProps {
  schedule: ScheduleRow[];
  currency: SupportedCurrency;
  moratoriumStartIndex: number;
  moratoriumEndIndex: number;
}

export function MoratoriumChart({
  schedule,
  currency,
  moratoriumStartIndex,
  moratoriumEndIndex,
}: MoratoriumChartProps) {
  if (schedule.length < 2) return null;

  const width = 560;
  const height = 220;
  const padL = 52;
  const padR = 12;
  const padT = 16;
  const padB = 32;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const balances = schedule.map((r) => r.closingBalance);
  const maxVal = Math.max(1, ...balances, ...schedule.map((r) => r.openingBalance));
  const n = schedule.length;
  const toX = (i: number) => padL + (i / Math.max(1, n - 1)) * plotW;
  const toY = (v: number) => padT + plotH - (v / maxVal) * plotH;

  const points = balances
    .map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(' ');

  const yTicks = [0, 0.5, 1].map((f) => maxVal * f);
  const shadeLeft = toX(Math.max(0, moratoriumStartIndex));
  const shadeRight = toX(Math.min(n - 1, moratoriumEndIndex));

  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-3 sm:p-4">
      <h3 className="text-sm font-medium text-accent">Principal Balance Over Time</h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-48 w-full min-w-[280px] sm:h-52"
        role="img"
        aria-label="Outstanding loan balance over payments with moratorium period highlighted"
      >
        <title>Loan balance path</title>
        {moratoriumEndIndex > moratoriumStartIndex ? (
          <rect
            x={shadeLeft}
            y={padT}
            width={Math.max(0, shadeRight - shadeLeft)}
            height={plotH}
            fill="#087E8B"
            opacity="0.12"
          />
        ) : null}
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
        <polyline fill="none" stroke="#087E8B" strokeWidth="2" points={points} />
      </svg>
      <p className="text-xs text-muted-foreground">
        Shaded band marks the moratorium payment window.
      </p>
    </div>
  );
}
