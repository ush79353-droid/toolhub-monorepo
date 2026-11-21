'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { GdpPerCapitaResult } from './types';

interface GdpPerCapitaResultsProps {
  result: GdpPerCapitaResult | null;
}

function primaryValue(result: GdpPerCapitaResult): string {
  if (result.mode === 'perCapita') return result.formattedPerCapita;
  if (result.mode === 'gdp') return result.formattedGdp;
  return result.formattedPopulation;
}

export function GdpPerCapitaResults({ result }: GdpPerCapitaResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">{result.resultTitle}</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {primaryValue(result)}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total GDP</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedGdp}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Population</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPopulation}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">GDP per Capita</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPerCapita}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Measurement</dt>
          <dd className="text-right font-medium text-accent">
            {result.measureLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Currency</dt>
          <dd className="font-medium text-accent">{result.currency}</dd>
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
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
          <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="text-muted-foreground">{result.explanation}</p>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/gdp-growth-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Growth Rate
        </Link>
        {' · '}
        <Link
          href="/tools/gdp-gap-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Gap
        </Link>
        {' · '}
        <Link
          href="/tools/gdp-deflator-formula-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Deflator
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
          href="/tools/productivity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Productivity
        </Link>
        {' · '}
        <Link
          href="/tools/discretionary-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discretionary Income
        </Link>
        .
      </p>
    </div>
  );
}
