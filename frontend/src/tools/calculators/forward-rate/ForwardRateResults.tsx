'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ForwardRateResult } from './types';

interface ForwardRateResultsProps {
  result: ForwardRateResult | null;
}

export function ForwardRateResults({ result }: ForwardRateResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Implied Forward Rate</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedForwardRate}
      </p>
      <p className="text-xs text-muted-foreground">{result.compoundingNote}</p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">n₁ (years)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.n1Years.toLocaleString('en-US', {
              maximumFractionDigits: 8,
            })}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">n₂ (years)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.n2Years.toLocaleString('en-US', {
              maximumFractionDigits: 8,
            })}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">S₁ (decimal)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.s1Decimal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">S₂ (decimal)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.s2Decimal}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <pre className="whitespace-pre-wrap font-mono text-[11px]">
            {result.formulaBreakdown}
          </pre>
          <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/yield-to-maturity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Yield to Maturity
        </Link>
        {' · '}
        <Link
          href="/tools/currency-forward-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Currency Forward
        </Link>
        {' · '}
        <Link
          href="/tools/credit-spread-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Spread
        </Link>
        {' · '}
        <Link
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect
        </Link>
      </p>
    </div>
  );
}
