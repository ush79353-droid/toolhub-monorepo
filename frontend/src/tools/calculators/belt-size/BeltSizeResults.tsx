'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { BeltSizeResult } from './types';

interface BeltSizeResultsProps {
  result: BeltSizeResult | null;
}

export function BeltSizeResults({ result }: BeltSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Choose a measurement method and enter a value to see a recommended belt
        size.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Recommended belt size</h3>

      <div className="rounded-lg border border-border bg-white p-3">
        <p className="text-xs text-muted-foreground">Primary recommendation</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">
          {result.inchesDisplay ?? '—'}
          {result.cmDisplay ? (
            <span className="ml-2 text-base font-medium text-muted-foreground">
              ({result.cmDisplay})
            </span>
          ) : null}
        </p>
        {result.recommendedSizeRangeCm ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Chart range ≈ {fmt(result.recommendedSizeRangeCm.min / 2.54, 0)}–
            {fmt(result.recommendedSizeRangeCm.max / 2.54, 0)} in (
            {fmt(result.recommendedSizeRangeCm.min, 1)}–
            {fmt(result.recommendedSizeRangeCm.max, 1)} cm)
          </p>
        ) : null}
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        {result.recommendedGeneralSize ? (
          <div>
            <dt className="text-xs text-muted-foreground">General size</dt>
            <dd className="font-medium text-accent">
              {result.recommendedGeneralSize}
            </dd>
          </div>
        ) : null}
        {result.approximateWaistRangeCm ? (
          <div>
            <dt className="text-xs text-muted-foreground">Approx. waist band</dt>
            <dd className="font-medium tabular-nums text-accent">
              {fmt(result.approximateWaistRangeCm.min, 0)}–
              {fmt(result.approximateWaistRangeCm.max, 0)} cm
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs text-muted-foreground">Chart category</dt>
          <dd className="font-medium capitalize text-accent">
            {result.sizingCategory}
          </dd>
        </div>
      </dl>

      {result.outOfChart ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          Measurement is outside the illustrative chart span — treat the nearest
          size cautiously.
        </p>
      ) : null}

      <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
        {result.warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
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
