'use client';

import type { SupportedCurrency } from '@/tools/shared/currency';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatFireMoney } from './calculation';
import type { FireProjectionPoint } from './types';

export function FireProjectionChart({
  points,
  currency,
  retirementAge,
  fiAge,
}: {
  points: FireProjectionPoint[];
  currency: SupportedCurrency;
  retirementAge: number;
  fiAge: number | null;
}) {
  if (points.length < 2) return null;

  const width = 440;
  const height = 230;
  const padL = 54;
  const padR = 14;
  const padT = 16;
  const padB = 32;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const ages = points.map((p) => p.age);
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  const values = points.flatMap((p) => [p.portfolioValue, p.fireTarget]);
  const maxV = Math.max(1, ...values) * 1.08;

  const toX = (age: number) =>
    padL + ((age - minAge) / Math.max(1, maxAge - minAge)) * plotW;
  const toY = (v: number) => padT + plotH - (v / maxV) * plotH;

  const portfolioPath = points
    .map(
      (pt, i) =>
        `${i === 0 ? 'M' : 'L'} ${toX(pt.age).toFixed(1)} ${toY(pt.portfolioValue).toFixed(1)}`,
    )
    .join(' ');
  const targetPath = points
    .map(
      (pt, i) =>
        `${i === 0 ? 'M' : 'L'} ${toX(pt.age).toFixed(1)} ${toY(pt.fireTarget).toFixed(1)}`,
    )
    .join(' ');

  const symbol = getCurrencySymbol(currency);
  const fmt = (v: number) => {
    if (v >= 1_000_000) return `${symbol}${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${symbol}${(v / 1_000).toFixed(0)}K`;
    return `${symbol}${Math.round(v)}`;
  };
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxV);

  return (
    <div className="rounded-xl border border-border bg-white p-3 sm:p-4">
      <h3 className="mb-2 text-sm font-semibold text-accent">
        Your path to financial independence
      </h3>
      <div className="mb-2 flex flex-wrap gap-3 text-xs text-accent">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#3B82F6]" aria-hidden />
          Projected savings
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#16A34A]" aria-hidden />
          FIRE target
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Portfolio growth toward FIRE target by age"
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
        <path d={targetPath} fill="none" stroke="#16A34A" strokeWidth={2} strokeDasharray="4 3" />
        <path d={portfolioPath} fill="none" stroke="#3B82F6" strokeWidth={2.5} />
        <line
          x1={toX(retirementAge)}
          x2={toX(retirementAge)}
          y1={padT}
          y2={padT + plotH}
          stroke="#94A3B8"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        {fiAge !== null ? (
          <circle
            cx={toX(fiAge)}
            cy={toY(points.find((p) => p.age === fiAge)?.portfolioValue ?? 0)}
            r={4}
            fill="#CA8A04"
          />
        ) : null}
        <text
          x={padL + plotW / 2}
          y={height - 8}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={10}
        >
          Age
        </text>
      </svg>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Retirement age {retirementAge}
        {fiAge !== null ? ` · FI estimated at age ${fiAge}` : ' · FI not reached before retirement'}
        {' · '}
        Ending portfolio {symbol}
        {formatFireMoney(points[points.length - 1]!.portfolioValue, currency)}
      </p>
    </div>
  );
}
