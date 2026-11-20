'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { EbtResult } from './types';

interface EbtResultsProps {
  result: EbtResult | null;
}

export function EbtResults({ result }: EbtResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Earnings before tax summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Gross profit</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedGrossProfit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Operating expenses</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedOperatingExpenses}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">EBIT (implied)</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedEbit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Interest expenses</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedInterestExpenses}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Other income</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedOtherIncome}
          </dd>
        </div>
        {result.formattedEbtMargin !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">EBT margin</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedEbtMargin}%
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">EBT</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedEarningsBeforeTax}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        EBT = Gross profit − OpEx − Interest + Other income
      </p>
      {result.warningMessage ? (
        <p className="mt-2 text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <a
          href="/tools/ebit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBIT
        </a>
        ,{' '}
        <a
          href="/tools/ebitda-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA
        </a>
        .
      </p>
    </div>
  );
}
