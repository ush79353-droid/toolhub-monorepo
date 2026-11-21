'use client';

import type { CreditCardInterestResult } from './types';

interface CreditCardInterestResultsProps {
  result: CreditCardInterestResult | null;
  hasErrors: boolean;
}

export function CreditCardInterestResults({
  result,
  hasErrors,
}: CreditCardInterestResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-4 text-center">
        <p className="text-sm font-medium text-accent">
          {hasErrors
            ? 'Review highlighted inputs'
            : 'Enter your credit card details to see the interest and payoff estimate'}
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4"
      aria-live="polite"
    >
      <p className="text-[13px] font-semibold uppercase tracking-wide text-primary">
        Results
      </p>
      <p className="text-sm leading-relaxed text-accent">{result.summary}</p>
      <p className="text-sm leading-relaxed text-accent/90">{result.breakdown}</p>
      {result.neverPaysOff ? (
        <p className="text-xs text-rose-700" role="alert">
          The scheduled payment does not cover monthly interest, so the balance
          never pays off under these settings.
        </p>
      ) : null}
    </div>
  );
}
