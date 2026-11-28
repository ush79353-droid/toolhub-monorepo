'use client';

import { useState } from 'react';
import {
  convertNewtonsToKilonewtons,
  fmt,
} from './calculation';
import { WINCH_RATING_TIERS_LBF } from './types';
import type { WinchSizeResult } from './types';

interface WinchSizeResultsProps {
  result: WinchSizeResult | null;
}

export function WinchSizeResults({ result }: WinchSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter mass, resistance, slope, and safety factor to estimate winch
        pulling requirements.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Winch size results</h3>

      <div className="rounded-lg border border-border bg-white p-3">
        <p className="text-xs text-muted-foreground">
          Estimated force after safety factor
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">
          {result.adjustedDisplay}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Planning estimate only — not a certified recovery rating.
        </p>
      </div>

      {result.guidelineDisplay ? (
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">
            Weight-based nominal guideline (1.5× vehicle weight)
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
            {result.guidelineDisplay}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Separate recreational rule of thumb — different meaning from the
            resistance-based estimate above.
          </p>
        </div>
      ) : null}

      {result.tierDisplay ? (
        <div className="rounded-lg border border-dashed border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">
            Illustrative rating tier
          </p>
          <p className="mt-1 text-sm font-semibold text-accent">
            {result.tierDisplay}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Rounded up from the larger of resistance estimate and (when
            applicable) weight guideline. Not a model availability claim.
          </p>
        </div>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Mass</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.massKg, 1)} kg
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Slope</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.slopeDegrees, 2)}°
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Safety factor</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.safetyFactor, 2)}×
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            {result.resistanceLabel}
          </dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(convertNewtonsToKilonewtons(result.resistanceForceN), 2)} kN
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Slope resistance</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(convertNewtonsToKilonewtons(result.slopeForceN), 2)} kN
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Total resistance</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(convertNewtonsToKilonewtons(result.totalPullingForceN), 2)} kN
          </dd>
        </div>
      </dl>

      <div>
        <p className="mb-1.5 text-xs font-medium text-accent">
          Common nominal ratings (lb)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {WINCH_RATING_TIERS_LBF.map((tier) => {
            const active = result.recommendedTierLbf === tier;
            return (
              <span
                key={tier}
                className={`rounded-md border px-2 py-0.5 text-xs tabular-nums ${
                  active
                    ? 'border-primary bg-primary/10 font-semibold text-primary'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {tier.toLocaleString('en-US')}
              </span>
            );
          })}
        </div>
      </div>

      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
        Winch ratings are often first-layer drum values. Available pull can drop
        with rope layers. Rope, hooks, mounts, fairlead, electrics, duty cycle,
        and rigging all limit the system — never exceed any component rating.
      </p>

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
