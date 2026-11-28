'use client';

import type { HorsepowerSpeedPoint } from './types';

interface BoatSpeedChartProps {
  points: HorsepowerSpeedPoint[];
}

export function BoatSpeedChart({ points }: BoatSpeedChartProps) {
  if (points.length < 2) return null;

  const width = 560;
  const height = 220;
  const padL = 48;
  const padR = 12;
  const padT = 16;
  const padB = 36;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxHp = Math.max(...points.map((p) => p.horsepowerHp), 1);
  const maxS = Math.max(...points.map((p) => p.speedMph), 1);

  const toX = (hp: number) => padL + (hp / maxHp) * plotW;
  const toY = (s: number) => padT + plotH - (s / maxS) * plotH;

  const poly = points
    .map((p) => `${toX(p.horsepowerHp).toFixed(1)},${toY(p.speedMph).toFixed(1)}`)
    .join(' ');

  const yTicks = [0, 0.5, 1].map((f) => maxS * f);
  const xTicks = [0, 0.5, 1].map((f) => maxHp * f);

  return (
    <div
      className="space-y-2"
      role="img"
      aria-label="Horsepower versus estimated boat speed chart"
    >
      <h4 className="text-sm font-semibold text-accent">
        Horsepower vs. Estimated Boat Speed
      </h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={padL}
              x2={width - padR}
              y1={toY(t)}
              y2={toY(t)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <text
              x={padL - 6}
              y={toY(t) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={9}
            >
              {t.toFixed(0)}
            </text>
          </g>
        ))}
        <polyline fill="none" stroke="#087E8B" strokeWidth={2} points={poly} />
        {points.map((p) => (
          <circle
            key={p.horsepowerHp}
            cx={toX(p.horsepowerHp)}
            cy={toY(p.speedMph)}
            r={3}
            fill="#087E8B"
          />
        ))}
        {xTicks.map((t) => (
          <text
            key={t}
            x={toX(t)}
            y={height - 10}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={9}
          >
            {t.toFixed(0)} hp
          </text>
        ))}
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Speed scales with √(P/D). Doubling horsepower raises estimated speed by
        about 41%, not 100%, when displacement and C stay fixed.
      </p>
    </div>
  );
}
