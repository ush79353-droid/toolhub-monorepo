'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { WhatToOfferResult } from './types';

interface WhatToOfferResultsProps {
  result: WhatToOfferResult | null;
}

export function WhatToOfferResults({ result }: WhatToOfferResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Calculation breakdown</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fair market value</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedFairMarketValue}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">− Renovation</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedRenovationCost}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">− Desired discount</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedDiscountAmount}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">− Desired profit</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedDesiredProfit}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="text-muted-foreground">Total deductions</dt>
          <dd className="font-medium tabular-nums text-accent">
            {symbol}
            {result.formattedTotalDeductions}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-accent">Offer amount</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedActionableOfferAmount !== null
              ? `${symbol}${result.formattedActionableOfferAmount}`
              : `${symbol}${result.formattedRawOfferAmount} (not actionable)`}
          </dd>
        </div>
        {result.formattedOfferToValue !== null ? (
          <div className="flex justify-between gap-2 pt-1 text-xs text-muted-foreground">
            <dt>Offer-to-value</dt>
            <dd className="tabular-nums">{result.formattedOfferToValue}%</dd>
          </div>
        ) : null}
        {result.formattedTotalOfferReduction !== null ? (
          <div className="flex justify-between gap-2 text-xs text-muted-foreground">
            <dt>Total reduction vs FMV</dt>
            <dd className="tabular-nums">
              {result.formattedTotalOfferReduction}%
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Total reduction includes renovation, discount, and profit allowance —
        it is broader than the Desired Discount field alone. Do not confuse
        current FMV with after-repair value (ARV).
      </p>
    </div>
  );
}
