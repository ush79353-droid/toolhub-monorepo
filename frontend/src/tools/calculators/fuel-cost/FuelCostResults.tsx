'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { KM_PER_MILE, fmt } from './calculation';
import type { FuelCostResult } from './types';

interface FuelCostResultsProps {
  result: FuelCostResult | null;
}

export function FuelCostResults({ result }: FuelCostResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const money = (n: number) => formatCurrencyValue(n, result.currency);

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedFuelCost}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          fuel cost
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Trip type</dt>
          <dd className="font-medium text-accent">
            {result.isRoundTrip ? 'Round trip' : 'One-way'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total travel distance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.totalDistanceKm)} km (
            {fmt(result.totalDistanceKm / KM_PER_MILE)} mi)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel used during this trip</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFuelUsed}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel used (liters)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.fuelUsedLiters)} L
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Economy (canonical)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.economyL100)} L/100 km
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cost per kilometer</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.costPerKm != null ? money(result.costPerKm) : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cost per mile</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.costPerMile != null ? money(result.costPerMile) : '—'}
          </dd>
        </div>
        {result.costPerPassenger != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Cost per passenger</dt>
            <dd className="tabular-nums font-medium text-accent">
              {money(result.costPerPassenger)}
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
