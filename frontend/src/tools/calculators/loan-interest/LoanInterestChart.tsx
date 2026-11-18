'use client';

import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { formatLoanInterestMoney } from './calculation';
import type { ChartPoint } from './types';

interface LoanInterestChartProps {
  points: ChartPoint[];
  currency: SupportedCurrency;
}

export function LoanInterestChart({ points, currency }: LoanInterestChartProps) {
  const symbol = getCurrencySymbol(currency);
  const width = 560;
  const height = 240;
  const padLeft = 48;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 36;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxYear = Math.max(1, ...points.map((p) => p.year));
  const maxY = Math.max(
    1,
    ...points.map((p) =>
      Math.max(p.principalBalance, p.principalPaid, p.interestPaid)
    )
  );

  const toX = (year: number) => padLeft + (year / maxYear) * plotW;
  const toY = (v: number) => padTop + plotH - (v / maxY) * plotH;

  const series = (
    key: keyof Pick<ChartPoint, 'principalBalance' | 'principalPaid' | 'interestPaid'>
  ) =>
    points
      .map((p) => `${toX(p.year).toFixed(1)},${toY(p[key]).toFixed(1)}`)
      .join(' ');

  const yearTickCount = Math.min(11, Math.floor(maxYear) + 1);
  const yearTicks = Array.from({ length: yearTickCount }, (_, i) =>
    yearTickCount <= 1 ? 0 : (i / (yearTickCount - 1)) * maxYear
  );

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxY);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-accent">Yearly balances</h3>
        <p className="text-xs text-muted-foreground">
          Amounts in {symbol} ({currency})
        </p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Yearly balances chart showing principal balance, principal paid, and interest paid"
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={padLeft}
              y1={toY(v)}
              x2={padLeft + plotW}
              y2={toY(v)}
              className="stroke-border"
              strokeWidth={1}
              strokeDasharray={v === 0 ? undefined : '3 3'}
            />
            <text
              x={padLeft - 6}
              y={toY(v) + 3}
              textAnchor="end"
              className="fill-muted-foreground text-[9px]"
            >
              {v === 0 ? '0' : formatLoanInterestMoney(v, currency)}
            </text>
          </g>
        ))}
        <polyline
          fill="none"
          stroke="#2563EB"
          strokeWidth={2}
          points={series('principalBalance')}
        />
        <polyline
          fill="none"
          stroke="#EF4444"
          strokeWidth={2}
          points={series('principalPaid')}
        />
        <polyline
          fill="none"
          stroke="#EAB308"
          strokeWidth={2}
          points={series('interestPaid')}
        />
        {yearTicks.map((y) => (
          <text
            key={y}
            x={toX(y)}
            y={height - 12}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {Number.isInteger(y) ? String(y) : y.toFixed(1)}
          </text>
        ))}
      </svg>
      <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#2563EB]" aria-hidden />
          Principal balance
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#EF4444]" aria-hidden />
          Principal paid
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#EAB308]" aria-hidden />
          Interest paid
        </li>
      </ul>
    </div>
  );
}
