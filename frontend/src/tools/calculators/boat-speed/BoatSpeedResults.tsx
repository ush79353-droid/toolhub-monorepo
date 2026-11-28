'use client';

import { useState } from 'react';
import { fromMph } from './calculation';
import { BoatSpeedChart } from './BoatSpeedChart';
import { SPEED_UNIT_LABELS, type BoatSpeedResult } from './types';

interface BoatSpeedResultsProps {
  result: BoatSpeedResult | null;
}

function fmt(n: number, d = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function BoatSpeedResults({ result }: BoatSpeedResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

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
          <dt className="text-muted-foreground">Speed (mph)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.speedMph)} mph
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Speed (knots)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(fromMph(result.speedMph, 'knots'))} kn
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Speed (km/h)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(fromMph(result.speedMph, 'kmh'))} km/h
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Speed (m/s)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(fromMph(result.speedMph, 'ms'))} m/s
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Shaft horsepower</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.horsepowerHp)} hp
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Displacement</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.displacementLb)} lb
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Boat category</dt>
          <dd className="text-right font-medium text-accent">
            {result.boatTypeLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Crouch constant</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.crouchConstant, 1)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Power / displacement</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.powerToDisplacementRatio, 4)} hp/lb
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Display speed ({SPEED_UNIT_LABELS[result.speedUnit]})
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.speedDisplay)}
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

      <BoatSpeedChart points={result.comparison} />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5 font-medium">Horsepower (hp)</th>
              <th className="px-2 py-1.5 font-medium">Est. speed (mph)</th>
            </tr>
          </thead>
          <tbody>
            {result.comparison.map((row) => (
              <tr key={row.horsepowerHp} className="border-t border-border">
                <td className="px-2 py-1.5 tabular-nums">{row.horsepowerHp}</td>
                <td className="px-2 py-1.5 tabular-nums">
                  {fmt(row.speedMph)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
