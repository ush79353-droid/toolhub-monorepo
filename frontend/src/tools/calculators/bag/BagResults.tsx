'use client';

import { useState } from 'react';
import { convertMmToLength, fmt } from './calculation';
import type { BagResult, LengthUnit } from './types';

interface BagResultsProps {
  result: BagResult | null;
  displayUnit: LengthUnit;
}

export function BagResults({ result, displayUnit }: BagResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter finished bag height and width to estimate fabric cut size.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Bag fabric requirements
      </h3>
      <p className="text-xs text-muted-foreground">
        {result.constructionDescription}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Fabric width</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent">
            {result.fabricWidthDisplay}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Fabric height</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent">
            {result.fabricHeightDisplay}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white p-3">
        <p className="text-xs text-muted-foreground">Estimated fabric area</p>
        <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
          {result.fabricAreaDisplay}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Rectangular cutting area — not roll purchase length.
        </p>
      </div>

      {result.depthIgnored ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          Depth is entered but box corners are No — depth is not included in
          the fabric cut.
        </p>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Finished height</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(convertMmToLength(result.finishedHeightMm, displayUnit), 2)}{' '}
            {displayUnit}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Finished width</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(convertMmToLength(result.finishedWidthMm, displayUnit), 2)}{' '}
            {displayUnit}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Finished depth</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(convertMmToLength(result.finishedDepthMm, displayUnit), 2)}{' '}
            {displayUnit}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Side seam (each)</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(convertMmToLength(result.sideSeamAllowanceMm, displayUnit), 2)}{' '}
            {displayUnit}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Top hem (each)</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(convertMmToLength(result.topHemAllowanceMm, displayUnit), 2)}{' '}
            {displayUnit}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Construction</dt>
          <dd className="font-medium text-accent">
            {result.constructionType === 'boxed-corner-tote'
              ? 'Boxed-corner'
              : 'Flat tote'}
          </dd>
        </div>
      </dl>

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
