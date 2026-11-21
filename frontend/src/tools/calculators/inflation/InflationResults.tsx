'use client';

import { useState } from 'react';
import Link from 'next/link';
import { InflationChart } from './InflationChart';
import type { InflationResult } from './types';

interface InflationResultsProps {
  result: InflationResult | null;
}

export function InflationResults({ result }: InflationResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Inflation-Adjusted Value
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedAdjusted}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Original amount</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedOriginal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Reference</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.referenceLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Target</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.targetLabel}
          </dd>
        </div>
        {result.referenceCPI != null && result.targetCPI != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Reference CPI</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.referenceCPI}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Target CPI</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.targetCPI}
              </dd>
            </div>
          </>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cumulative inflation</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCumulative}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.dataMode === 'custom'
              ? 'Assumed annual rate'
              : 'Annualized inflation'}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAnnualized}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Monetary change</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMonetaryChange}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Purchasing power factor</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPurchasingPowerFactor}
          </dd>
        </div>
      </dl>

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.sourceSummary}
        </p>
      </div>

      <InflationChart chart={result.chart} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your inflation calculation works'
          : 'How your inflation calculation works'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
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
          href="/tools/gdp-deflator-formula-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Deflator
        </Link>
        .
      </p>
    </div>
  );
}
