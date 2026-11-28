'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { RpmInput, RpmResult } from './types';

interface RpmResultsProps {
  result: RpmResult | null;
  input: RpmInput;
}

export function RpmResults({ result, input }: RpmResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter related RPM, ratio, tire, or speed values to calculate missing
        fields.
      </div>
    );
  }

  if (result.inconsistent) {
    return (
      <div
        className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800"
        role="alert"
      >
        {result.interpretation}
      </div>
    );
  }

  if (result.insufficient) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        {result.interpretation}
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      {result.vehicleSpeedFormatted ? (
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.vehicleSpeedFormatted}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            speed
          </span>
        </p>
      ) : result.engineRPMDisplay ? (
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.engineRPMDisplay}
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Engine RPM</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.engineRPMDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Drivetrain ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.drivetrainRatioDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Wheel RPM</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.wheelRPMDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tire diameter</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.tireDiameterFormatted ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Vehicle speed</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.vehicleSpeedFormatted ?? '—'}
          </dd>
        </div>
      </dl>

      {input.showExtras ? (
        <dl className="space-y-2 border-t border-border pt-3 text-sm">
          {result.circumferenceIn != null ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Circumference</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.circumferenceIn, 2)} in
                {result.circumferenceM != null
                  ? ` · ${fmt(result.circumferenceM, 4)} m`
                  : ''}
              </dd>
            </div>
          ) : null}
          {result.engineRps != null ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Engine RPS</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.engineRps, 2)} rev/s
              </dd>
            </div>
          ) : null}
          {result.wheelRotationsPerMile != null ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Revolutions per mile</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.wheelRotationsPerMile, 1)} rev/mi
              </dd>
            </div>
          ) : null}
        </dl>
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
