'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { GvwrResult } from './types';
import { MODE_LABELS } from './types';

interface GvwrResultsProps {
  result: GvwrResult | null;
}

function statusLabel(result: GvwrResult): string {
  if (result.loadingStatus === 'within') return 'Within specified GVWR';
  if (result.loadingStatus === 'atLimit') return 'At GVWR limit';
  if (result.loadingStatus === 'over') return 'Over GVWR limit';
  return '—';
}

export function GvwrResults({ result }: GvwrResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter tare and payload (or GVWR fields for other modes) to see results.
      </div>
    );
  }

  const util = result.utilizationPercent;
  const barWidth =
    util == null ? 0 : Math.min(100, Math.max(0, util));

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      {result.mode === 'maximumPayload' ? (
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.formattedMaxPayload}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            estimated max payload
          </span>
        </p>
      ) : (
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.formattedGvw}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            gross vehicle weight (GVW)
          </span>
        </p>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Gross vehicle weight is the estimated weight of your loaded vehicle.
        GVWR is the manufacturer&apos;s maximum permitted loaded weight.
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Mode</dt>
          <dd className="font-medium text-accent">{MODE_LABELS[result.mode]}</dd>
        </div>
        {result.manufacturerGvwrKg != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Manufacturer GVWR</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.manufacturerGvwrKg)} kg
            </dd>
          </div>
        ) : null}
        {result.formattedRemaining != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Remaining capacity</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedRemaining}
            </dd>
          </div>
        ) : null}
        {result.formattedMaxPayload != null &&
        result.mode !== 'maximumPayload' ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Maximum payload</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedMaxPayload}
            </dd>
          </div>
        ) : null}
        {result.utilizationPercent != null ? (
          <div className="space-y-1.5">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">GVWR utilization</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.utilizationPercent)}%
              </dd>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={Math.round(barWidth)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="GVWR utilization"
            >
              <div
                className={`h-full rounded-full ${
                  result.loadingStatus === 'over'
                    ? 'bg-rose-500'
                    : result.loadingStatus === 'atLimit'
                      ? 'bg-amber-500'
                      : 'bg-primary'
                }`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        ) : null}
        {result.loadingStatus != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Loading status</dt>
            <dd className="font-medium text-accent">{statusLabel(result)}</dd>
          </div>
        ) : null}
        {result.formattedOverload != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Overloaded by</dt>
            <dd className="tabular-nums font-medium text-rose-700">
              {result.formattedOverload}
            </dd>
          </div>
        ) : null}
      </dl>

      {result.isOverloaded ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-800"
          role="alert"
        >
          The estimated gross vehicle weight exceeds the manufacturer-specified
          GVWR. Reduce the load and verify all applicable axle, tire, and towing
          limits before operating the vehicle.
        </p>
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
    </div>
  );
}
