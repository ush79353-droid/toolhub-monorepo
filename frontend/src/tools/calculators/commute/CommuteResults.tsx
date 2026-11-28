'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { CommuteChart } from './CommuteChart';
import type { CommuteResult } from './types';

interface CommuteResultsProps {
  result: CommuteResult | null;
}

function fmt(n: number, d = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function CommuteResults({ result }: CommuteResultsProps) {
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
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.comparisonNote}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">One-way distance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.oneWayKm)} km
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Round-trip distance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.roundTripKm)} km
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Monthly commute distance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.monthlyDistanceKm)} km
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Yearly commute distance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.yearlyDistanceKm)} km
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Commute days / month</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.commuteDaysPerMonth, 2)}
          </dd>
        </div>

        {result.monthlyFuelUsedLiters != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Fuel used / month</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.monthlyFuelUsedLiters)} L
            </dd>
          </div>
        ) : null}
        {result.monthlyFuelCost != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Fuel expense / month</dt>
            <dd className="tabular-nums font-medium text-accent">
              {money(result.monthlyFuelCost)}
            </dd>
          </div>
        ) : null}
        {result.monthlyTotalCarCost != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Parking &amp; tolls / month</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.monthlyParkingAndTolls)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Wear &amp; tear / month</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.monthlyWearAndTear)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Total car cost / month</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.monthlyTotalCarCost)}
              </dd>
            </div>
          </>
        ) : null}
        {result.monthlyCarCostPerPerson != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Car cost per person / month</dt>
            <dd className="tabular-nums font-medium text-accent">
              {money(result.monthlyCarCostPerPerson)}
            </dd>
          </div>
        ) : null}
        {result.monthlyPublicTransportCost != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Public transport / month
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.monthlyPublicTransportCost)}
              </dd>
            </div>
            {result.passesRequiredMonthly != null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">
                  Tickets / passes (monthly est.)
                </dt>
                <dd className="tabular-nums font-medium text-accent">
                  {fmt(result.passesRequiredMonthly, 0)}
                </dd>
              </div>
            ) : null}
          </>
        ) : null}
        {result.monthlySavings != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Monthly savings</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.monthlySavings)}
              </dd>
            </div>
            {result.annualSavings != null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Annual savings</dt>
                <dd className="tabular-nums font-medium text-accent">
                  {money(result.annualSavings)}
                </dd>
              </div>
            ) : null}
            {result.savingsPercentage != null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">
                  Savings % (vs car share)
                </dt>
                <dd className="tabular-nums font-medium text-accent">
                  {fmt(result.savingsPercentage)}%
                </dd>
              </div>
            ) : null}
          </>
        ) : null}
      </dl>

      {result.carPerPersonPeriod && result.transitPeriod ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-2 py-1.5 font-medium">Period</th>
                <th className="px-2 py-1.5 font-medium">Car / person</th>
                <th className="px-2 py-1.5 font-medium">Transit</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Daily', 'daily'],
                  ['Weekly', 'weekly'],
                  ['Monthly', 'monthly'],
                  ['Yearly', 'yearly'],
                ] as const
              ).map(([label, key]) => (
                <tr key={key} className="border-t border-border">
                  <td className="px-2 py-1.5">{label}</td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {money(result.carPerPersonPeriod![key])}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {money(result.transitPeriod![key])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      {showSteps ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-accent">
          {result.formulaSteps.join('\n')}
        </pre>
      ) : null}

      <CommuteChart
        carMonthly={result.monthlyCarCostPerPerson}
        transitMonthly={result.monthlyPublicTransportCost}
        carYearly={result.carPerPersonPeriod?.yearly ?? null}
        transitYearly={result.transitPeriod?.yearly ?? null}
        breakdown={result.carBreakdown}
        occupancy={result.occupancyChart}
        currency={result.currency}
      />
    </div>
  );
}
