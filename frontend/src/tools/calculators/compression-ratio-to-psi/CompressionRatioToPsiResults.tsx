'use client';

import { useState } from 'react';
import { fromPsi, fmt } from './calculation';
import {
  MODEL_LABELS,
  type CompressionRatioToPsiResult,
  type PressureUnit,
} from './types';

interface CompressionRatioToPsiResultsProps {
  result: CompressionRatioToPsiResult | null;
}

function pressureLabel(unit: PressureUnit, absolute: boolean): string {
  if (unit === 'psi') return absolute ? 'psia' : 'psig';
  return absolute ? `${unit} abs` : `${unit} gauge`;
}

export function CompressionRatioToPsiResults({
  result,
}: CompressionRatioToPsiResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const unit = result.resultPressureUnit;
  const absDisplay = fromPsi(result.absolutePressurePsi, unit);
  const gaugeDisplay = fromPsi(result.gaugePressurePsi, unit);
  const atmDisplay = fromPsi(result.atmosphericPressurePsi, unit);
  const increaseDisplay = fromPsi(result.pressureIncreasePsi, unit);

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      {result.direction === 'pressureToRatio' ? (
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {fmt(result.normalizedCompressionRatio, 2)}:1
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            model-implied volume ratio
          </span>
        </p>
      ) : (
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {fmt(absDisplay)} {pressureLabel(unit, true)}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            absolute (estimate)
          </span>
        </p>
      )}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Compression ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.normalizedCompressionRatio, 2)}:1
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Model</dt>
          <dd className="text-right font-medium text-accent">
            {MODEL_LABELS[result.model]}
          </dd>
        </div>
        {result.polytropicExponent != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Polytropic exponent n</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.polytropicExponent, 3)}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Atmospheric pressure</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(atmDisplay)} {pressureLabel(unit, true)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Absolute compression pressure
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(absDisplay)} {pressureLabel(unit, true)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Gauge compression pressure</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(gaugeDisplay)} {pressureLabel(unit, false)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Pressure increase</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(increaseDisplay)} {unit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Pressure ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.pressureRatio, 4)}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        <strong className="text-accent">PSIA</strong> = pounds per square inch
        absolute · <strong className="text-accent">PSIG</strong> = gauge
        (relative to atmosphere). Never treat absolute estimates as gauge
        compression-tester readings.
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
    </div>
  );
}
