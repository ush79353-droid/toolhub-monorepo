'use client';

import type { SavingsGoalResult } from './types';

interface SavingsGoalResultsProps {
  result: SavingsGoalResult | null;
  hasErrors: boolean;
}

export function SavingsGoalResults({
  result,
  hasErrors,
}: SavingsGoalResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-4 text-center">
        <p className="text-sm font-medium text-accent">
          {hasErrors
            ? 'Review highlighted inputs'
            : 'Enter your savings goal to see the required contribution'}
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4"
      aria-live="polite"
    >
      <p className="text-sm leading-relaxed text-accent">{result.summary}</p>
      <p className="text-sm leading-relaxed text-accent/90">{result.breakdown}</p>
    </div>
  );
}
