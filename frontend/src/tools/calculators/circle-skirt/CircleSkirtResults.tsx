'use client';

import { useState } from 'react';
import { fmt, formatMeasurement } from './calculation';
import type { CircleSkirtResult, LengthUnit } from './types';
import { SKIRT_TYPE_LABELS } from './types';

interface CircleSkirtResultsProps {
  result: CircleSkirtResult | null;
  displayUnit: LengthUnit;
}

export function CircleSkirtResults({
  result,
  displayUnit,
}: CircleSkirtResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter waist and skirt length to calculate waist radius and cutting
        dimensions.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Waist radius (R)</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent">
            {formatMeasurement(result.waistRadiusCm, displayUnit)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">
            Radial cutting (L+R+A)
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent">
            {formatMeasurement(result.radialCuttingDimensionCm, displayUnit)}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Finished outer radius</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatMeasurement(result.finishedOuterRadiusCm, displayUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Hem circumference</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatMeasurement(result.hemCircumferenceCm, displayUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Circle fraction</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.circleFraction, 2)} (
            {SKIRT_TYPE_LABELS[result.skirtType]})
          </dd>
        </div>
      </dl>

      {result.fabricEstimate ? (
        <div className="rounded-lg border border-border bg-white p-3 text-xs">
          <p className="font-semibold text-accent">Fabric width check</p>
          {result.fabricEstimate.layoutSupported &&
          result.fabricEstimate.estimatedFabricLengthCm != null ? (
            <p className="mt-1 text-muted-foreground">
              Simplified length along bolt ≈{' '}
              {formatMeasurement(
                result.fabricEstimate.estimatedFabricLengthCm,
                displayUnit,
              )}{' '}
              (layout may still need panels).
            </p>
          ) : (
            <p className="mt-1 text-amber-900">
              {result.fabricEstimate.warning}
            </p>
          )}
        </div>
      ) : null}

      {result.warnings.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          {result.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((s) => !s)}
        aria-expanded={showSteps}
      >
        {showSteps ? 'Hide' : 'Show'} formulas
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
