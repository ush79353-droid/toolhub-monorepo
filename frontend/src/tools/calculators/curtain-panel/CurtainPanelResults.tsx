'use client';

import { useState } from 'react';
import { fmt, formatMeasurement } from './calculation';
import type { CurtainPanelResult, LengthUnit } from './types';

interface CurtainPanelResultsProps {
  result: CurtainPanelResult | null;
  displayUnit: LengthUnit;
}

export function CurtainPanelResults({
  result,
  displayUnit,
}: CurtainPanelResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter rod width, length, panels, and fabric width to calculate coverage,
        drops, and yardage.
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
          <p className="text-xs text-muted-foreground">Total coverage width</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
            {formatMeasurement(result.totalCoverageWidthCm, displayUnit)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Buy (¼ yd up)</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
            {fmt(result.recommendedPurchaseYards, 2)} yd
          </p>
          <p className="text-[11px] text-muted-foreground">
            {fmt(result.totalFabricMeters, 2)} m · {fmt(result.totalFabricYards, 2)} yd raw
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Finished / panel</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatMeasurement(result.finishedWidthPerPanelCm, displayUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Cut width / panel</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatMeasurement(result.cutWidthPerPanelCm, displayUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Cut length / drop</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatMeasurement(result.cutLengthPerDropCm, displayUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Drops / panel</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.fabricDropsPerPanel}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Total drops</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.totalFabricDrops}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Assembled width</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatMeasurement(result.assembledWidthCm, displayUnit)}
            {result.excessWidthCm > 0 ? (
              <span className="block text-[11px] font-normal text-muted-foreground">
                +{formatMeasurement(result.excessWidthCm, displayUnit)} surplus
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      {result.warnings.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-amber-900">
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
