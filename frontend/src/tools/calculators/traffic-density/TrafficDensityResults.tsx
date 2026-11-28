'use client';

import { useState } from 'react';
import { TrafficDensityDiagram } from './TrafficDensityDiagram';
import type { TrafficDensityResult } from './types';

interface TrafficDensityResultsProps {
  result: TrafficDensityResult | null;
}

export function TrafficDensityResults({
  result,
}: TrafficDensityResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter vehicle counts, observation time, and road length — or use direct
        mode with two known stream parameters.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      {result.speedDisplay ? (
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.speedDisplay}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            average stream speed
          </span>
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Traffic flow</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.flowDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Traffic density</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.densityDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average speed</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.speedDisplay ?? '—'}
          </dd>
        </div>
        {result.speedNote ? (
          <p className="text-xs text-rose-600">{result.speedNote}</p>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Time headway</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.headwayDisplay ?? '—'}
          </dd>
        </div>
        {result.headwayNote ? (
          <p className="text-xs text-muted-foreground">{result.headwayNote}</p>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average spacing</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.spacingDisplay ?? '—'}
          </dd>
        </div>
      </dl>

      <TrafficDensityDiagram result={result} />

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
      {showSteps && result.formulaSteps.length ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-accent">
          {result.formulaSteps.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}
