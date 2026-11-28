'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { fmt } from './calculation';
import type { MilesPerYearResult } from './types';

interface MilesPerYearResultsProps {
  result: MilesPerYearResult | null;
}

export function MilesPerYearResults({ result }: MilesPerYearResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter a period distance (or commute schedule) to estimate annual
        mileage.
      </div>
    );
  }

  const money = (n: number) =>
    result.currency
      ? formatCurrencyValue(n, result.currency)
      : String(n);

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedAnnual}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          estimated annual mileage
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Miles per year</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.annualMiles)} mi
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Kilometers per year</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.annualKilometers)} km
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Avg per day</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.avgPerDayMiles)} mi
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Avg per week</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.avgPerWeekMiles)} mi
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Avg per month</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.avgPerMonthMiles)} mi
          </dd>
        </div>
        {result.annualFuelCost != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Annual fuel used</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.annualFuelUsGallons != null
                  ? `${fmt(result.annualFuelUsGallons)} US gal`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Annual fuel cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.annualFuelCost)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Monthly fuel cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.monthlyFuelCost != null
                  ? money(result.monthlyFuelCost)
                  : '—'}
              </dd>
            </div>
          </>
        ) : null}
        {result.formattedProjected ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Projected odometer</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedProjected}
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
