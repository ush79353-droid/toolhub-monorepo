'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { SpeedInput, SpeedResult } from './types';

interface SpeedResultsProps {
  result: SpeedResult | null;
  input: SpeedInput;
}

export function SpeedResults({ result, input }: SpeedResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter two known values to calculate speed, distance, or time.
      </div>
    );
  }

  const primary =
    result.calculationMode === 'speed'
      ? result.speedDisplay
      : result.calculationMode === 'distance'
        ? result.distanceDisplay
        : result.timeDisplay;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      {primary ? (
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {primary}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            {result.calculationMode}
          </span>
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Distance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.distanceDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Time</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.timeDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Speed</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.speedDisplay ?? '—'}
          </dd>
        </div>
      </dl>

      {result.averageSpeedDisplay ? (
        <dl className="space-y-2 border-t border-border pt-3 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total distance</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.totalDistanceDisplay}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total time</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.totalTimeDisplay}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Average speed</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.averageSpeedDisplay}
            </dd>
          </div>
        </dl>
      ) : null}

      {input.showCompare && result.comparisons ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-2 py-1.5 font-semibold text-accent">
                  Reference
                </th>
                <th className="px-2 py-1.5 font-semibold text-accent">
                  Approx. km/h
                </th>
                <th className="px-2 py-1.5 font-semibold text-accent">
                  Comparison
                </th>
              </tr>
            </thead>
            <tbody>
              {result.comparisons.map((row) => (
                <tr key={row.label} className="border-b border-border">
                  <td className="px-2 py-1.5">
                    {row.label}
                    {row.note ? (
                      <span className="block text-[10px] text-muted-foreground">
                        {row.note}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {fmt(row.referenceKmh, 2)}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums">{row.ratioDisplay}</td>
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
      {showSteps && result.formulaSteps.length ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-accent">
          {result.formulaSteps.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}
