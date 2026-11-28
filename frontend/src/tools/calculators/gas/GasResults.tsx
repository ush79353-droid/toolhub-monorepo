'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { KM_PER_MILE, fmt } from './calculation';
import type { GasResult } from './types';

interface GasResultsProps {
  result: GasResult | null;
}

export function GasResults({ result }: GasResultsProps) {
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
          total fuel cost
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
          <dt className="text-muted-foreground">Total distance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.totalDistanceKm)} km (
            {fmt(result.totalDistanceKm / KM_PER_MILE)} mi)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel required</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFuelRequired}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel required (liters)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.fuelRequiredLiters)} L
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Economy (canonical)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.economyL100)} L/100 km
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cost per person</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.costPerPerson != null
              ? `${money(result.costPerPerson)} (${result.passengers} pax)`
              : '—'}
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
        {result.maximumRangeKm != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Max driving range</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.maximumRangeKm)} km (
              {fmt(result.maximumRangeKm / KM_PER_MILE)} mi)
            </dd>
          </div>
        ) : null}
        {result.weeklyFuelCost != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Weekly fuel cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.weeklyFuelCost)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Monthly fuel cost (52/12 weeks)
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.monthlyFuelCost != null
                  ? money(result.monthlyFuelCost)
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Annual fuel cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.annualFuelCost != null
                  ? money(result.annualFuelCost)
                  : '—'}
              </dd>
            </div>
          </>
        ) : null}
        {result.comparisonFuelCost != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Comparison vehicle cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.comparisonFuelCost)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Savings vs comparison (positive = primary costs more)
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.estimatedSavings != null
                  ? money(result.estimatedSavings)
                  : '—'}
              </dd>
            </div>
          </>
        ) : null}
        {result.improvedFuelCost != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Improved economy</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.improvedEconomyL100 != null
                  ? `${fmt(result.improvedEconomyL100)} L/100 km`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Improved trip cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.improvedFuelCost)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Savings from improvement</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.improvementSavings != null
                  ? money(result.improvementSavings)
                  : '—'}
              </dd>
            </div>
          </>
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
