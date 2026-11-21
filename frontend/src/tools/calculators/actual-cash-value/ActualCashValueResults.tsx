'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { ActualCashValueResult } from './types';

interface ActualCashValueResultsProps {
  result: ActualCashValueResult | null;
}

export function ActualCashValueResults({
  result,
}: ActualCashValueResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Depreciation breakdown</h3>
      <dl className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Accumulated depreciation</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAccumulatedDepreciation}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Annual depreciation</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAnnualDepreciation}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Monthly depreciation</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedMonthlyDepreciation}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Depreciation</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedDepreciationPercentage}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Remaining value</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedRemainingValuePercentage}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Remaining useful life</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedRemainingUsefulLife}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Educational estimate only. Actual insurance ACV may use replacement
        cost, condition, policy terms, and insurer methods that differ from this
        purchase-price straight-line model.
      </p>
    </div>
  );
}
