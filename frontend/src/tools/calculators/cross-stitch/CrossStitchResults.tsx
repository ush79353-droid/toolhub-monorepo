'use client';

import { useState } from 'react';
import { fmt, formatMeasurement } from './calculation';
import { CrossStitchDiagram } from './CrossStitchDiagram';
import type { CrossStitchResult, LengthUnit } from './types';

interface CrossStitchResultsProps {
  result: CrossStitchResult | null;
  displayUnit: LengthUnit;
}

export function CrossStitchResults({
  result,
  displayUnit,
}: CrossStitchResultsProps) {
  const [showSteps, setShowSteps] = useState(false);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter pattern width, height, fabric count, and margins to see finished
        size and fabric requirements.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
        <div className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs text-muted-foreground">Finished width</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
                {formatMeasurement(result.finishedWidthCm, displayUnit)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {fmt(result.finishedWidthCm / 2.54, 2)} in
              </p>
            </div>
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs text-muted-foreground">Finished height</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
                {formatMeasurement(result.finishedHeightCm, displayUnit)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {fmt(result.finishedHeightCm / 2.54, 2)} in
              </p>
            </div>
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs text-muted-foreground">Fabric width</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
                {formatMeasurement(result.fabricWidthCm, displayUnit)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs text-muted-foreground">Fabric height</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
                {formatMeasurement(result.fabricHeightCm, displayUnit)}
              </p>
            </div>
          </div>
        </div>
        <CrossStitchDiagram
          finishedWidthCm={result.finishedWidthCm}
          finishedHeightCm={result.finishedHeightCm}
          fabricWidthCm={result.fabricWidthCm}
          fabricHeightCm={result.fabricHeightCm}
          unit={displayUnit}
        />
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Stitches / inch (D)</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.effectiveStitchesPerInch, 3)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            Total pattern positions
          </dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.totalPatternPositions.toLocaleString('en-US')}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Extra per side</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatMeasurement(result.extraFabricCm, displayUnit)}
          </dd>
        </div>
      </dl>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Fabric count comparison (same stitch-over)
        </h4>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-1.5 pr-2 font-medium">Count</th>
                <th className="py-1.5 pr-2 font-medium">Finished W</th>
                <th className="py-1.5 font-medium">Finished H</th>
              </tr>
            </thead>
            <tbody>
              {result.compareRows.map((row) => (
                <tr key={row.fabricCount} className="border-b border-border/60">
                  <td className="py-1.5 pr-2 tabular-nums text-accent">
                    {row.fabricCount}
                  </td>
                  <td className="py-1.5 pr-2 tabular-nums text-accent">
                    {formatMeasurement(row.finishedWidthCm, displayUnit)}
                  </td>
                  <td className="py-1.5 tabular-nums text-accent">
                    {formatMeasurement(row.finishedHeightCm, displayUnit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {result.thread ? (
        <div className="rounded-lg border border-border bg-white p-3 text-xs">
          <p className="font-semibold text-accent">Floss estimate</p>
          <p className="mt-1 tabular-nums text-muted-foreground">
            ~{fmt(result.thread.estimatedCompletedCrosses, 0)} crosses · ~
            {formatMeasurement(
              result.thread.estimatedStrandLengthCm,
              displayUnit,
              0,
            )}{' '}
            strand-eq · ~{result.thread.estimatedSkeins} skein(s)
          </p>
          <p className="mt-1 text-muted-foreground">{result.thread.explanation}</p>
        </div>
      ) : null}

      {result.warnings.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-amber-900">
          {result.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((s) => !s)}
        aria-expanded={showSteps}
      >
        {showSteps ? 'Hide' : 'Show'} formulas
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
