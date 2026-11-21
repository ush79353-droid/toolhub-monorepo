'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoneyMultiplierChart } from './MoneyMultiplierChart';
import type { MoneyMultiplierResult } from './types';

interface MoneyMultiplierResultsProps {
  result: MoneyMultiplierResult | null;
}

export function MoneyMultiplierResults({
  result,
}: MoneyMultiplierResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Money Multiplier</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedMultiplier}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Bank reserves</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedReserves}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Monetary base</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedBase}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Money supply</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedSupply}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Currency-to-deposit (c)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedC}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Reserve-to-deposit (r)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedR}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Simple deposit multiplier (1/r)
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedSimpleMd}
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
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          Also m = (1+c)/(r+c) under these definitions when deposits &gt; 0.
        </p>
      </div>

      <MoneyMultiplierChart result={result} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your money multiplier is calculated'
          : 'How your money multiplier is calculated'}
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
          href="/tools/gdp-growth-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Growth
        </Link>
        {' · '}
        <Link
          href="/tools/buying-power-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Buying Power
        </Link>
        .
      </p>
    </div>
  );
}
