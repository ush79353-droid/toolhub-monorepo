'use client';

import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { formatEarlyLoanMoney } from './calculation';
import type { ChartPoint } from './types';

interface EarlyLoanPayoffChartProps {
  points: ChartPoint[];
  currency: SupportedCurrency;
}

export function EarlyLoanPayoffChart({ points, currency }: EarlyLoanPayoffChartProps) {
  const symbol = getCurrencySymbol(currency);
  const width = 560;
  const height = 220;
  const padLeft = 48;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 32;
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
  ) => points.map((p) => `${toX(p.year).toFixed(1)},${toY(p[key]).toFixed(1)}`).join(' ');

  const balanceLine = series('principalBalance');
  const principalPaidLine = series('principalPaid');
  const interestPaidLine = series('interestPaid');

  const yearTicks = Array.from({ length: Math.min(6, Math.floor(maxYear) + 1) }, (_, i) => {
    const y = (i / Math.max(1, Math.min(5, Math.floor(maxYear)))) * maxYear;
    return y;
  });

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-accent">Balances</h3>
        <p className="text-xs text-muted-foreground">Amounts in {symbol} ({currency})</p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Loan balances chart showing principal balance, principal paid, and interest paid"
      >
        <line
          x1={padLeft}
          y1={padTop + plotH}
          x2={padLeft + plotW}
          y2={padTop + plotH}
          className="stroke-border"
          strokeWidth={1}
        />
        <line
          x1={padLeft}
          y1={padTop}
          x2={padLeft}
          y2={padTop + plotH}
          className="stroke-border"
          strokeWidth={1}
        />
        <polyline
          fill="none"
          stroke="currentColor"
          className="text-accent"
          strokeWidth={2}
          points={balanceLine}
        />
        <polyline
          fill="none"
          stroke="currentColor"
          className="text-amber-600"
          strokeWidth={2}
          points={principalPaidLine}
        />
        <polyline
          fill="none"
          stroke="currentColor"
          className="text-rose-600"
          strokeWidth={2}
          points={interestPaidLine}
        />
        {yearTicks.map((y) => (
          <text
            key={y}
            x={toX(y)}
            y={height - 10}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {y.toFixed(y < 1 ? 1 : 0)}
          </text>
        ))}
        <text
          x={padLeft - 6}
          y={padTop + 4}
          textAnchor="end"
          className="fill-muted-foreground text-[9px]"
        >
          {formatEarlyLoanMoney(maxY, currency)}
        </text>
        <text
          x={padLeft - 6}
          y={padTop + plotH}
          textAnchor="end"
          className="fill-muted-foreground text-[9px]"
        >
          0
        </text>
      </svg>
      <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-accent" aria-hidden />
          Principal balance
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-amber-600" aria-hidden />
          Principal paid
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-rose-600" aria-hidden />
          Interest paid
        </li>
      </ul>
    </div>
  );
}
