'use client';

import type { FinanceChartPoint } from './types';
import { formatFinanceMoney } from './calculation';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { getCurrencySymbol } from '@/tools/shared/currency';

export function FinanceValueChart({
  points,
  currency,
}: {
  points: FinanceChartPoint[];
  currency: SupportedCurrency;
}) {
  if (points.length < 2) return null;

  const width = 420;
  const height = 220;
  const padL = 52;
  const padR = 14;
  const padT = 14;
  const padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxPeriod = Math.max(1, ...points.map((p) => p.period));
  const values = points.flatMap((p) => [
    p.balance,
    p.sumOfPmt,
    p.accumulatedInterest,
  ]);
  const rawMin = Math.min(0, ...values);
  const rawMax = Math.max(0, ...values);
  const span = Math.max(1, rawMax - rawMin);
  const minV = rawMin - span * 0.05;
  const maxV = rawMax + span * 0.05;

  const toX = (period: number) => padL + (period / maxPeriod) * plotW;
  const toY = (value: number) => padT + ((maxV - value) / (maxV - minV)) * plotH;

  const line = (key: keyof Omit<FinanceChartPoint, 'period'>, color: string) => {
    const d = points
      .map(
        (pt, i) =>
          `${i === 0 ? 'M' : 'L'} ${toX(pt.period).toFixed(1)} ${toY(pt[key]).toFixed(1)}`,
      )
      .join(' ');
    return <path d={d} fill="none" stroke={color} strokeWidth={2} />;
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => minV + t * (maxV - minV));
  const symbol = getCurrencySymbol(currency);
  const fmt = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 1_000_000) return `${symbol}${(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${symbol}${(v / 1_000).toFixed(0)}K`;
    return `${symbol}${Math.round(v)}`;
  };

  return (
    <div className="rounded-xl border border-border bg-white p-3 sm:p-4">
      <h3 className="mb-2 text-sm font-semibold text-accent">Value changes over time</h3>
      <div className="mb-2 flex flex-wrap gap-3 text-xs text-accent">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#3B82F6]" aria-hidden />
          Balance
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#16A34A]" aria-hidden />
          Sum of PMT
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#CA8A04]" aria-hidden />
          Accumulated interest
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Value changes over time for balance, payments, and interest"
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padL}
              x2={width - padR}
              y1={toY(tick)}
              y2={toY(tick)}
              stroke="#E2E8F0"
              strokeWidth={1}
            />
            <text
              x={padL - 6}
              y={toY(tick) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={9}
            >
              {fmt(tick)}
            </text>
          </g>
        ))}
        {line('balance', '#3B82F6')}
        {line('sumOfPmt', '#16A34A')}
        {line('accumulatedInterest', '#CA8A04')}
        <text
          x={padL + plotW / 2}
          y={height - 6}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={10}
        >
          Period
        </text>
      </svg>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Final balance {symbol}
        {formatFinanceMoney(points[points.length - 1]!.balance, currency)}
      </p>
    </div>
  );
}
