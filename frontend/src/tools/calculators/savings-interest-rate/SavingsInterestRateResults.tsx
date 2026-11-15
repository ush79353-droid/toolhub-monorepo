'use client';

import { SavingsInterestRateChart } from './SavingsInterestRateChart';
import type { SavingsInterestRateResult } from './types';

interface SavingsInterestRateResultsProps {
  result: SavingsInterestRateResult | null;
  hasErrors: boolean;
}

export function SavingsInterestRateResults({
  result,
  hasErrors,
}: SavingsInterestRateResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-4 text-center">
        <p className="text-sm font-medium text-accent">
          {hasErrors
            ? 'Review highlighted inputs'
            : 'Enter your savings plan to solve the required interest rate'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4"
        aria-live="polite"
      >
        <p className="text-xs font-medium text-primary">Required savings interest rate</p>
        <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
          {result.formattedRequiredRate}%
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Total money deposited:{' '}
          <span className="font-semibold tabular-nums text-accent">
            {result.formattedTotalDeposited}
          </span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Projected final balance at this rate:{' '}
          <span className="font-medium text-accent">{result.formattedFinalBalance}</span>
        </p>
        {result.explanation ? (
          <p className="mt-2 text-xs text-muted-foreground">{result.explanation}</p>
        ) : null}
      </div>

      <section
        aria-labelledby="sir-yearly-heading"
        className="rounded-xl border border-border p-3.5 sm:p-4"
      >
        <h3 id="sir-yearly-heading" className="mb-3 text-sm font-semibold text-accent">
          Yearly balances
        </h3>
        <SavingsInterestRateChart points={result.annualPoints} />
      </section>
    </div>
  );
}
