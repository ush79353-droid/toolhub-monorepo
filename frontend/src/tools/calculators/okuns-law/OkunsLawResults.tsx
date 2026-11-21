'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OkunsLawChart } from './OkunsLawChart';
import type { OkunsLawResult } from './types';

interface OkunsLawResultsProps {
  result: OkunsLawResult | null;
}

export function OkunsLawResults({ result }: OkunsLawResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        {result.modeLabel} results
      </h3>

      <dl className="space-y-2 text-sm">
        {result.unemploymentGap != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Unemployment gap</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedUnemploymentGap}
            </dd>
          </div>
        ) : null}
        {result.outputGap != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Estimated output gap</dt>
            <dd className="text-2xl font-semibold tabular-nums text-accent">
              {result.formattedOutputGap}
            </dd>
          </div>
        ) : null}
        {result.gdpGrowthGap != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">GDP growth gap</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedGrowthGap}
            </dd>
          </div>
        ) : null}
        {result.unemploymentChange != null &&
        result.mode !== 'output-gap' ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Δ Unemployment</dt>
            <dd className="text-2xl font-semibold tabular-nums text-accent">
              {result.formattedUnemploymentChange}
            </dd>
          </div>
        ) : null}
        {result.requiredGDPGrowth != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Required GDP growth</dt>
            <dd className="text-2xl font-semibold tabular-nums text-accent">
              {result.formattedRequiredGrowth}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      </div>

      <OkunsLawChart result={result} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your result is calculated'
          : 'How your result is calculated'}
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
          href="/tools/gdp-gap-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Gap
        </Link>
        {' · '}
        <Link
          href="/tools/gdp-growth-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Growth
        </Link>
        {' · '}
        <Link
          href="/tools/labor-force-participation-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          LFPR
        </Link>
        {' · '}
        <Link
          href="/tools/mpc-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          MPC
        </Link>
        {' · '}
        <Link
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inflation
        </Link>
        .
      </p>
    </div>
  );
}
