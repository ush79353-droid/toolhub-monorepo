'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PutCallParityResult } from './types';

interface PutCallParityResultsProps {
  result: PutCallParityResult | null;
}

const TARGET_TITLE: Record<PutCallParityResult['solveTarget'], string> = {
  call: 'European call option price',
  put: 'European put option price',
  pvStrike: 'Present value of strike price',
  spot: 'Spot price of the underlying asset',
};

export function PutCallParityResults({ result }: PutCallParityResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Solved: {TARGET_TITLE[result.solveTarget]}
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedSolved}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Call (C)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCall}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Put (P)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPut}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">PV(K)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPvStrike}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Spot (S)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedSpot}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.parityCheck}
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
          href="/tools/black-scholes-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Scholes
        </Link>
        {' · '}
        <Link
          href="/tools/call-option-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Call Option
        </Link>
        {' · '}
        <Link
          href="/tools/forward-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Forward Rate
        </Link>
      </p>
    </div>
  );
}
