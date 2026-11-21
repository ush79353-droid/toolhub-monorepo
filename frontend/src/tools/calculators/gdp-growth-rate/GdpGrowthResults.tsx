'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { GdpGrowthResult } from './types';

interface GdpGrowthResultsProps {
  result: GdpGrowthResult | null;
}

function primaryTitle(mode: GdpGrowthResult['mode']): string {
  if (mode === 'growth') return 'GDP Growth';
  if (mode === 'current') return 'Current GDP';
  return 'Previous GDP';
}

function primaryValue(result: GdpGrowthResult): string {
  if (result.mode === 'growth') return result.formattedGrowth;
  if (result.mode === 'current') return result.formattedCurrent;
  return result.formattedPrevious;
}

export function GdpGrowthResults({ result }: GdpGrowthResultsProps) {
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
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Current GDP</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCurrent}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Previous GDP</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPrevious}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Absolute GDP change</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAbsoluteChange}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">GDP growth</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedGrowth}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Period</dt>
          <dd className="text-right font-medium text-accent">
            {result.periodLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Measurement</dt>
          <dd className="text-right font-medium text-accent">
            {result.measureLabel}
          </dd>
        </div>
        {result.formattedAnnualized ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Annualized QoQ (optional)
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedAnnualized}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs font-semibold text-accent">{result.statusTitle}</p>
        <p className="mt-1 text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
      </div>

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
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect
        </Link>
        {' · '}
        <Link
          href="/tools/productivity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Productivity
        </Link>
        .
      </p>
    </div>
  );
}
