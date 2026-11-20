'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { EbitdaResult } from './types';

interface EbitdaResultsProps {
  result: EbitdaResult | null;
}

export function EbitdaResults({ result }: EbitdaResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">EBITDA summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Operating profit</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedOperatingProfit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Amortization</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAmortizationExpense}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Depreciation</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedDepreciationExpense}
          </dd>
        </div>
        {result.formattedEbitdaMargin !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">EBITDA margin</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedEbitdaMargin}%
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">EBITDA</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedEbitda}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        EBITDA = Operating profit + Amortization + Depreciation
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
          EBIT Calculator
        </a>
        .
      </p>
    </div>
  );
}
