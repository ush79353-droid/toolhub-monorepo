'use client';

import { useState } from 'react';
import { WindsockDiagram } from './WindsockDiagram';
import type { WindsockResult } from './types';

interface WindsockResultsProps {
  result: WindsockResult | null;
}

export function WindsockResults({ result }: WindsockResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter extended segments or a wind speed to estimate knots and convert
        units.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Windsock wind speed results
      </h3>

      <div className="rounded-lg border border-border bg-white p-3">
        <p className="text-xs text-muted-foreground">Estimated wind speed</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">
          {result.knotsDisplay}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {result.extensionLabel}
          {result.isAboveSegmentModelRange
            ? ' · five-segment model saturated'
            : ''}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">mph</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.mphDisplay}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">km/h</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.kmhDisplay}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">m/s</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.msDisplay}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">ft/s</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.fpsDisplay}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            Approx. segments
          </dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.estimatedSegments} / 5
          </dd>
        </div>
      </dl>

      <WindsockDiagram
        segments={result.estimatedSegments}
        aboveRange={result.isAboveSegmentModelRange}
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[280px] text-left text-xs">
          <caption className="sr-only">
            Simplified five-segment windsock speed guide
          </caption>
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-2 py-1.5 font-medium">Segments</th>
              <th className="px-2 py-1.5 font-medium">kn</th>
              <th className="px-2 py-1.5 font-medium">mph</th>
              <th className="px-2 py-1.5 font-medium">km/h</th>
            </tr>
          </thead>
          <tbody className="tabular-nums text-accent">
            {[
              [0, 0, 0, 0],
              [1, 3, 3.45, 5.56],
              [2, 6, 6.9, 11.11],
              [3, 9, 10.36, 16.67],
              [4, 12, 13.81, 22.22],
              [5, 15, 17.26, 27.78],
            ].map(([n, kn, mph, kmh]) => (
              <tr
                key={n}
                className={
                  result.estimatedSegments === n &&
                  !result.isAboveSegmentModelRange
                    ? 'bg-primary/10'
                    : 'border-t border-border'
                }
              >
                <td className="px-2 py-1">{n}</td>
                <td className="px-2 py-1">{kn}</td>
                <td className="px-2 py-1">{mph}</td>
                <td className="px-2 py-1">{kmh}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-border px-2 py-1.5 text-[10px] text-muted-foreground">
          Simplified estimation guide — not a universal calibration standard.
        </p>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((s) => !s)}
        aria-expanded={showSteps}
      >
        {showSteps ? 'Hide' : 'Show'} calculation steps
      </button>
      {showSteps ? (
        <ul className="list-disc space-y-1 pl-5 font-mono text-xs text-accent">
          {result.formulaSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
