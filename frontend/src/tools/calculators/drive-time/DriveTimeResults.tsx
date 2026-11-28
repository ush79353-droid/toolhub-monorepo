'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { fmt } from './calculation';
import type { DriveTimeResult } from './types';

interface DriveTimeResultsProps {
  result: DriveTimeResult | null;
}

export function DriveTimeResults({ result }: DriveTimeResultsProps) {
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
        {result.totalTripLabel}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          total trip
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Driving time</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.drivingTimeLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Breaks</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.breakTimeLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Departure</dt>
          <dd className="text-right font-medium text-accent">
            {result.departureLabel ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Arrival</dt>
          <dd className="text-right font-medium text-accent">
            {result.arrivalLabel ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel used</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.fuelUsedLiters)} L
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel cost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.fuelCost)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Additional expenses</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.additionalExpenses)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total drive cost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.totalTripCost)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cost per person</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.costPerPerson)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cost per km</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.costPerKm != null ? `${money(result.costPerKm)}/km` : '—'}
          </dd>
        </div>
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
