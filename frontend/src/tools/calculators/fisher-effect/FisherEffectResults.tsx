'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { FisherEffectResult } from './types';

interface FisherEffectResultsProps {
  result: FisherEffectResult | null;
}

function computedLabel(mode: FisherEffectResult['mode']): string {
  if (mode === 'real') return 'Exact real interest rate';
  if (mode === 'nominal') return 'Exact nominal interest rate';
  return 'Exact expected inflation';
}

function approxLabel(mode: FisherEffectResult['mode']): string {
  if (mode === 'real') return 'Approximate real interest rate';
  if (mode === 'nominal') return 'Approximate nominal interest rate';
  return 'Approximate expected inflation';
}

export function FisherEffectResults({ result }: FisherEffectResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const primary =
    result.mode === 'real'
      ? result.formattedReal
      : result.mode === 'nominal'
        ? result.formattedNominal
        : result.formattedInflation;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        {computedLabel(result.mode)}
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">{primary}</p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Nominal interest rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNominal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Expected inflation</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInflation}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Real interest rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedReal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">{approxLabel(result.mode)}</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedApproximate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Approximation difference (exact − approx)
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDifference}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show formula & steps'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
          <p className="text-muted-foreground">{result.explanation}</p>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
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
          href="/tools/currency-forward-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Currency Forward
        </Link>
        {' · '}
        <Link
          href="/tools/carry-trade-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Carry Trade
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
