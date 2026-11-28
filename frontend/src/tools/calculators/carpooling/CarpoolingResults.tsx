'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { CarpoolingChart } from './CarpoolingChart';
import type { CarpoolingResult } from './types';

interface CarpoolingResultsProps {
  result: CarpoolingResult | null;
}

function fmt(n: number, d = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function CarpoolingResults({ result }: CarpoolingResultsProps) {
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
        {result.formattedPrimary}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          {result.primaryLabel.toLowerCase()}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total trip distance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.totalDistanceKm)} km
          </dd>
        </div>
        {result.oneWayDistanceKm !== result.totalDistanceKm ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">One-way distance</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.oneWayDistanceKm)} km
            </dd>
          </div>
        ) : null}
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
          <dt className="text-muted-foreground">Total trip cost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.totalTripCost)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Travelers</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.numberOfPeople}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Passenger contribution</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.passengerContribution)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Driver pays</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.driverPays)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Driver reimbursement from passengers
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.driverReimbursement)}
          </dd>
        </div>
        {result.totalSavings != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Carpool savings (scenario)
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.totalSavings)}
              </dd>
            </div>
            {result.savingsPercentage != null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Savings %</dt>
                <dd className="tabular-nums font-medium text-accent">
                  {fmt(result.savingsPercentage)}%
                </dd>
              </div>
            ) : null}
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

      <CarpoolingChart
        occupancy={result.occupancyChart}
        expenses={result.expenseBreakdown}
        sharedCost={result.sharedTravelCost}
        separateCost={result.separateTravelCost}
        currency={result.currency}
      />
    </div>
  );
}
