'use client';

import { InvestmentChart } from './InvestmentChart';
import type { InvestmentResult } from './types';

interface InvestmentResultsProps {
  result: InvestmentResult | null;
  incomplete: boolean;
  hasErrors: boolean;
}

export function InvestmentResults({
  result,
  incomplete,
  hasErrors,
}: InvestmentResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-4 text-center">
        <p className="text-sm font-medium text-accent">
          {hasErrors
            ? 'Review highlighted inputs'
            : incomplete
              ? 'Enter investment details to project the final balance'
              : 'Enter investment details to project the final balance'}
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
        <p className="text-sm leading-relaxed text-accent">
          Your final balance will be{' '}
          <span className="font-bold tabular-nums">{result.formattedFinalBalance}</span>.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Thus, you earn{' '}
          <span className="font-semibold tabular-nums text-accent">
            {result.formattedReturn}
          </span>{' '}
          on your investment.
        </p>
        {result.formattedInflationAdjusted ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Inflation-adjusted value at {result.inflationRatePercent}% annual inflation:{' '}
            <span className="font-medium text-accent">{result.formattedInflationAdjusted}</span>.
          </p>
        ) : null}
      </div>

      <section
        aria-labelledby="inv-annual-heading"
        className="rounded-xl border border-border p-3.5 sm:p-4"
      >
        <h3 id="inv-annual-heading" className="mb-3 text-sm font-semibold text-accent">
          Annual balances
        </h3>
        <InvestmentChart points={result.annualPoints} />
      </section>
    </div>
  );
}
