'use client';

import type {
  EfficiencyChartPoint,
  FuelConsumptionChartPoint,
} from './types';

interface BsfcChartProps {
  efficiencyPoints: EfficiencyChartPoint[];
  fuelPoints: FuelConsumptionChartPoint[];
}

function LineChart({
  title,
  ariaLabel,
  points,
  getX,
  getY,
  xLabel,
  yLabel,
}: {
  title: string;
  ariaLabel: string;
  points: { x: number; y: number }[];
  getX: (p: { x: number; y: number }) => number;
  getY: (p: { x: number; y: number }) => number;
  xLabel: string;
  yLabel: string;
}) {
  if (points.length < 2) return null;

  const width = 560;
  const height = 200;
  const padL = 48;
  const padR = 12;
  const padT = 16;
  const padB = 36;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const xs = points.map(getX);
  const ys = points.map(getY);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs, minX + 1);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys, minY + 1);

  const toX = (v: number) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const toY = (v: number) =>
    padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const poly = points
    .map((p) => `${toX(getX(p)).toFixed(1)},${toY(getY(p)).toFixed(1)}`)
    .join(' ');

  return (
    <div className="space-y-1" role="img" aria-label={ariaLabel}>
      <h4 className="text-sm font-semibold text-accent">{title}</h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <polyline fill="none" stroke="#087E8B" strokeWidth={2} points={poly} />
        {points.map((p) => (
          <circle
            key={`${getX(p)}-${getY(p)}`}
            cx={toX(getX(p))}
            cy={toY(getY(p))}
            r={3}
            fill="#087E8B"
          />
        ))}
        <text
          x={padL}
          y={height - 10}
          className="fill-muted-foreground"
          fontSize={9}
        >
          {xLabel}
        </text>
        <text
          x={8}
          y={padT + 8}
          className="fill-muted-foreground"
          fontSize={9}
        >
          {yLabel}
        </text>
      </svg>
    </div>
  );
}

export function BsfcChart({ efficiencyPoints, fuelPoints }: BsfcChartProps) {
  return (
    <div className="space-y-4">
      <LineChart
        title="BSFC vs. Efficiency"
        ariaLabel="BSFC versus brake thermal efficiency chart"
        points={efficiencyPoints.map((p) => ({
          x: p.bsfcGPerKWh,
          y: p.efficiencyPercent,
        }))}
        getX={(p) => p.x}
        getY={(p) => p.y}
        xLabel="BSFC (g/kWh)"
        yLabel="η %"
      />
      {fuelPoints.length >= 2 ? (
        <LineChart
          title="Engine Power vs. Fuel Consumption"
          ariaLabel="Engine power versus fuel consumption chart"
          points={fuelPoints.map((p) => ({
            x: p.powerKW,
            y: p.fuelKgPerHour,
          }))}
          getX={(p) => p.x}
          getY={(p) => p.y}
          xLabel="Power (kW)"
          yLabel="kg/h"
        />
      ) : null}
    </div>
  );
}
