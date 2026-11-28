'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { fmt } from './calculation';
import { DISTANCE_UNIT_LABELS, VOLUME_UNIT_LABELS } from './types';
import type { MpgResult } from './types';

interface MpgResultsProps {
  result: MpgResult | null;
}

export function MpgResults({ result }: MpgResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter distance and fuel used (or the other two fields) to calculate
        fuel economy.
      </div>
    );
  }

  const money = (n: number) =>
    result.currency
      ? formatCurrencyValue(n, result.currency)
      : String(n);

  const primary =
    result.calculationMode === 'fuel-economy'
      ? result.economyDisplay
      : result.calculationMode === 'fuel-used'
        ? result.fuelUsedDisplay
        : result.distanceDisplay;

  const primaryLabel =
    result.calculationMode === 'fuel-economy'
      ? 'fuel economy'
      : result.calculationMode === 'fuel-used'
        ? 'fuel used'
        : 'distance';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {primary}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          {primaryLabel}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Distance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.distanceDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel used</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.fuelUsedDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">US MPG</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.mpgUS)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Imperial MPG</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.mpgImperial)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">km/L</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.kilometersPerLiter)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">L/100 km</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.litersPer100Km)}
          </dd>
        </div>
        {result.tripCost != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Trip fuel needed</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.tripFuelNeeded != null && result.tripFuelNeededUnit
                  ? `${fmt(result.tripFuelNeeded)} ${VOLUME_UNIT_LABELS[result.tripFuelNeededUnit]}`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Estimated trip cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.tripCost)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Cost per mile</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.costPerMile != null ? money(result.costPerMile) : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Cost per kilometer</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.costPerKilometer != null
                  ? money(result.costPerKilometer)
                  : '—'}
              </dd>
            </div>
          </>
        ) : null}
        {result.rangeDistance != null && result.rangeDistanceUnit ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Estimated range</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.rangeDistance)}{' '}
              {DISTANCE_UNIT_LABELS[result.rangeDistanceUnit]}
            </dd>
          </div>
        ) : null}
        {result.compareFuelA != null && result.compareFuelB != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Vehicle A fuel</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.compareFuelA)} US gal
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Vehicle B fuel</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.compareFuelB)} US gal
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Fuel savings</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.fuelSavings != null
                  ? `${fmt(result.fuelSavings)} US gal`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Cost savings</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.costSavings != null ? money(result.costSavings) : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Fuel reduction</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.fuelReductionPct != null
                  ? `${fmt(result.fuelReductionPct)}%`
                  : '—'}
              </dd>
            </div>
          </>
        ) : null}
        {result.mpgImprovementPct != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">MPG difference (US)</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.mpgDifference != null
                  ? fmt(result.mpgDifference)
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">MPG improvement</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.mpgImprovementPct)}%
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Fuel use reduction</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.consumptionReductionPct != null
                  ? `${fmt(result.consumptionReductionPct)}%`
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
