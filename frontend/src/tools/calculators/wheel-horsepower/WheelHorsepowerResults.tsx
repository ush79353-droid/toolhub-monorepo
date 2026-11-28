'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import type { WheelHorsepowerResult } from './types';

interface WheelHorsepowerResultsProps {
  result: WheelHorsepowerResult | null;
}

export function WheelHorsepowerResults({
  result,
}: WheelHorsepowerResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter power and drivetrain efficiency to estimate WHP or crankshaft HP.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Wheel horsepower results
      </h3>

      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.wheelDisplay}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          at the wheels
        </span>
      </p>

      {result.whpExceedsEngine ? (
        <p className="text-xs text-rose-600" role="status">
          Wheel power exceeds engine power — inconsistent with a pure loss model.
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Engine horsepower</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.engineDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Wheel horsepower</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.wheelDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Drivetrain efficiency</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.overallEfficiencyPercent, 2)}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Power loss</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.lossDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Drivetrain loss</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.drivetrainLossPercent, 2)}%
          </dd>
        </div>
      </dl>

      {result.efficiencySource === 'components' ? (
        <dl className="space-y-2 border-t border-border pt-3 text-sm">
          <p className="text-xs font-semibold text-accent">Component η</p>
          {result.gearboxEfficiencyPercent != null ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Gearbox</dt>
              <dd className="tabular-nums text-accent">
                {fmt(result.gearboxEfficiencyPercent, 2)}%
              </dd>
            </div>
          ) : null}
          {result.propellerShaftEfficiencyPercent != null ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Propeller shaft</dt>
              <dd className="tabular-nums text-accent">
                {fmt(result.propellerShaftEfficiencyPercent, 2)}%
              </dd>
            </div>
          ) : null}
          {result.differentialEfficiencyPercent != null ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Differential</dt>
              <dd className="tabular-nums text-accent">
                {fmt(result.differentialEfficiencyPercent, 2)}%
              </dd>
            </div>
          ) : null}
          {result.driveshaftEfficiencyPercent != null ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Driveshaft</dt>
              <dd className="tabular-nums text-accent">
                {fmt(result.driveshaftEfficiencyPercent, 2)}%
              </dd>
            </div>
          ) : null}
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
      {showSteps && result.formulaSteps.length ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-accent">
          {result.formulaSteps.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}
