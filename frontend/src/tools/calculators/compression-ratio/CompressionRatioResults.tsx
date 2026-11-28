'use client';

import { useState } from 'react';
import { CompressionRatioDiagram } from './CompressionRatioDiagram';
import type { CompressionRatioResult } from './types';

interface CompressionRatioResultsProps {
  result: CompressionRatioResult | null;
}

function fmt(n: number, d = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function CompressionRatioResults({
  result,
}: CompressionRatioResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const liters = result.engineDisplacementCc / 1000;
  const ci = result.engineDisplacementCc / 16.387064;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedPrimary}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          {result.primaryLabel.toLowerCase()}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cylinders</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.cylinders}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Swept volume / cylinder</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.sweptVolumePerCylinderCc)} cc
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Engine displacement</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.engineDisplacementCc)} cc ({fmt(liters, 3)} L ·{' '}
            {fmt(ci)} in³)
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Clearance volume (Vc)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.clearanceVolumeCc)} cc
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Volume at BDC</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.volumeAtBDCCc)} cc
          </dd>
        </div>
        {result.mode === 'engineGeometry' ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Chamber volume</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.chamberVolumeCc)} cc
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Gasket volume</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.gasketVolumeCc)} cc
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Deck volume</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.deckVolumeCc)} cc
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Piston volume</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.pistonVolumeCc)} cc
              </dd>
            </div>
          </>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Static compression ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.staticCompressionRatio)} : 1
          </dd>
        </div>
        {result.dynamicCompressionRatio != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Effective stroke</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.effectiveStrokeMm ?? 0)} mm
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Effective swept volume</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.effectiveSweptVolumeCc ?? 0)} cc
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Dynamic compression ratio</dt>
              <dd className="tabular-nums font-medium text-accent">
                {fmt(result.dynamicCompressionRatio)} : 1
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

      <CompressionRatioDiagram
        staticCR={result.staticCompressionRatio}
        hasGeometry={result.mode === 'engineGeometry'}
      />
    </div>
  );
}
