'use client';

import Link from 'next/link';
import type { MaturityValueResult } from './types';

interface MaturityValueResultsProps {
  result: MaturityValueResult | null;
}

export function MaturityValueResults({ result }: MaturityValueResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Maturity value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMaturityValue}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Interest earned</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInterestEarned}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Duration (years)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.durationYears}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        MV = P × (1 + r)<sup>t</sup> · annual compounding
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/compound-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Compound Interest
        </Link>
        {' · '}
        <Link
          href="/tools/simple-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Simple Interest
        </Link>
        {' · '}
        <Link
          href="/tools/future-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Future Value
        </Link>
        {' · '}
        <Link
          href="/tools/present-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Present Value
        </Link>
        {' · '}
        <Link
          href="/tools/savings-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Savings
        </Link>
        {' · '}
        <Link
          href="/tools/apy-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APY
        </Link>
        .
      </p>
    </div>
  );
}
