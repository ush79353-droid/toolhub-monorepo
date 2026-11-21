'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { GdpDeflatorResult } from './types';

interface GdpDeflatorResultsProps {
  result: GdpDeflatorResult | null;
}

function primaryTitle(mode: GdpDeflatorResult['mode']): string {
  if (mode === 'deflator') return 'GDP Deflator';
  if (mode === 'nominal') return 'Nominal GDP';
  return 'Real GDP';
}

function primaryValue(result: GdpDeflatorResult): string {
  if (result.mode === 'deflator') return result.formattedDeflator;
  if (result.mode === 'nominal') return result.formattedNominal;
  return result.formattedReal;
}

export function GdpDeflatorResults({ result }: GdpDeflatorResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        {primaryTitle(result.mode)}
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {primaryValue(result)}
        {result.mode === 'deflator' ? (
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            index points
          </span>
        ) : null}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Nominal GDP</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNominal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Real GDP</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedReal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">GDP Deflator</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDeflator}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        <span className="font-semibold text-accent">Price-level interpretation: </span>
        {result.priceLevelInterpretation}
      </p>
      {result.zeroNominalNote ? (
        <p className="text-xs leading-relaxed text-amber-800">
          {result.zeroNominalNote}
        </p>
      ) : null}

      {result.formattedInflation ? (
        <p className="text-xs leading-relaxed text-foreground/90">
          <span className="font-semibold text-accent">
            Deflator inflation rate:{' '}
          </span>
          {result.formattedInflation}. {result.inflationNote}
        </p>
      ) : null}

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
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect
        </Link>
        {' · '}
        <Link
          href="/tools/fisher-equation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Equation
        </Link>
        {' · '}
        <Link
          href="/tools/salary-inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Salary Inflation
        </Link>
        .
      </p>
    </div>
  );
}
