'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { GasOilResult } from './types';
import { MODE_LABELS } from './types';

interface GasOilRatioResultsProps {
  result: GasOilResult | null;
}

export function GasOilRatioResults({ result }: GasOilRatioResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter the required values for the selected mode to see mixing results.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.mode === 'calculateRatio'
          ? result.formattedRatio
          : result.mode === 'calculateGas'
            ? result.formattedGas
            : result.formattedOil}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          {result.mode === 'calculateRatio'
            ? 'gas-to-oil ratio'
            : result.mode === 'calculateGas'
              ? 'gasoline required'
              : 'oil required'}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Mode</dt>
          <dd className="font-medium text-accent">{MODE_LABELS[result.mode]}</dd>
        </div>
        {result.formattedRatio ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Gas-to-oil ratio</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedRatio}
            </dd>
          </div>
        ) : null}
        {result.formattedGas ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Gasoline</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedGas}
            </dd>
          </div>
        ) : null}
        {result.formattedOil ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Oil</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedOil}
            </dd>
          </div>
        ) : null}
        {result.formattedTotal ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total mixture (nominal)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTotal}
            </dd>
          </div>
        ) : null}
        {result.oilPercentageOfMixture != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Oil % of mixture</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.oilPercentageOfMixture, 4)}%
            </dd>
          </div>
        ) : null}
        {result.oilPercentageOfGasoline != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Oil % of gasoline</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.oilPercentageOfGasoline, 4)}%
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((v) => !v)}
      >
        {showSteps ? 'Hide' : 'Show'} formula breakdown
      </button>
      {showSteps ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-accent">
          {result.formulaSteps.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}
