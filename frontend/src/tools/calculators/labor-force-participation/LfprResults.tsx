'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LfprCompositionChart } from './LfprCompositionChart';
import type { LfprResult } from './types';

interface LfprResultsProps {
  result: LfprResult | null;
}

export function LfprResults({ result }: LfprResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Labor Force Participation Rate
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedLfpr}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Labor force</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedLaborForce}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Unemployment rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedUnemploymentRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Working-age population</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedWorkingAge}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Employed</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedEmployed}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Unemployed</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedUnemployed}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showDetails ? 'Hide detailed results' : 'Show detailed results'}
      </button>
      {showDetails ? (
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Not in labor force</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedNotInLaborForce}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Employment-to-population ratio
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedEpr}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Outside labor force share</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedOutsideShare}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Population definition</dt>
            <dd className="text-right text-xs font-medium text-accent">
              {result.workingAgeDefinitionLabel}
            </dd>
          </div>
        </dl>
      ) : null}

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      </div>

      <LfprCompositionChart result={result} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your LFPR is calculated'
          : 'How your labor force participation rate is calculated'}
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
          href="/tools/unemployment-calculator-unemployment-rate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Unemployment Rate
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
          href="/tools/productivity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Productivity
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
