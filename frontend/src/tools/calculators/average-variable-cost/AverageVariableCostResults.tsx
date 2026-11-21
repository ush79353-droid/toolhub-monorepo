'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { AverageVariableCostResult } from './types';

interface AverageVariableCostResultsProps {
  result: AverageVariableCostResult | null;
}

export function AverageVariableCostResults({
  result,
}: AverageVariableCostResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Variable cost summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Variable costs</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedVariableCosts}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Output produced</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedTotalOutput} {result.outputUnit}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Average variable cost</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedAverageVariableCost}/{result.outputUnit}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        AVC = VC / Q
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        AVC excludes fixed costs. It is not the same as average total cost,
        marginal cost, or selling price.
      </p>
    </div>
  );
}
