'use client';

import type { BoostComparisonPoint } from './types';

interface BoostHorsepowerChartProps {
  points: BoostComparisonPoint[];
}

export function BoostHorsepowerChart({ points }: BoostHorsepowerChartProps) {
  if (points.length < 2) return null;

  const width = 560;
  const height = 220;
  const padL = 48;
  const padR = 12;
  const padT = 16;
  const padB = 36;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxBoost = Math.max(...points.map((p) => p.boostPsi), 1);
  const maxHp = Math.max(...points.map((p) => p.boostedHp), 1);
  const minHp = Math.min(...points.map((p) => p.boostedHp));

  const toX = (b: number) => padL + (b / maxBoost) * plotW;
  const toY = (hp: number) =>
    padT + plotH - ((hp - minHp) / Math.max(maxHp - minHp, 1)) * plotH;

  const poly = points
    .map((p) => `${toX(p.boostPsi).toFixed(1)},${toY(p.boostedHp).toFixed(1)}`)
    .join(' ');

  return (
    <div
      className="space-y-2"
      role="img"
      aria-label="Boost pressure versus estimated horsepower chart"
    >
      <h4 className="text-sm font-semibold text-accent">
        Boost Pressure vs. Estimated Horsepower
      </h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <polyline fill="none" stroke="#087E8B" strokeWidth={2} points={poly} />
        {points.map((p) => (
          <circle
            key={p.boostPsi}
            cx={toX(p.boostPsi)}
            cy={toY(p.boostedHp)}
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
          0 psi
        </text>
        <text
          x={width - padR}
          y={height - 10}
          textAnchor="end"
          className="fill-muted-foreground"
          fontSize={9}
        >
          {maxBoost} psi
        </text>
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Under the ideal model, estimated horsepower rises linearly with gauge
        boost while other assumptions stay fixed.
      </p>
    </div>
  );
}
