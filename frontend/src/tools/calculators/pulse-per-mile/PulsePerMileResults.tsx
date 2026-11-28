'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { PulsePerMileInput, PulsePerMileResult } from './types';

interface PulsePerMileResultsProps {
  result: PulsePerMileResult | null;
  input: PulsePerMileInput;
}

export function PulsePerMileResults({
  result,
  input,
}: PulsePerMileResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter axle ratio, reluctor tooth count, and tire diameter to calculate
        wheel rotations and pulses per mile.
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
        {result.ppmDisplay}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          PPM
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Wheel rotations per mile</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.wrmDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Pulses per mile (PPM)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.pulsesPerMile, 1)} pulses/mi
          </dd>
        </div>
      </dl>

      {input.showCircumference ? (
        <dl className="space-y-2 border-t border-border pt-3 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Circumference</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.circumferenceInDisplay}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Circumference (cm)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.circumferenceCmDisplay}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Circumference (mm)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.circumferenceMmDisplay}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Revolutions per mile</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.wrmDisplay}
            </dd>
          </div>
        </dl>
      ) : null}

      {result.frequencyDisplay ? (
        <div className="border-t border-border pt-3 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Sensor frequency</span>
            <span className="tabular-nums font-medium text-accent">
              {result.frequencyDisplay}
            </span>
          </div>
        </div>
      ) : null}

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
