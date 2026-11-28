'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { MilesToHoursResult } from './types';

interface MilesToHoursResultsProps {
  result: MilesToHoursResult | null;
}

export function MilesToHoursResults({ result }: MilesToHoursResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter two values to calculate the third (time, distance, or speed).
      </div>
    );
  }

  const primary =
    result.calculationMode === 'time'
      ? result.timeDisplay
      : result.calculationMode === 'distance'
        ? result.distanceDisplay
        : result.speedDisplay;

  const primaryLabel =
    result.calculationMode === 'time'
      ? 'travel time'
      : result.calculationMode === 'distance'
        ? 'distance'
        : 'required average speed';

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
      <p className="text-sm font-medium text-accent">
        {result.formattedDuration}
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
          readable duration
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
          <dt className="text-muted-foreground">Average speed</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.speedDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Time</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.timeDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Time in hours</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.timeHours, 4)} h
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Time in minutes</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.timeMinutes)} min
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Time in seconds</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.timeSeconds, 0)} s
          </dd>
        </div>
        {result.compareTimeAHours != null && result.compareTimeBHours != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Time at speed A</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.compareTimeAHours, 4)} h
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Time at speed B</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.compareTimeBHours, 4)} h
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Time saved</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.timeSavedHours != null
                  ? `${fmt(result.timeSavedHours, 4)} h`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Time reduction</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.percentageSaved != null
                  ? `${fmt(result.percentageSaved)}%`
                  : 'n/a'}
              </dd>
            </div>
          </>
        ) : null}
        {result.totalTripLabel ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Break time</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.breakTimeHours != null
                  ? `${fmt(result.breakTimeHours, 4)} h`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Total trip time</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.totalTripLabel}
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
