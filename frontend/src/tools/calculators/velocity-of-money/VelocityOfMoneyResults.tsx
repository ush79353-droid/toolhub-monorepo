'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VelocityOfMoneyChart } from './VelocityOfMoneyChart';
import type { VelocityOfMoneyResult } from './types';

interface VelocityOfMoneyResultsProps {
  result: VelocityOfMoneyResult | null;
}

export function VelocityOfMoneyResults({ result }: VelocityOfMoneyResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Velocity of Money</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedVelocity}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Method</dt>
          <dd className="font-medium text-accent text-right">
            {result.mode === 'gdp' ? 'GDP-based' : 'Transaction-based'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Nominal flow</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNumerator}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Money stock ({result.moneyAggregate})</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMoneySupply}
          </dd>
        </div>
        {result.formattedNominalGdp ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Nominal GDP</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedNominalGdp}
            </dd>
          </div>
        ) : null}
        {result.formattedNominalTxn ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Nominal transactions</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedNominalTxn}
            </dd>
          </div>
        ) : null}
        {result.priceIndex != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Price index (P)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.priceIndex}
            </dd>
          </div>
        ) : null}
        {result.volume != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Volume (N)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.volume}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Period unit</dt>
          <dd className="font-medium text-accent">{result.periodUnit}</dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        <span className="font-semibold text-accent">Interpretation: </span>
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <VelocityOfMoneyChart result={result} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <pre className="whitespace-pre-wrap font-mono text-[11px]">
            {result.formulaBreakdown}
          </pre>
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
          href="/tools/money-supply-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Money Supply
        </Link>
        {' · '}
        <Link
          href="/tools/money-multiplier-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Money Multiplier
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
          href="/tools/real-gdp-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Real GDP
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
          href="/tools/reserve-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Reserve Ratio
        </Link>
        .
      </p>
    </div>
  );
}
