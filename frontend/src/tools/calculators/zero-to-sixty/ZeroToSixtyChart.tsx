'use client';

import * as React from 'react';
import type { SimulationPoint } from './types';

interface ZeroToSixtyChartProps {
  simulationPoints: readonly SimulationPoint[];
  timeTo60Mph: number;
  timeTo100Kmh: number;
}

export function ZeroToSixtyChart({
  simulationPoints,
  timeTo60Mph,
  timeTo100Kmh,
}: ZeroToSixtyChartProps) {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  if (!simulationPoints || simulationPoints.length < 2) {
    return null;
  }

  // Chart dimensions & margins
  const width = 360;
  const height = 170;
  const padLeft = 36;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 26;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxTime = Math.max(1, simulationPoints[simulationPoints.length - 1].timeSeconds);
  const maxSpeed = 70; // mph scale up to 70 to give breathing room above 60

  const toX = (t: number) => padLeft + (t / maxTime) * plotW;
  const toY = (mph: number) => padTop + plotH - (Math.min(maxSpeed, mph) / maxSpeed) * plotH;

  const pathPoints = simulationPoints
    .map((pt) => `${toX(pt.timeSeconds).toFixed(1)},${toY(pt.speedMph).toFixed(1)}`)
    .join(' ');

  const lastPoint = simulationPoints[simulationPoints.length - 1];
  const areaD = `M ${padLeft},${padTop + plotH} L ${pathPoints} L ${toX(lastPoint.timeSeconds).toFixed(1)},${padTop + plotH} Z`;

  // 60 mph coordinate
  const x60 = toX(timeTo60Mph);
  const y60 = toY(60);

  // Time grid ticks (approx 4-5 ticks)
  const timeStep = maxTime <= 4 ? 1 : maxTime <= 8 ? 2 : Math.ceil(maxTime / 4);
  const timeTicks: number[] = [];
  for (let t = 0; t <= maxTime; t += timeStep) {
    timeTicks.push(t);
  }

  const speedTicks = [0, 20, 40, 60];

  const activePoint = hoverIndex !== null ? simulationPoints[hoverIndex] : null;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
          Speed vs. Time Progression
        </h3>
        <span className="text-xs text-muted-foreground">
          0–60 in <span className="font-semibold text-primary">{timeTo60Mph.toFixed(2)}s</span> &middot; 0–100 km/h in <span className="font-semibold text-accent">{timeTo100Kmh.toFixed(2)}s</span>
        </span>
      </div>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full select-none overflow-visible"
          role="img"
          aria-label={`0-60 acceleration curve showing vehicle reaching 60 mph in ${timeTo60Mph.toFixed(2)} seconds`}
        >
          <defs>
            <linearGradient id="speedCurveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#087E8B" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#087E8B" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines for speeds */}
          {speedTicks.map((spd) => {
            const y = toY(spd);
            return (
              <g key={`speed-${spd}`}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + plotW}
                  y2={y}
                  stroke={spd === 60 ? '#087E8B' : '#E2E8F0'}
                  strokeDasharray={spd === 60 ? '3 3' : undefined}
                  strokeWidth={spd === 60 ? '1.2' : '1'}
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground text-[9px] font-mono"
                >
                  {spd}
                </text>
              </g>
            );
          })}

          {/* Time axis ticks */}
          {timeTicks.map((t) => {
            const x = toX(t);
            return (
              <g key={`time-${t}`}>
                <line
                  x1={x}
                  y1={padTop + plotH}
                  x2={x}
                  y2={padTop + plotH + 4}
                  stroke="#CBD5E1"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padTop + plotH + 15}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px] font-mono"
                >
                  {t}s
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#speedCurveGrad)" />

          {/* Line stroke */}
          <path
            d={`M ${pathPoints}`}
            fill="none"
            stroke="#087E8B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 60 mph Milestone Marker */}
          <circle cx={x60} cy={y60} r="4.5" fill="#087E8B" stroke="#FFFFFF" strokeWidth="2" />
          <text
            x={Math.min(padLeft + plotW - 32, x60 + 6)}
            y={y60 - 6}
            className="fill-primary text-[10px] font-semibold"
          >
            60 mph ({timeTo60Mph}s)
          </text>

          {/* Hover interactive scrubber */}
          {activePoint && (
            <g>
              <line
                x1={toX(activePoint.timeSeconds)}
                y1={padTop}
                x2={toX(activePoint.timeSeconds)}
                y2={padTop + plotH}
                stroke="#163C43"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={toX(activePoint.timeSeconds)}
                cy={toY(activePoint.speedMph)}
                r="4"
                fill="#163C43"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Invisible hover overlay rects */}
          {simulationPoints.map((pt, idx) => {
            const x = toX(pt.timeSeconds);
            const w = plotW / simulationPoints.length;
            return (
              <rect
                key={`hit-${idx}`}
                x={x - w / 2}
                y={padTop}
                width={Math.max(4, w)}
                height={plotH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            );
          })}
        </svg>

        {/* Dynamic Hover Tooltip Display */}
        {activePoint ? (
          <div className="mt-2 flex flex-wrap items-center justify-between rounded-lg bg-brand-softTeal/50 px-3 py-1.5 text-xs text-accent">
            <span>
              Time: <strong>{activePoint.timeSeconds.toFixed(2)}s</strong>
            </span>
            <span>
              Speed: <strong>{activePoint.speedMph} mph</strong> ({activePoint.speedKmh} km/h)
            </span>
            <span>
              Distance: <strong>{activePoint.distanceFeet} ft</strong> ({activePoint.distanceMeters} m)
            </span>
          </div>
        ) : (
          <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
            Hover or touch the curve to inspect instantaneous speed and distance.
          </p>
        )}
      </div>
    </div>
  );
}
