'use client';

import { useState } from 'react';
import { fmt, fromMicrosieverts } from './calculation';
import type { FlightRadiationResult } from './types';

interface FlightRadiationResultsProps {
  result: FlightRadiationResult | null;
}

export function FlightRadiationResults({
  result,
}: FlightRadiationResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedDose}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          estimated dose
          {result.numberOfFlights > 1 ? ' (cumulative)' : ''}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Flight duration</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.flightHours, 4)} h
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Dose rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.doseRateUSvPerH, 4)} µSv/h
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Dose per flight</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPerFlight}
          </dd>
        </div>
        {result.numberOfFlights > 1 ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Number of flights</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.numberOfFlights}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Dose (µSv)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.doseMicrosieverts, 4)} µSv
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Dose (mSv)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(fromMicrosieverts(result.doseMicrosieverts, 'mSv'), 6)} mSv
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
