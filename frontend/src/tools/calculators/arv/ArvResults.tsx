'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { ArvResult } from './types';

interface ArvResultsProps {
  result: ArvResult | null;
}

export function ArvResults({ result }: ArvResultsProps) {
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
          <dt className="text-muted-foreground">After repair value</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedArv}
          </dd>
        </div>
        {result.formattedMaximumBid ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Maximum bid price</dt>
            <dd
              className={`font-semibold tabular-nums ${
                result.maximumBidNegative ? 'text-amber-700' : 'text-accent'
              }`}
            >
              {symbol}
              {result.formattedMaximumBid}
            </dd>
          </div>
        ) : null}
        {result.formattedRoi !== null ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Estimated ROI</dt>
            <dd className="font-semibold tabular-nums text-accent">
              {result.formattedRoi}%
            </dd>
          </div>
        ) : null}
        {result.formattedTargetPurchasePrice ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Target-ROI purchase price</dt>
            <dd className="font-semibold tabular-nums text-accent">
              {symbol}
              {result.formattedTargetPurchasePrice}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
