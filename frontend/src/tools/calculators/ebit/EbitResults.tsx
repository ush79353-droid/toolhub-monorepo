'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { EbitResult } from './types';

interface EbitResultsProps {
  result: EbitResult | null;
}

export function EbitResults({ result }: EbitResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">EBIT summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Revenue</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedRevenue}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Operating expenses</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedOperatingExpenses}
          </dd>
        </div>
        {result.formattedEbitMargin !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">EBIT margin</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedEbitMargin}%
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">EBIT</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedEbit}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        EBIT = Revenue − Operating expenses
      </p>
      {result.warningMessage ? (
        <p className="mt-2 text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
    </div>
  );
}
