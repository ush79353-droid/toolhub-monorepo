'use client';

import { useState } from 'react';
import { fmt, formatLength } from './calculation';
import { FabricCuttingDiagram } from './FabricCuttingDiagram';
import type { FabricResult, LengthUnit } from './types';

interface FabricResultsProps {
  result: FabricResult | null;
  displayUnit: LengthUnit;
}

export function FabricResults({ result, displayUnit }: FabricResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter fabric width, piece size, and quantity to calculate cutting
        layout and yardage.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Fabric cutting results
      </h3>

      <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-white p-3">
            <p className="text-xs text-muted-foreground">
              Recommended fabric to purchase
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
              {formatLength(result.adjustedFabricLengthMm, displayUnit)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {fmt(result.fabricYards, 3)} yd · {fmt(result.fabricMeters, 3)} m
              {result.adjustedFabricLengthMm !== result.baseFabricLengthMm
                ? ` · base ${formatLength(result.baseFabricLengthMm, displayUnit)}`
                : ''}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">Pieces across</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.piecesAcross}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Rows</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.rowsRequired}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Utilization</dt>
              <dd className="font-medium tabular-nums text-accent">
                {fmt(result.utilizationPercent, 1)}%
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Usable width</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatLength(result.usableFabricWidthMm, displayUnit)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Orientation</dt>
              <dd className="font-medium text-accent">
                {result.isRotated ? 'Rotated 90°' : 'As entered'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Last row</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.piecesInLastRow} piece(s)
              </dd>
            </div>
          </dl>
        </div>
        <FabricCuttingDiagram result={result} />
      </div>

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
