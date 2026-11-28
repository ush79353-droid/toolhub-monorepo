'use client';

import { useState } from 'react';
import type { SpeedometerGearResult } from './types';

interface SpeedometerGearResultsProps {
  result: SpeedometerGearResult | null;
}

export function SpeedometerGearResults({
  result,
}: SpeedometerGearResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter tire diameter (or manual revolutions), axle ratio, and driving
        gear teeth to calculate the driven gear.
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
        {result.recommendedTeethDisplay}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          suggested driven gear
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tire revolutions</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.tireRevolutionsPerMileDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Speedometer gear ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.gearRatioDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Theoretical driven teeth</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.theoreticalTeethDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Suggested driven gear</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.recommendedTeethDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tooth-count deviation</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.deviationDisplay}
          </dd>
        </div>
      </dl>

      <p className="rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-muted-foreground">
        The suggested number of teeth is rounded to the nearest whole number.
        Confirm that this gear is available and mechanically compatible with
        your transmission and speedometer drive. Tooth-count deviation is not
        the same as speedometer reading error.
      </p>

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
