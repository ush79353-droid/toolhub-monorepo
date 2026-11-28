'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { TurboSizeResult } from './types';

interface TurboSizeResultsProps {
  result: TurboSizeResult | null;
}

export function TurboSizeResults({ result }: TurboSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter engine capacity and desired power to estimate required turbocharger
        airflow.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Turbocharger sizing results
      </h3>

      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.requiredAirflowDisplay}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          estimated airflow
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Engine capacity</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.engineCapacityLiters, 3)} L
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Desired power</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.desiredHorsepower, 2)} hp
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Required airflow</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.requiredAirflowLbMin, 2)} lb/min (
            {fmt(result.requiredAirflowKgMin, 2)} kg/min)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Power density</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.powerDensityDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Heuristic C</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.horsepowerPerLbMin, 2)} hp/(lb/min)
          </dd>
        </div>
      </dl>

      {result.actualAirflowKgPerS != null ? (
        <dl className="space-y-2 border-t border-border pt-3 text-sm">
          <p className="text-xs font-semibold text-accent">Advanced estimate</p>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Volumetric airflow</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.volumetricAirflowM3PerS!, 4)} m³/s
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Actual mass airflow</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.actualAirflowKgPerS, 4)} kg/s (
              {fmt(result.actualAirflowLbMin!, 2)} lb/min)
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Pressure ratio</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.compressorPressureRatio!, 3)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Corrected airflow</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.correctedAirflowLbMin!, 2)} lb/min
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Heuristic HP from advanced ṁ
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.estimatedHpFromAdvancedAirflow!, 1)} hp
            </dd>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Advanced mass-flow and simplified HP/10 estimates are independent —
            compare assumptions rather than treating them as identical.
          </p>
        </dl>
      ) : null}

      <div className="rounded-lg border border-border bg-white px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
        Selection tip: place the operating point on a manufacturer compressor
        map (corrected airflow vs pressure ratio), check surge/choke and
        efficiency, then size the turbine and fueling. Similar diameter or hp/L
        alone does not guarantee fitment.
      </div>

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
