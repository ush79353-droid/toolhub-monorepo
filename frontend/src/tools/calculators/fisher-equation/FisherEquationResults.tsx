'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { FisherEquationResult } from './types';

interface FisherEquationResultsProps {
  result: FisherEquationResult | null;
}

export function FisherEquationResults({ result }: FisherEquationResultsProps) {
  const [showDetails, setShowDetails] = useState(true);
  if (!result) return null;

  const primary =
    result.mode === 'real'
      ? result.formattedReal
      : result.mode === 'nominal'
        ? result.formattedNominal
        : result.formattedInflation;

  const primaryLabel =
    result.mode === 'real'
      ? 'Exact real interest rate'
      : result.mode === 'nominal'
        ? 'Exact nominal interest rate'
        : 'Exact expected inflation';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">{primaryLabel}</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">{primary}</p>
      <p className="text-sm text-muted-foreground">
        Approximated: {result.formattedApproximate}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Nominal interest rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNominal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Expected inflation rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInflation}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Exact real interest rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedReal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Approximate result</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedApproximate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Absolute difference</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDifferencePp}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showDetails ? 'Hide calculation details' : 'Calculation details'}
      </button>
      {showDetails ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.activeEquation}</p>
          <ol className="list-decimal space-y-1 pl-4">
            {result.stepByStep.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="font-mono text-muted-foreground">{result.formulaBreakdown}</p>
          <p className="text-muted-foreground">{result.explanation}</p>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect
        </Link>
        {' · '}
        <Link
          href="/tools/cpi-inflation-calculator-consumer-price-index"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CPI Inflation
        </Link>
        {' · '}
        <Link
          href="/tools/buying-power-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Buying Power
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
          href="/tools/apr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APR
        </Link>
        .
      </p>
    </div>
  );
}
