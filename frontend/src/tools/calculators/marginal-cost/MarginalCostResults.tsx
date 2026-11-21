'use client';

import Link from 'next/link';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { MarginalCostResult } from './types';

interface MarginalCostResultsProps {
  result: MarginalCostResult | null;
}

export function MarginalCostResults({ result }: MarginalCostResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const blocked =
    result.status === 'zeroQuantityChange' || result.status === 'indeterminate';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Cost summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Change in total cost</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedChangeInTotalCost}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Change in quantity</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedChangeInQuantity}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Marginal cost</dt>
          <dd
            className={`font-semibold tabular-nums ${
              blocked ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {blocked
              ? 'Unavailable'
              : `${symbol}${result.formattedMarginalCostPerUnit}`}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        MC = ΔTC / ΔQ
      </p>
      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            blocked ? 'text-rose-700' : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/average-variable-cost-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Average Variable Cost
        </Link>
        {' · '}
        <Link
          href="/tools/optimal-price-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Optimal Price
        </Link>
        .
      </p>
    </div>
  );
}
