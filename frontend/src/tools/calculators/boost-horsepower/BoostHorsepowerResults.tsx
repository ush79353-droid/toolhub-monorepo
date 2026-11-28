'use client';

import { useState } from 'react';
import { BoostHorsepowerChart } from './BoostHorsepowerChart';
import type { BoostHorsepowerResult } from './types';

interface BoostHorsepowerResultsProps {
  result: BoostHorsepowerResult | null;
}

function fmt(n: number, d = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function BoostHorsepowerResults({ result }: BoostHorsepowerResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedPrimary}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          {result.primaryLabel.toLowerCase()}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Original horsepower</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.originalHorsepowerHp)} hp
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Added boost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.boostPressurePsi)} psi
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Atmospheric pressure</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.atmosphericPressurePsi)} psi
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Absolute intake pressure</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.absolutePressurePsi)} psi
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Pressure ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.pressureRatio, 4)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Ideal boosted horsepower</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.boostedHorsepowerHp)} hp
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Horsepower gained</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.horsepowerGainHp)} hp
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Ideal % increase</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.percentageIncrease)}%
          </dd>
        </div>
        {result.adjustedHorsepowerHp != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Efficiency-adjusted estimate (η=
              {fmt(result.efficiencyFactor ?? 0, 2)})
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.adjustedHorsepowerHp)} hp
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

      <BoostHorsepowerChart points={result.comparison} />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5 font-medium">Boost (psi)</th>
              <th className="px-2 py-1.5 font-medium">Est. HP</th>
            </tr>
          </thead>
          <tbody>
            {result.comparison.map((row) => (
              <tr key={row.boostPsi} className="border-t border-border">
                <td className="px-2 py-1.5 tabular-nums">{row.boostPsi}</td>
                <td className="px-2 py-1.5 tabular-nums">
                  {fmt(row.boostedHp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
