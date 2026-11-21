'use client';

import type { CreditCardPaymentResult } from './types';

interface CreditCardPaymentResultsProps {
  result: CreditCardPaymentResult | null;
  hasErrors: boolean;
}

export function CreditCardPaymentResults({
  result,
  hasErrors,
}: CreditCardPaymentResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-4 text-center">
        <p className="text-sm font-medium text-accent">
          {hasErrors
            ? 'Review highlighted inputs'
            : 'Enter your credit card details to see the required monthly payment'}
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
        Monthly payment details
      </p>
      <p className="text-sm leading-relaxed text-accent">{result.summary}</p>
      <p className="text-sm leading-relaxed text-accent/90">{result.breakdown}</p>
      {result.paymentRaisedToMinimum ? (
        <p className="text-xs text-amber-800">
          The calculated payment was below your card minimum, so the payment was
          raised to the minimum. Payoff may finish sooner than the selected term.
        </p>
      ) : null}
    </div>
  );
}
