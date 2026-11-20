'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { PmiResult } from './types';

interface PmiResultsProps {
  result: PmiResult | null;
}

export function PmiResults({ result }: PmiResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h3 className="text-[13px] font-semibold text-accent">Result</h3>
      <dl className="mt-2.5 space-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Monthly PMI</dt>
          <dd className="text-base font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedMonthlyPmi}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Annual PMI</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedAnnualPmi}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Mortgage amount</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedMortgageAmount}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Loan-to-value (LTV)</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedLoanToValueRatio}%
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Down payment</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedDownPaymentAmount} (
            {result.formattedDownPaymentPercentage}%)
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {result.applicabilityMessage}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Estimates use your entered annual PMI rate. This is not a lender quote,
        insurance approval, or FHA mortgage insurance calculation.
      </p>
    </div>
  );
}
