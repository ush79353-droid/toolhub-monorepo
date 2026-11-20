'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { ConsumerSurplusResult } from './types';

interface ConsumerSurplusResultsProps {
  result: ConsumerSurplusResult | null;
}

export function ConsumerSurplusResults({
  result,
}: ConsumerSurplusResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const exceeds = result.status === 'priceExceedsWillingness';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Consumer surplus summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Actual price</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedActualPrice}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Willing price (WTP)</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedWillingPrice}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Price difference</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedSignedDifference}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">
            {exceeds ? 'Realized consumer surplus' : 'Consumer surplus'}
          </dt>
          <dd className="font-semibold tabular-nums text-accent">
            {exceeds
              ? 'Not applicable'
              : `${symbol}${result.formattedConsumerSurplus}`}
          </dd>
        </div>
        {result.formattedSavingsPercentage !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Savings relative to WTP
            </dt>
            <dd className="tabular-nums text-accent">
              {result.formattedSavingsPercentage}%
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        CS = WTP − P
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
