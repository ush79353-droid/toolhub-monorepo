'use client';

import { useState } from 'react';
import { formatLength, fmt } from './calculation';
import { HexQuiltPreview } from './HexQuiltPreview';
import type { HexagonQuiltResult, LengthUnit } from './types';

interface HexagonQuiltResultsProps {
  result: HexagonQuiltResult | null;
  displayUnit: LengthUnit;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export function HexagonQuiltResults({
  result,
  displayUnit,
  showPreview,
  onTogglePreview,
}: HexagonQuiltResultsProps) {
  const [showSteps, setShowSteps] = useState(false);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter quilt width, length, and hexagon size to calculate the layout.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Hexagons layout</h3>

      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-white px-3 py-2">
          <dt className="text-xs text-muted-foreground">Columns</dt>
          <dd className="text-lg font-semibold text-accent">{result.columns}</dd>
        </div>
        <div className="rounded-lg border border-border bg-white px-3 py-2">
          <dt className="text-xs text-muted-foreground">Rows</dt>
          <dd className="text-lg font-semibold text-accent">{result.rows}</dd>
        </div>
        <div className="rounded-lg border border-border bg-white px-3 py-2">
          <dt className="text-xs text-muted-foreground">Full hexagons</dt>
          <dd className="text-lg font-semibold text-accent">
            {result.fullHexagons}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-white px-3 py-2">
          <dt className="text-xs text-muted-foreground">Half hexagons</dt>
          <dd className="text-lg font-semibold text-accent">
            {result.halfHexagons}
          </dd>
        </div>
      </dl>

      <p className="text-xs text-muted-foreground">
        Vertical halves: {result.verticalHalfHexagons} · Horizontal halves:{' '}
        {result.horizontalHalfHexagons} · Equivalent:{' '}
        {fmt(result.equivalentHexagons, 1)}
      </p>

      <h3 className="pt-1 text-sm font-semibold text-accent">
        Actual size of quilt top
      </h3>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg border border-border bg-white px-3 py-2">
          <dt className="text-xs text-muted-foreground">Actual width</dt>
          <dd className="font-semibold text-accent">
            {formatLength(result.actualWidthCm, displayUnit)}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-white px-3 py-2">
          <dt className="text-xs text-muted-foreground">Actual length</dt>
          <dd className="font-semibold text-accent">
            {formatLength(result.actualLengthCm, displayUnit)}
          </dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">
        Desired:{' '}
        {formatLength(result.desiredWidthCm, displayUnit)} ×{' '}
        {formatLength(result.desiredLengthCm, displayUnit)}
      </p>

      <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted-foreground">
        Finished hex: side {fmt(result.sideLengthCm, 2)} cm · PTP{' '}
        {fmt(result.pointToPointCm, 2)} · FTF {fmt(result.flatToFlatCm, 2)} ·
        area {fmt(result.hexagonAreaCm2, 1)} cm²
        <br />
        Cutting template: side {fmt(result.cuttingSideCm, 2)} cm · PTP{' '}
        {fmt(result.cuttingPointToPointCm, 2)} · FTF{' '}
        {fmt(result.cuttingFlatToFlatCm, 2)}
      </div>

      {result.estimatedFabricYards != null ? (
        <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm">
          <p className="font-semibold text-accent">Fabric estimate</p>
          <p className="text-xs text-muted-foreground">
            ≈ {fmt(result.estimatedFabricYards, 2)} yd · length{' '}
            {formatLength(result.estimatedFabricLengthCm!, displayUnit)} · area{' '}
            {fmt(result.estimatedFabricAreaCm2!, 0)} cm² (includes waste;
            layout efficiency varies)
          </p>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      {result.warnings.map((w) => (
        <p key={w} className="text-xs text-amber-800">
          {w}
        </p>
      ))}

      <button
        type="button"
        className="text-xs font-medium text-primary hover:underline"
        onClick={() => setShowSteps((s) => !s)}
      >
        {showSteps ? 'Hide' : 'Show'} steps
      </button>
      {showSteps ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          {result.formulaSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        className="text-xs font-medium text-primary hover:underline"
        onClick={onTogglePreview}
      >
        {showPreview ? 'Hide' : 'Show'} layout preview
      </button>
      {showPreview ? (
        <HexQuiltPreview
          cells={result.previewCells}
          sideCm={result.sideLengthCm}
          columns={result.columns}
          rows={result.rows}
          actualWidthCm={result.actualWidthCm}
          actualLengthCm={result.actualLengthCm}
          simplified={result.previewSimplified}
          note={result.previewNote}
        />
      ) : null}
    </div>
  );
}
