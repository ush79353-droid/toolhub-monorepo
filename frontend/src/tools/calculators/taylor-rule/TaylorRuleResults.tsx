'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TaylorRuleChart } from './TaylorRuleChart';
import type { TaylorRuleResult } from './types';

interface TaylorRuleResultsProps {
  result: TaylorRuleResult | null;
}

export function TaylorRuleResults({ result }: TaylorRuleResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Taylor Rule Recommended Rate
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedCustomRate}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Inflation gap</dt>
          <dd className="tabular-nums font-medium text-accent text-right">
            {result.formattedInflationGap}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Output gap</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedOutputGap}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Actual GDP</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedActualGdp}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Potential GDP</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPotentialGdp}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Neutral real rate r*</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNeutral}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Standard (a=b=0.5)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedStandardRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Custom − standard</dt>
          <dd className="tabular-nums font-medium text-accent text-right">
            {result.formattedDifference}
          </dd>
        </div>
        {result.approximateExAnteReal != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Approx. ex-ante real (i − πᵉ)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedExAnte}
            </dd>
          </div>
        ) : null}
        {result.flooredCustomRate != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Custom after floor</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedFloored}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        <span className="font-semibold text-accent">Policy interpretation: </span>
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <TaylorRuleChart result={result} />

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
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inflation
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
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect
        </Link>
        {' · '}
        <Link
          href="/tools/real-gdp-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Real GDP
        </Link>
        {' · '}
        <Link
          href="/tools/phillips-curve-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Phillips Curve
        </Link>
        .
      </p>
    </div>
  );
}
