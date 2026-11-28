'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { fmt } from './calculation';
import { TeslaChargingCostChart } from './TeslaChargingCostChart';
import type { TeslaChargingResult } from './types';

interface TeslaChargingCostResultsProps {
  result: TeslaChargingResult | null;
}

export function TeslaChargingCostResults({
  result,
}: TeslaChargingCostResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter battery capacity and electricity price to estimate charging cost,
        plus distance and efficiency for driving cost.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      {result.fullChargeCostDisplay ? (
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.fullChargeCostDisplay}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            full charge (ideal)
          </span>
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Full battery charging cost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.fullChargeCostDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Driving energy</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.drivingEnergyDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Driving electricity cost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.drivingCostDisplay ?? '—'}
          </dd>
        </div>
        {result.partialChargingCostDisplay ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Battery energy added</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.batteryEnergyAddedKWh != null
                  ? `${fmt(result.batteryEnergyAddedKWh, 2)} kWh`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Grid energy required</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.gridEnergyRequiredKWh != null
                  ? `${fmt(result.gridEnergyRequiredKWh, 2)} kWh`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Partial charging cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.partialChargingCostDisplay}
              </dd>
            </div>
          </>
        ) : null}
        {result.costPer100Km != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Cost per 100 km</dt>
            <dd className="tabular-nums font-medium text-accent">
              {formatCurrencyValue(result.costPer100Km, result.currency)}
            </dd>
          </div>
        ) : null}
      </dl>

      {result.chartPoints.length >= 2 ? (
        <div className="border-t border-border pt-3">
          <TeslaChargingCostChart result={result} />
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
