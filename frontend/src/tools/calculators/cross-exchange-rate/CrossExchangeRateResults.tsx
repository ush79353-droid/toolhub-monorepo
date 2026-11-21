'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CrossExchangeRateResult } from './types';

interface CrossExchangeRateResultsProps {
  result: CrossExchangeRateResult | null;
}

export function CrossExchangeRateResults({
  result,
}: CrossExchangeRateResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Cross rate</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        A/B = {result.formattedAB}
      </p>
      <p className="text-sm tabular-nums text-muted-foreground">
        B/A = {result.formattedBA}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">A/C</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAC}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">C/A</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCA}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">B/C</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedBC}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">C/B</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCB}
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

      <p className="text-xs text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/currency-forward-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Currency Forward Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/carry-trade-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Carry Trade Calculator
        </Link>
      </p>
    </div>
  );
}
