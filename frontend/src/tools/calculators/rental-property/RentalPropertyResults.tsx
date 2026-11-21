'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { RentalPropertyResult } from './types';

interface RentalPropertyResultsProps {
  result: RentalPropertyResult | null;
}

export function RentalPropertyResults({ result }: RentalPropertyResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Key results</h3>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-2 border-b border-border/60 pb-1.5">
          <dt className="text-muted-foreground">Monthly loan payment</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedMonthlyMortgagePayment}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-border/60 pb-1.5">
          <dt className="text-muted-foreground">NOI (annual)</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedNoi}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-border/60 pb-1.5">
          <dt className="text-muted-foreground">Annual cash flow</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedAnnualCashFlow}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-border/60 pb-1.5">
          <dt className="text-muted-foreground">Cash-on-cash</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedCashOnCashReturn !== null
              ? `${result.formattedCashOnCashReturn}%`
              : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-b border-border/60 pb-1.5 sm:border-b-0 sm:pb-0">
          <dt className="text-muted-foreground">Cap rate</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedCapRate !== null
              ? `${result.formattedCapRate}%`
              : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total ROI</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedTotalRoi !== null
              ? `${result.formattedTotalRoi}%`
              : '—'}
          </dd>
        </div>
      </dl>
    </div>
  );
}
