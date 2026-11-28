'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import { TireSizeCompareChart } from './TireSizeCompareChart';
import { CONSTRUCTION_LABELS, type TireSizeResult } from './types';

interface TireSizeResultsProps {
  result: TireSizeResult | null;
}

const BAND_COPY = {
  small: 'Small diameter difference (within about 1%).',
  moderate: 'Moderate diameter difference (about 1–3%).',
  significant: 'Significant diameter difference (above about 3%).',
} as const;

export function TireSizeResults({ result }: TireSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter width, profile ratio, and rim diameter to calculate tire
        dimensions.
      </div>
    );
  }

  const t = result.primary;
  const c = result.comparison;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      <p className="font-mono text-2xl font-semibold tabular-nums text-accent">
        {t.tireCode}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Section width</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(t.widthMm, 1)} mm
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Aspect ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(t.aspectRatio, 1)}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Construction</dt>
          <dd className="font-medium text-accent">
            {CONSTRUCTION_LABELS[t.construction]}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Sidewall height</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(t.sidewallHeightMm, 2)} mm
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Rim diameter</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(t.rimDiameterIn, 2)} in ({fmt(t.rimDiameterMm, 1)} mm)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Overall diameter</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(t.overallDiameterMm, 1)} mm ({fmt(t.overallDiameterIn, 2)} in)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Circumference</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(t.circumferenceMm, 1)} mm ({fmt(t.circumferenceIn, 2)} in)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Revolutions per km</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(t.revolutionsPerKm, 1)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Revolutions per mile</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(t.revolutionsPerMile, 1)}
          </dd>
        </div>
      </dl>

      {c ? (
        <div className="space-y-3 border-t border-border pt-3">
          <TireSizeCompareChart comparison={c} />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">New tire</dt>
              <dd className="font-mono font-medium text-accent">
                {c.replacement.tireCode}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Diameter difference</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(c.diameterDifferenceMm, 2)} mm (
                {fmt(c.diameterDifferencePercent, 2)}%)
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Sidewall difference</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(c.sidewallDifferenceMm, 2)} mm
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Width difference</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(c.widthDifferenceMm, 2)} mm
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Circumference difference</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(c.circumferenceDifferenceMm, 2)} mm
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Theoretical clearance change
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(c.groundClearanceDifferenceMm, 2)} mm
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Indicated speed</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(c.indicatedSpeed, 1)} {c.indicatedSpeedUnit}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Estimated actual speed</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(c.estimatedActualSpeed, 2)} {c.indicatedSpeedUnit}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Speed difference</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(c.speedDifference, 2)} {c.indicatedSpeedUnit} (
                {fmt(c.speedErrorPercent, 2)}%)
              </dd>
            </div>
          </dl>

          <p className="rounded-lg border border-border bg-white px-3 py-2 text-xs text-accent">
            {BAND_COPY[c.diameterBand]} Informational only — not a manufacturer
            safety limit.
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Similar overall diameter does not guarantee tire compatibility.
            Always verify tire load rating, speed rating, rim width
            compatibility, clearance, and vehicle manufacturer recommendations
            before changing tire sizes.
          </p>
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
      {showSteps && result.formulaSteps.length ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-accent">
          {result.formulaSteps.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}
