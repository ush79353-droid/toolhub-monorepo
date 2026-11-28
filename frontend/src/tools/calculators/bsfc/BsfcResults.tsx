'use client';

import { useState } from 'react';
import { BsfcChart } from './BsfcChart';
import { FUEL_TYPE_LABELS, type BSFCResult } from './types';

interface BsfcResultsProps {
  result: BSFCResult | null;
}

function fmt(n: number, d = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function BsfcResults({ result }: BsfcResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedPrimary}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          {result.primaryLabel.toLowerCase()}
        </span>
      </p>

      {result.efficiencyWarning ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {result.efficiencyWarning}
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        {result.powerKW != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Engine brake power</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.powerKW)} kW
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">BSFC</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.bsfcGPerKWh)} g/(kW·h)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel</dt>
          <dd className="font-medium text-accent">
            {FUEL_TYPE_LABELS[result.fuelType]}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Lower heating value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.fuelLHV_MJPerKg)} MJ/kg
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Brake thermal efficiency</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.brakeThermalEfficiencyPercent)}%
          </dd>
        </div>
        {result.fuelConsumptionKgPerHour != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Fuel consumption</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.fuelConsumptionKgPerHour)} kg/h
            </dd>
          </div>
        ) : null}
        {result.fuelEnergyInputMJPerHour != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Fuel energy input</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.fuelEnergyInputMJPerHour)} MJ/h
            </dd>
          </div>
        ) : null}
        {result.usefulEnergyOutputMJPerHour != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Useful energy output</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.usefulEnergyOutputMJPerHour)} MJ/h
            </dd>
          </div>
        ) : null}
        {result.volumetricConsumptionLPerHour != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Volumetric consumption</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.volumetricConsumptionLPerHour)} L/h
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

      <BsfcChart
        efficiencyPoints={result.efficiencyChart}
        fuelPoints={result.fuelChart}
      />
    </div>
  );
}
