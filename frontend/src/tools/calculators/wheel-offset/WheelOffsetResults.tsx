'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import { WheelOffsetDiagram } from './WheelOffsetDiagram';
import type { WheelOffsetResult } from './types';

interface WheelOffsetResultsProps {
  result: WheelOffsetResult | null;
}

export function WheelOffsetResults({ result }: WheelOffsetResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter current and new wheel width and offset to compare clearance and
        position.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Wheel offset comparison results
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Clearance change</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent">
            {result.clearanceDisplay}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {result.clearanceInterpretation}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Position change</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent">
            {result.positionDisplay}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {result.positionInterpretation}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">Current width</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.currentWidthDisplay}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Current offset</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.currentOffsetDisplay}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">New width</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.newWidthDisplay}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">New offset</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.newOffsetDisplay}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Width difference</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.widthDifferenceMm >= 0 ? '+' : '−'}
            {fmt(Math.abs(result.widthDifferenceMm), 1)} mm
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Offset difference</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.offsetDifferenceMm >= 0 ? '+' : '−'}
            {fmt(Math.abs(result.offsetDifferenceMm), 1)} mm
          </dd>
        </div>
      </dl>

      <WheelOffsetDiagram result={result} />

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((s) => !s)}
        aria-expanded={showSteps}
      >
        {showSteps ? 'Hide' : 'Show'} calculation steps
      </button>
      {showSteps ? (
        <ul className="list-disc space-y-1 pl-5 font-mono text-xs text-accent">
          {result.formulaSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
