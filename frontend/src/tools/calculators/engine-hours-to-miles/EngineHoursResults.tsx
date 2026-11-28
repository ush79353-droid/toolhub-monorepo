'use client';

import { useState } from 'react';
import { fmt, fromMiles } from './calculation';
import { MODE_LABELS, type EngineHoursResult } from './types';

interface EngineHoursResultsProps {
  result: EngineHoursResult | null;
  resultDistanceUnit?: string;
}

export function EngineHoursResults({ result }: EngineHoursResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.displayPrimary}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          {result.primaryLabel}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Mode</dt>
          <dd className="text-right font-medium text-accent">
            {MODE_LABELS[result.mode]}
          </dd>
        </div>
        {result.engineHoursValue != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              {result.mode === 'distanceToHours'
                ? 'Estimated driving hours'
                : 'Engine hours'}
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.engineHoursValue)} h
            </dd>
          </div>
        ) : null}
        {result.averageSpeedMph != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Average speed</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.averageSpeedMph)} mph
            </dd>
          </div>
        ) : null}
        {result.mode === 'stationary' ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Actual distance traveled</dt>
              <dd className="tabular-nums font-medium text-accent">0 mi</dd>
            </div>
            {result.maintenanceEquivalentMiles != null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">
                  Maintenance-equivalent mileage
                </dt>
                <dd className="tabular-nums font-medium text-accent">
                  {fmt(result.maintenanceEquivalentMiles)} mi
                </dd>
              </div>
            ) : null}
          </>
        ) : null}
        {result.mode === 'driving' && result.distanceMiles != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Estimated miles</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.distanceMiles)} mi
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Estimated kilometers</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(fromMiles(result.distanceMiles, 'km'))} km
              </dd>
            </div>
          </>
        ) : null}
        {result.mode === 'distanceToHours' &&
        result.estimatedDrivingHours != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Distance (canonical)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.distanceMiles ?? 0)} mi
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
