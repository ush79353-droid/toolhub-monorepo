'use client';

import type { CrosswindResult } from './types';
import { fmt, fromKnots } from './calculation';

interface CrosswindChartProps {
  result: CrosswindResult;
}

export function CrosswindChart({ result }: CrosswindChartProps) {
  const points = result.chartPoints;
  if (points.length < 2) return null;

  const width = 560;
  const height = 200;
  const padL = 44;
  const padR = 12;
  const padT = 14;
  const padB = 32;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const unit = result.displayUnit;
  const maxAbs = Math.max(
    ...points.map((p) => Math.abs(fromKnots(p.crosswindKt, unit))),
    fromKnots(result.crosswindMagnitudeKnots, unit),
    1,
  );

  const toX = (angle: number) => padL + ((angle + 180) / 360) * plotW;
  const toY = (kt: number) => {
    const v = fromKnots(kt, unit);
    return padT + plotH / 2 - (v / maxAbs) * (plotH / 2);
  };

  const poly = points
    .map((p) => `${toX(p.angleDeg).toFixed(1)},${toY(p.crosswindKt).toFixed(1)}`)
    .join(' ');

  const curX = toX(result.relativeWindAngleDegrees);
  const curY = toY(result.signedCrosswindKnots);

  return (
    <div
      className="space-y-2"
      role="img"
      aria-label={`Crosswind versus relative wind angle chart. Current angle ${fmt(result.relativeWindAngleDegrees, 1)} degrees, signed crosswind ${fmt(fromKnots(result.signedCrosswindKnots, unit))} ${unit}.`}
    >
      <h4 className="text-sm font-semibold text-accent">
        Crosswind vs. relative angle
      </h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <line
          x1={padL}
          x2={width - padR}
          y1={toY(0)}
          y2={toY(0)}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        <line
          x1={toX(0)}
          x2={toX(0)}
          y1={padT}
          y2={height - padB}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        <polyline fill="none" stroke="#087E8B" strokeWidth={2} points={poly} />
        <circle cx={curX} cy={curY} r={4} fill="#e11d48" />
        <text
          x={padL - 4}
          y={toY(maxAbs * (unit === 'kt' ? 1 : 1)) + 3}
          textAnchor="end"
          className="fill-muted-foreground"
          fontSize={9}
        >
          +R
        </text>
        <text
          x={padL - 4}
          y={toY(-maxAbs) + 3}
          textAnchor="end"
          className="fill-muted-foreground"
          fontSize={9}
        >
          −L
        </text>
        {[-180, -90, 0, 90, 180].map((a) => (
          <text
            key={a}
            x={toX(a)}
            y={height - 10}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={9}
          >
            {a}°
          </text>
        ))}
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Positive = right crosswind · Negative = left · Red dot = current θ (
        {fmt(result.relativeWindAngleDegrees, 1)}°)
      </p>
    </div>
  );
}
