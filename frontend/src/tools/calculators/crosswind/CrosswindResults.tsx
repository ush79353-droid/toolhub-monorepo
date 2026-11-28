'use client';

import { useState } from 'react';
import { CrosswindChart } from './CrosswindChart';
import { CrosswindDiagram } from './CrosswindDiagram';
import { fmt, fromKnots } from './calculation';
import type { CrosswindResult } from './types';

interface CrosswindResultsProps {
  result: CrosswindResult | null;
}

export function CrosswindResults({ result }: CrosswindResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const unit = result.displayUnit;
  const x = fromKnots(result.crosswindMagnitudeKnots, unit);
  const hw = fromKnots(result.headwindMagnitudeKnots, unit);
  const tw = fromKnots(result.tailwindMagnitudeKnots, unit);
  const v = fromKnots(result.windSpeedKnots, unit);
  const dir =
    result.crosswindDirection === 'right'
      ? 'from the right'
      : result.crosswindDirection === 'left'
        ? 'from the left'
        : 'none';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      <p className="text-2xl font-semibold tabular-nums text-accent">
        {fmt(x)} {unit}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          crosswind {dir}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Runway</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.runwayNumber}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Runway heading</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.runwayHeadingDegrees === 0
              ? '360° / 0°'
              : `${fmt(result.runwayHeadingDegrees, 0)}°`}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Wind direction (magnetic)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.windDirectionMagneticDegrees, 1)}°
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Wind speed</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(v)} {unit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Relative wind angle θ</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.relativeWindAngleDegrees, 1)}°
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Crosswind (signed)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(fromKnots(result.signedCrosswindKnots, unit))} {unit} ({dir})
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Headwind</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(hw)} {unit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tailwind</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(tw)} {unit}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-950">
        <strong>Aviation Safety Notice:</strong> Educational and planning
        reference only. Use official weather, approved aircraft documentation,
        procedures, and qualified judgment for flight decisions. This tool does
        not state aircraft crosswind limits.
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

      <CrosswindDiagram result={result} />
      <CrosswindChart result={result} />
    </div>
  );
}
