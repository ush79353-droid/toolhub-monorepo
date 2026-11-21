'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DeadweightLossGraphView } from './DeadweightLossGraph';
import type { DeadweightLossResult } from './types';

interface DeadweightLossResultsProps {
  result: DeadweightLossResult | null;
}

export function DeadweightLossResults({ result }: DeadweightLossResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Estimated Deadweight Loss
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedDeadweightLoss}
      </p>
      <p className="text-xs text-muted-foreground">
        Mode: {result.mode} · Quantity in {result.quantityUnit}
      </p>

      <dl className="space-y-2 text-sm">
        {result.formattedPriceDifference ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              {result.mode === 'tax' ? 'Tax wedge' : 'Price / wedge difference'}
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedPriceDifference}
            </dd>
          </div>
        ) : null}
        {result.formattedQuantityDifference ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Quantity difference</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedQuantityDifference} {result.quantityUnit}
            </dd>
          </div>
        ) : null}
        {result.formattedTaxRevenue ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Tax revenue (not DWL)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTaxRevenue}
            </dd>
          </div>
        ) : null}
        {result.formattedEquilibriumQuantity ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Efficient quantity Qe</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedEquilibriumQuantity}
            </dd>
          </div>
        ) : null}
        {result.formattedEquilibriumPrice ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Equilibrium price Pe</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedEquilibriumPrice}
            </dd>
          </div>
        ) : null}
      </dl>

      <DeadweightLossGraphView graph={result.graph} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'How this result was calculated'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
          <p>{result.explanation}</p>
          <p className="text-muted-foreground">{result.assumptionNote}</p>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/consumer-surplus-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Consumer Surplus
        </Link>
        {' · '}
        <Link
          href="/tools/price-elasticity-of-demand-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Price Elasticity of Demand
        </Link>
        {' · '}
        <Link
          href="/tools/marginal-cost-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Marginal Cost
        </Link>
        {' · '}
        <Link
          href="/tools/cobb-douglas-production-function-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cobb-Douglas
        </Link>
        .
      </p>
    </div>
  );
}
