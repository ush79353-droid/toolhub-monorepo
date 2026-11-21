'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RealGdpChart } from './RealGdpChart';
import type { RealGdpResult } from './types';

interface RealGdpResultsProps {
  result: RealGdpResult | null;
}

function primaryTitle(mode: RealGdpResult['mode']): string {
  if (mode === 'nominal') return 'Nominal GDP';
  if (mode === 'deflator') return 'GDP Deflator';
  return 'Real GDP';
}

function primaryValue(result: RealGdpResult): string {
  if (result.mode === 'nominal') return result.formattedNominal;
  if (result.mode === 'deflator') return result.formattedDeflator;
  return result.formattedReal;
}

export function RealGdpResults({ result }: RealGdpResultsProps) {
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
            index
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
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Real / Nominal ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRatio}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        <span className="font-semibold text-accent">Price level adjustment: </span>
        {result.priceLevelInterpretation}
      </p>
      <p className="text-xs leading-relaxed text-foreground/90">
        <span className="font-semibold text-accent">Interpretation: </span>
        {result.interpretation}
      </p>

      {result.formattedGrowth ? (
        <p className="text-xs leading-relaxed text-foreground/90">
          <span className="font-semibold text-accent">Real GDP growth: </span>
          {result.formattedGrowth}. {result.growthNote}
        </p>
      ) : null}

      <RealGdpChart result={result} />

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
          href="/tools/gdp-deflator-formula-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Deflator Formula
        </Link>
        {' · '}
        <Link
          href="/tools/gdp-growth-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Growth Rate
        </Link>
        {' · '}
        <Link
          href="/tools/gdp-per-capita-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP per Capita
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
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inflation
        </Link>
        {' · '}
        <Link
          href="/tools/cpi-inflation-calculator-consumer-price-index"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CPI Inflation
        </Link>
        .
      </p>
    </div>
  );
}
