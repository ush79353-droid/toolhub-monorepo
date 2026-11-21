'use client';

import Link from 'next/link';
import type { EarlyRetirementResult } from './types';

interface EarlyRetirementResultsProps {
  result: EarlyRetirementResult | null;
}

export function EarlyRetirementResults({
  result,
}: EarlyRetirementResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>

      {result.unreachable ? (
        <p className="text-sm text-rose-700" role="status">
          {result.statusMessage ??
            'Financial independence is unreachable with these inputs.'}
        </p>
      ) : (
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Monthly deposit</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedMonthlyDeposit}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Required balance</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedRequiredBalance}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total contribution</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTotalContribution}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total interest</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTotalInterest}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Duration</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedDuration}
            </dd>
          </div>
        </dl>
      )}

      <p className="font-mono text-xs text-muted-foreground">
        Required = Expenses ÷ (WR/100) · end-of-month deposits
      </p>

      {result.statusMessage && !result.unreachable ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.statusMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.contributionTimingNote}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/fire-calculator-financial-independence-retire-early"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FIRE Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/retirement-withdrawal-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Retirement Withdrawal
        </Link>
        {' · '}
        <Link
          href="/tools/compound-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Compound Interest
        </Link>
        .
      </p>
    </div>
  );
}
