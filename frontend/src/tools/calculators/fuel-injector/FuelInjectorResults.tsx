'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { FuelInjectorResult } from './types';

interface FuelInjectorResultsProps {
  result: FuelInjectorResult | null;
}

export function FuelInjectorResults({ result }: FuelInjectorResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.requiredFlowDisplay}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          required per injector
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Horsepower used</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.horsepowerUsed)} hp (
            {result.horsepowerSource === 'target' ? 'target' : 'engine'})
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">BSFC used</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.bsfcUsed, 3)} lb/(hp·hr)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Injector count</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.injectorCount}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Max duty cycle</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.dutyCycleDecimal * 100, 2)}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total fuel mass flow</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.totalFuelMassFlowLbPerHour)} lb/hr
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Required (lb/hr)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.requiredFlowLbPerHour)} lb/hr
          </dd>
        </div>
        {result.requiredFlowCcPerMinute != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Approx. cc/min (@ {fmt(result.densityUsed, 3)} g/mL)
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.requiredFlowCcPerMinute)} cc/min
            </dd>
          </div>
        ) : null}
        {result.pressureAdjustedFlowLbPerHour != null &&
        Math.abs(
          result.pressureAdjustedFlowLbPerHour - result.requiredFlowLbPerHour,
        ) > 1e-9 ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Pressure-adjusted flow</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.pressureAdjustedFlowLbPerHour)} lb/hr
            </dd>
          </div>
        ) : null}
        {result.existingInjectorRequiredDutyCyclePercent != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Existing injector required DC
            </dt>
            <dd
              className={`tabular-nums font-medium ${
                result.existingExceedsMax ? 'text-rose-600' : 'text-accent'
              }`}
            >
              {fmt(result.existingInjectorRequiredDutyCyclePercent, 2)}%
              {result.existingExceedsMax ? ' (above max)' : ''}
            </dd>
          </div>
        ) : null}
      </dl>

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
      {showSteps ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-accent">
          {result.formulaSteps.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}
