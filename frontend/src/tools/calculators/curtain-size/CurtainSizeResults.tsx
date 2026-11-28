'use client';

import { useState } from 'react';
import { fmt, formatMeasurement } from './calculation';
import { CURTAIN_TYPE_LABELS, type CurtainSizeResult, type LengthUnit } from './types';

interface CurtainSizeResultsProps {
  result: CurtainSizeResult | null;
  displayUnit: LengthUnit;
}

export function CurtainSizeResults({
  result,
  displayUnit,
}: CurtainSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter window height and width to calculate finished curtain length and
        flat width.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Curtain dimensions</h3>
      <p className="text-xs text-muted-foreground">
        {CURTAIN_TYPE_LABELS[result.curtainType]} · finished sizes (not cutting)
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Curtain length</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
            {formatMeasurement(result.recommendedCurtainLengthCm, displayUnit)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Total curtain width</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
            {formatMeasurement(result.totalCurtainWidthCm, displayUnit)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {fmt(result.fullnessMultiplier, 2)}× fullness
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Width per panel</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatMeasurement(result.curtainWidthPerPanelCm, displayUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Effective rod width</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatMeasurement(result.effectiveRodWidthCm, displayUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Panels</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.numberOfPanels}
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
