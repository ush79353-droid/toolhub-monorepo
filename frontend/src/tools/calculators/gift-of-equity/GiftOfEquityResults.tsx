'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { GiftOfEquityResult } from './types';

interface GiftOfEquityResultsProps {
  result: GiftOfEquityResult | null;
}

export function GiftOfEquityResults({ result }: GiftOfEquityResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h3 className="text-[13px] font-semibold text-accent">Results</h3>
      <dl className="mt-2.5 space-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Market value</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedMarketValue}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Sales price</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedSalesPrice}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Gift of equity</dt>
          <dd className="text-base font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedGiftOfEquity}
          </dd>
        </div>
      </dl>

      {result.isNegativeDifference ? (
        <p
          className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900"
          role="status"
        >
          Sales price exceeds market value, so the difference is negative. A
          negative result is a mathematical difference only — it does not
          represent a positive gift of equity.
        </p>
      ) : null}
    </div>
  );
}
