'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { CurrentRatioResult } from './types';

interface CurrentRatioResultsProps {
  result: CurrentRatioResult | null;
}

export function CurrentRatioResults({ result }: CurrentRatioResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Current ratio summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Current assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedCurrentAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Current liabilities</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedCurrentLiabilities}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Current ratio</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedCurrentRatio}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              ({result.formattedCurrentRatioColon})
            </span>
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Working capital</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedWorkingCapital}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        CR = CA / CL · WC = CA − CL
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
    </div>
  );
}
