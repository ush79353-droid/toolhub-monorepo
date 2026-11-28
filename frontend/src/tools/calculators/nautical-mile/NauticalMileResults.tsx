'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { NauticalMileResult } from './types';

interface NauticalMileResultsProps {
  result: NauticalMileResult | null;
}

export function NauticalMileResults({ result }: NauticalMileResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter a distance to convert, or speed and time to calculate travel
        distance.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      {result.nmiDisplay ? (
        <>
          <p className="text-2xl font-semibold tabular-nums text-accent">
            {result.nmiDisplay}
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
              converted
            </span>
          </p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Imperial / US</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.imperialDisplay}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Metric</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.metricDisplay}
              </dd>
            </div>
            {result.statuteMiles != null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Statute miles</dt>
                <dd className="tabular-nums font-medium text-accent">
                  {fmt(result.statuteMiles)} mi
                </dd>
              </div>
            ) : null}
            {result.kilometers != null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Kilometers</dt>
                <dd className="tabular-nums font-medium text-accent">
                  {fmt(result.kilometers)} km
                </dd>
              </div>
            ) : null}
          </dl>
        </>
      ) : null}

      {result.distanceDisplay ? (
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-lg font-semibold tabular-nums text-accent">
            {result.calculationMode === 'distance'
              ? result.distanceDisplay
              : result.calculationMode === 'speed'
                ? result.speedDisplay
                : result.timeDisplay}
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
              travel {result.calculationMode}
            </span>
          </p>
          {result.formattedDuration ? (
            <p className="text-sm text-accent">{result.formattedDuration}</p>
          ) : null}
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Distance</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.distanceDisplay}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Speed</dt>
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
          </dl>
        </div>
      ) : null}

      {result.comparison ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-2 py-1.5 font-semibold text-accent">Unit</th>
                <th className="px-2 py-1.5 font-semibold text-accent">Value</th>
              </tr>
            </thead>
            <tbody>
              {result.comparison.map((row) => (
                <tr key={row.unit} className="border-b border-border">
                  <td className="px-2 py-1.5">{row.label}</td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {fmt(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {result.convertedSpeedDisplay ? (
        <div className="flex justify-between gap-2 text-sm">
          <span className="text-muted-foreground">Converted speed</span>
          <span className="tabular-nums font-medium text-accent">
            {result.convertedSpeedDisplay}
          </span>
        </div>
      ) : null}

      {result.greatCircleNmi != null ? (
        <dl className="space-y-2 border-t border-border pt-3 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Great-circle</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(result.greatCircleNmi)} nmi
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">≈ kilometers</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.greatCircleKm != null
                ? `${fmt(result.greatCircleKm)} km`
                : '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">≈ statute miles</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.greatCircleMi != null
                ? `${fmt(result.greatCircleMi)} mi`
                : '—'}
            </dd>
          </div>
        </dl>
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
