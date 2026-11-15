'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import { methodLabel } from './calculation';
import type { AccumulatedDepreciationResult } from './types';

interface AccumulatedDepreciationResultsProps {
  result: AccumulatedDepreciationResult | null;
  invalid: boolean;
}

export function AccumulatedDepreciationResults({
  result,
  invalid,
}: AccumulatedDepreciationResultsProps) {
  if (!result?.defined) {
    return (
      <div className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">
          {invalid ? 'Review highlighted inputs' : 'Enter asset details to calculate'}
        </p>
        <p className="mt-1 max-w-md text-xs font-normal leading-relaxed text-muted-foreground">
          {invalid
            ? 'Correct the messages above. Results stay blank until every number is usable.'
            : 'Accumulated depreciation and net book value update as you type.'}
        </p>
      </div>
    );
  }

  const money = (value: number) => formatCurrencyValue(value, result.currency);

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <p className="text-xs font-medium text-primary">Accumulated depreciation</p>
        <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
          {money(result.accumulatedDepreciation)}
        </p>
        <p className="mt-1.5 text-xs font-normal leading-relaxed text-muted-foreground">
          {methodLabel(result.method)}
          {result.method === 'declining-balance' && result.decliningBalanceRate !== null
            ? ` · rate ${(result.decliningBalanceRate * 100).toFixed(2)}% per year`
            : null}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <p className="text-xs font-medium text-muted-foreground">Net book value</p>
        <p className="mt-1 text-[22px] font-semibold tabular-nums text-accent sm:text-2xl">
          {money(result.netBookValue)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Asset cost {money(result.assetCost)} − accumulated depreciation{' '}
          {money(result.accumulatedDepreciation)}
        </p>
      </div>
    </div>
  );
}
