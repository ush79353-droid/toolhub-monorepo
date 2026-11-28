'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { fmt, formatMiles } from './calculation';
import type { MilesToDollarsResult } from './types';

interface MilesToDollarsResultsProps {
  result: MilesToDollarsResult | null;
}

const money = (n: number) => formatCurrencyValue(n, 'USD');

export function MilesToDollarsResults({ result }: MilesToDollarsResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter an assumed miles value, award miles, fees, and cash fare to
        estimate redemption value.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {money(result.awardEquivalentCost)}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          estimated award-equivalent cost
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Airline</dt>
          <dd className="text-right font-medium text-accent">
            {result.airlineLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Assumed miles value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.valuePerMileCents)}¢/mi
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Estimated value of miles spent</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.estimatedMilesValue)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Additional cash fees</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.additionalFees)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Final price (award-equivalent)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.awardEquivalentCost)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cash ticket price</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.cashTicketPrice)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Price difference</dt>
          <dd className="tabular-nums font-medium text-accent">
            {money(result.priceDifference)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Savings percentage</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.savingsPercentage != null
              ? `${fmt(result.savingsPercentage)}%`
              : 'n/a'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Actual redemption value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.actualRedemptionCentsPerMile != null
              ? `${fmt(result.actualRedemptionCentsPerMile)}¢/mi`
              : 'n/a'}
          </dd>
        </div>
        {result.convertEstimatedValue != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Converted miles balance</dt>
            <dd className="tabular-nums font-medium text-accent">
              {money(result.convertEstimatedValue)}
            </dd>
          </div>
        ) : null}
        {result.milesForTarget != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Miles for target value</dt>
            <dd className="tabular-nums font-medium text-accent">
              {formatMiles(result.milesForTarget)}
            </dd>
          </div>
        ) : null}
      </dl>

      {result.optionB ? (
        <div className="rounded-lg border border-border bg-white p-3 text-sm">
          <p className="font-medium text-accent">Option B</p>
          <dl className="mt-2 space-y-1.5">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Award-equivalent</dt>
              <dd className="tabular-nums">
                {money(result.optionB.awardEquivalentCost)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Redemption</dt>
              <dd className="tabular-nums">
                {result.optionB.actualRedemptionCentsPerMile != null
                  ? `${fmt(result.optionB.actualRedemptionCentsPerMile)}¢/mi`
                  : 'n/a'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Cash savings vs award</dt>
              <dd className="tabular-nums">
                {money(result.optionB.priceDifference)}
              </dd>
            </div>
          </dl>
          {result.compareNote ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {result.compareNote}
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-accent">
        {result.recommendation}
      </p>

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
