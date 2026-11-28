'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import { METHOD_LABELS, type HorsepowerResult } from './types';

interface HorsepowerResultsProps {
  result: HorsepowerResult | null;
}

export function HorsepowerResults({ result }: HorsepowerResultsProps) {
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
          estimated ({METHOD_LABELS[result.method].toLowerCase()})
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Vehicle weight</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.vehicleWeightLb)} lb
          </dd>
        </div>
        {result.quarterMileTimeSeconds != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Quarter-mile ET</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.quarterMileTimeSeconds, 3)} s
            </dd>
          </div>
        ) : null}
        {result.trapSpeedMph != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Trap speed</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.trapSpeedMph)} mph
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Mechanical horsepower</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.estimatedHorsepowerHp)} hp
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Metric horsepower</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.metricHorsepowerPs)} PS
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Watts</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.watts, 2)} W
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Kilowatts</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.kilowatts)} kW
          </dd>
        </div>
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
