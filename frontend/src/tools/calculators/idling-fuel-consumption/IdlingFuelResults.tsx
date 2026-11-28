'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { fmt } from './calculation';
import type { IdlingResult } from './types';

interface IdlingFuelResultsProps {
  result: IdlingResult | null;
}

export function IdlingFuelResults({ result }: IdlingFuelResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter engine capacity (or a custom rate), idling time, and fuel price to
        see results.
      </div>
    );
  }

  const money = (n: number) => formatCurrencyValue(n, result.currency);

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedCost}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          total idling cost
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.isCustomRate
              ? 'Custom idling rate'
              : 'Estimated idling rate'}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Idling duration</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.totalIdlingHours, 4)} h
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Fuel consumed</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFuelConsumed}
          </dd>
        </div>
        {result.co2Kg != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Est. CO₂ (tank-to-wheel)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.co2Kg)} kg
            </dd>
          </div>
        ) : null}
        {result.dailyCost != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Daily cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {money(result.dailyCost)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Weekly cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.weeklyCost != null ? money(result.weeklyCost) : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Monthly cost (annual ÷ 12)
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.monthlyCost != null ? money(result.monthlyCost) : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Annual cost</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.annualCost != null ? money(result.annualCost) : '—'}
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
