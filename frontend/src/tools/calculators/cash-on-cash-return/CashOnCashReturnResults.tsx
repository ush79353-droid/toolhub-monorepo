'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { CashOnCashResult } from './types';

interface CashOnCashReturnResultsProps {
  result: CashOnCashResult | null;
}

export function CashOnCashReturnResults({
  result,
}: CashOnCashReturnResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h3 className="text-[13px] font-semibold text-accent">Results</h3>
      <dl className="mt-2.5 space-y-2.5 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Cash-on-cash return</dt>
          <dd className="text-base font-semibold tabular-nums text-accent">
            {result.formattedCashOnCashReturn !== null
              ? `${result.formattedCashOnCashReturn}%`
              : '—'}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Net operating income</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedNoi}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Annual debt service</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedAnnualDebtService}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Annual cash flow</dt>
          <dd
            className={`font-semibold tabular-nums ${
              result.annualCashFlow < 0 ? 'text-amber-700' : 'text-accent'
            }`}
          >
            {symbol}
            {result.formattedAnnualCashFlow}
          </dd>
        </div>
      </dl>
      {result.formattedCashOnCashReturn === null ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Enter a cash investment greater than zero to compute cash-on-cash
          return.
        </p>
      ) : null}
    </div>
  );
}
