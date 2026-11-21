'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GiniLorenzChart } from './GiniLorenzChart';
import type { GiniResult } from './types';

interface GiniResultsProps {
  result: GiniResult | null;
}

export function GiniResults({ result }: GiniResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Gini Coefficient</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedGini}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Gini Index</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedIndex}
          </dd>
        </div>
        {result.areaA != null && result.areaB != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Area A</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.areaA} unit²
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Area B</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.areaB} unit²
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Combined area</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.combinedArea} unit²
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Area A share</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.areaAShare?.toFixed(2)}%
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Area B share</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.areaBShare?.toFixed(2)}%
              </dd>
            </div>
          </>
        ) : null}
        {result.observationCount != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Observations</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.observationCount}
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

      <GiniLorenzChart lorenz={result.lorenz} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your Gini was calculated'
          : 'How your Gini coefficient was calculated'}
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
          href="/tools/gdp-per-capita-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP per Capita
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
          href="/tools/gdp-gap-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Gap
        </Link>
        {' · '}
        <Link
          href="/tools/discretionary-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discretionary Income
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
          href="/tools/comparative-advantage-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Comparative Advantage
        </Link>
        .
      </p>
    </div>
  );
}
