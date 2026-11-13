'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp, Copy, Gauge, Info } from 'lucide-react';
import type { ZeroToSixtyResult } from './types';
import { ZeroToSixtyChart } from './ZeroToSixtyChart';

interface ZeroToSixtyResultsProps {
  result: ZeroToSixtyResult | null;
  hasErrors: boolean;
  onCopy: () => Promise<void>;
  copied: boolean;
}

export function ZeroToSixtyResults({
  result,
  hasErrors,
  onCopy,
  copied,
}: ZeroToSixtyResultsProps) {
  const [showAssumptions, setShowAssumptions] = React.useState(false);
  const [showChart, setShowChart] = React.useState(true);

  if (!result || hasErrors) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">Review highlighted inputs</p>
        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
          Correct any input flags above to compute your 0–60 acceleration estimate.
        </p>
      </div>
    );
  }

  if (!result.reachable) {
    return (
      <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-accent">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-destructive">Target Speed Unreachable</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{result.reason}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" aria-live="polite">
      {/* Primary Highlighted Result Card */}
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">Estimated 0–60 mph Time</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold tracking-tight text-accent sm:text-4xl tabular-nums">
                {result.timeTo60Mph.toFixed(2)}
              </span>
              <span className="text-base font-semibold text-primary">seconds</span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Simulated under modeled traction limits, drivetrain efficiency, and gear progression.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="h-8 gap-1.5 rounded-lg border-primary/30 bg-white/80 px-2.5 text-xs font-medium text-accent hover:bg-white hover:text-primary shadow-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copy Results</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Supporting Key Metric Cards (2x3 Grid) */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {/* 0-100 km/h */}
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">0–100 km/h (62.1 mph)</p>
          <p className="mt-1 text-base font-semibold text-accent tabular-nums">
            {result.timeTo100Kmh.toFixed(2)}{' '}
            <span className="text-xs font-normal text-muted-foreground">s</span>
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            +{(result.timeTo100Kmh - result.timeTo60Mph).toFixed(2)}s over 60 mph
          </p>
        </div>

        {/* Wheel Horsepower */}
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Estimated Wheel Power</p>
          <p className="mt-1 text-base font-semibold text-accent tabular-nums">
            {result.wheelHorsepower}{' '}
            <span className="text-xs font-normal text-muted-foreground">whp</span>
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Delivered to pavement</p>
        </div>

        {/* Power-to-Weight */}
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Power-to-Weight</p>
          <p className="mt-1 text-base font-semibold text-accent tabular-nums">
            {result.powerToWeightHpPerTon}{' '}
            <span className="text-xs font-normal text-muted-foreground">hp/ton</span>
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {result.powerToWeightLbPerHp} lb/hp
          </p>
        </div>

        {/* Distance to 60 mph */}
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Distance to 60 mph</p>
          <p className="mt-1 text-base font-semibold text-accent tabular-nums">
            {result.distanceTo60MphFeet}{' '}
            <span className="text-xs font-normal text-muted-foreground">ft</span>
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {result.distanceTo60MphMeters} meters
          </p>
        </div>

        {/* Average 0-60 Acceleration */}
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Average Acceleration</p>
          <p className="mt-1 text-base font-semibold text-accent tabular-nums">
            {result.averageAcceleration60MphG}{' '}
            <span className="text-xs font-normal text-muted-foreground">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {result.averageAcceleration60MphMps2} m/s²
          </p>
        </div>

        {/* Peak Launch G-Force */}
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Peak Launch Force</p>
          <p className="mt-1 text-base font-semibold text-accent tabular-nums">
            {result.peakAccelerationG}{' '}
            <span className="text-xs font-normal text-muted-foreground">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Traction limit peak</p>
        </div>
      </div>

      {/* Speed-Time Simulation Chart */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowChart((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-accent hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-primary" />
            <span>Acceleration Curve (Speed vs. Time)</span>
          </span>
          {showChart ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {showChart && (
          <ZeroToSixtyChart
            simulationPoints={result.simulationPoints}
            timeTo60Mph={result.timeTo60Mph}
            timeTo100Kmh={result.timeTo100Kmh}
          />
        )}
      </div>

      {/* Detailed Assumptions & Simulation Breakdown */}
      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          onClick={() => setShowAssumptions((v) => !v)}
          className="flex w-full items-center justify-between p-3.5 text-left text-xs font-medium text-accent hover:bg-muted/30 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-primary" />
            <span>Simulation Parameters & Physics Assumptions</span>
          </span>
          {showAssumptions ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>

        {showAssumptions && (
          <div className="border-t border-border px-4 py-3 text-xs space-y-2 bg-muted/20">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-muted-foreground">
              <div className="flex justify-between">
                <span>Tire Friction Coefficient (&mu;):</span>
                <span className="font-mono text-accent font-medium">
                  {result.assumptions.tireFrictionCoeff}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Driven Axle Normal Weight:</span>
                <span className="font-mono text-accent font-medium">
                  {(result.assumptions.drivenAxleWeightFraction * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Power Utilization Factor:</span>
                <span className="font-mono text-accent font-medium">
                  {(result.assumptions.powerUtilizationFactor * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Effective Rotating Mass:</span>
                <span className="font-mono text-accent font-medium">
                  {result.assumptions.effectiveTotalMassKg.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Air Density (&rho;):</span>
                <span className="font-mono text-accent font-medium">
                  {result.assumptions.airDensityKgPerM3} kg/m³
                </span>
              </div>
              <div className="flex justify-between">
                <span>Road Slope Angle:</span>
                <span className="font-mono text-accent font-medium">
                  {result.assumptions.gradientAngleDegrees.toFixed(2)}°
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transparent Disclaimer Notice */}
      <div className="rounded-lg border border-border/70 bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <strong className="text-accent font-semibold">Important Disclaimer:</strong> This is an estimate, not a
        verified manufacturer specification. Actual acceleration varies with tire grip, road conditions, gearing,
        torque curve, launch technique, weather, and vehicle condition. Peak power is not available at every speed;
        the model uses a documented average power factor.
      </div>
    </div>
  );
}

