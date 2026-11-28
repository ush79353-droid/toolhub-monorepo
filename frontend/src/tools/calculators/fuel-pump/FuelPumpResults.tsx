'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { FuelPumpResult } from './types';

interface FuelPumpResultsProps {
  result: FuelPumpResult | null;
}

export function FuelPumpResults({ result }: FuelPumpResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedFlow}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          estimated fuel demand
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Engine power</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.horsepower)} hp
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">BSFC used</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.bsfcUsed, 3)} lb/(hp·hr)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Density used</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.densityUsed, 3)} kg/L
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel mass flow</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.fuelMassFlowLbPerHour)} lb/hr (
            {fmt(result.fuelMassFlowKgPerHour)} kg/hr)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Demand (L/hr)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.requiredFuelFlowLitersPerHour)} L/hr
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Target with margin</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.targetPumpFlowLitersPerHour)} L/hr
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel-rail pressure</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRailPressure}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Est. pump outlet pressure</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedOutletPressure}
          </dd>
        </div>
        {result.injectorDifferentialPressureBar != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Injector ΔP (fixed rail)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.injectorDifferentialPressureBar)} bar
            </dd>
          </div>
        ) : null}
        {result.manufacturerPumpFlowAtPressure != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Curve delivery @ outlet</dt>
            <dd
              className={`tabular-nums font-medium ${
                result.pumpCapacitySufficient === false
                  ? 'text-rose-600'
                  : 'text-accent'
              }`}
            >
              {fmt(result.manufacturerPumpFlowAtPressure)} L/hr
              {result.pumpCapacitySufficient === true
                ? ' (sufficient vs target)'
                : result.pumpCapacitySufficient === false
                  ? ' (below target)'
                  : ''}
            </dd>
          </div>
        ) : null}
      </dl>

      {result.pumpCurveWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {result.pumpCurveWarning}
        </p>
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
      {showSteps ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-accent">
          {result.formulaSteps.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}
