'use client';

import Link from 'next/link';
import type { FibonacciInput, FibonacciResult } from './types';

interface FibonacciResultsProps {
  input: FibonacciInput;
  result: FibonacciResult | null;
}

export function FibonacciResults({ input, result }: FibonacciResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Trend</dt>
          <dd className="font-medium capitalize text-accent">{input.trend}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Level type</dt>
          <dd className="font-medium capitalize text-accent">
            {input.levelType}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Price difference</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDifference}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        {input.levelType === 'retracement'
          ? input.trend === 'uptrend'
            ? 'Level = High − (High − Low) × ratio'
            : 'Level = Low + (High − Low) × ratio'
          : input.trend === 'uptrend'
            ? 'Extension = Low + (High − Low) × ratio'
            : 'Extension = High − (High − Low) × ratio'}
      </p>

      {result.warningMessage ? (
        <p
          className={`text-xs leading-relaxed ${
            result.hasNegativeLevel ? 'text-rose-800' : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/roi-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROI
        </Link>
        {' · '}
        <Link
          href="/tools/percentage-return-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Percentage Return
        </Link>
        {' · '}
        <Link
          href="/tools/compound-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Compound Interest
        </Link>
        {' · '}
        <Link
          href="/tools/enterprise-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Enterprise Value
        </Link>
        {' · '}
        <Link
          href="/tools/financial-leverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Financial Leverage
        </Link>
        .
      </p>
    </div>
  );
}
