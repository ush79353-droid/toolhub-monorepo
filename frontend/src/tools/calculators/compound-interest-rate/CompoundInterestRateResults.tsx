'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import { COMPOUNDING_OPTIONS, type CompoundInterestRateResult } from './types';

interface CompoundInterestRateResultsProps {
  result: CompoundInterestRateResult | null;
  invalid: boolean;
}

export function CompoundInterestRateResults({
  result,
  invalid,
}: CompoundInterestRateResultsProps) {
  if (!result?.defined || result.annualNominalRatePercent === null) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-4 text-center">
        <p className="text-sm font-medium text-accent">
          {invalid ? 'Review highlighted inputs' : 'Enter balances and term to solve the rate'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Surplus and the annual nominal compound rate update automatically.
        </p>
      </div>
    );
  }

  const frequency =
    COMPOUNDING_OPTIONS.find((o) => o.value === result.compounding)?.label ??
    result.compounding;

  return (
    <div
      className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4"
      aria-live="polite"
    >
      <p className="text-xs font-medium text-primary">Compound interest rate</p>
      <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
        {result.annualNominalRatePercent}%
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        Annual nominal rate with {frequency.toLowerCase()} compounding. Surplus{' '}
        {formatCurrencyValue(result.surplus, result.currency)}.
      </p>
    </div>
  );
}
