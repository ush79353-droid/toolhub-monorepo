'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { EarnestMoneyResult } from './types';

interface EarnestMoneyResultsProps {
  result: EarnestMoneyResult | null;
}

export function EarnestMoneyResults({ result }: EarnestMoneyResultsProps) {
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
          <dt className="text-muted-foreground">Property price</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedPropertyPrice}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Earnest money percentage</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedEarnestMoneyPercentage}%
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Earnest money needed</dt>
          <dd className="text-base font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedEarnestMoneyAmount}
          </dd>
        </div>
      </dl>
    </div>
  );
}
