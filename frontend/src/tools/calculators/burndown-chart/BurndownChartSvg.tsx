'use client';

import type { BurndownChartResult } from './types';
import { formatPoints } from './calculation';

interface BurndownChartSvgProps {
  result: BurndownChartResult;
}

export function BurndownChartSvg({ result }: BurndownChartSvgProps) {
  const width = 320;
  const height = 180;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxDay = Math.max(1, result.points[result.points.length - 1]?.day ?? 1);
  const maxY = Math.max(
    1,
    ...result.points.map((p) =>
      Math.max(p.idealRemaining, p.actualRemaining ?? 0)
    )
  );

  const toX = (day: number) => padL + (day / maxDay) * plotW;
  const toY = (value: number) => padT + plotH - (value / maxY) * plotH;

  const idealPolyline = result.points
    .map((p) => `${toX(p.day).toFixed(1)},${toY(p.idealRemaining).toFixed(1)}`)
    .join(' ');

  const actualPolyline = result.points
    .filter((p) => p.actualRemaining !== null)
    .map((p) => `${toX(p.day).toFixed(1)},${toY(p.actualRemaining as number).toFixed(1)}`)
    .join(' ');

  const yTicks = [0, 0.5, 1].map((t) => maxY * t);

  return (
    <div className="rounded-xl border border-border bg-white p-3 sm:p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-accent">Burndown chart</h3>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-3 bg-primary" aria-hidden="true" />
            Ideal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-3 bg-accent" aria-hidden="true" />
            Actual
          </span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-44 w-full sm:h-48"
        role="img"
        aria-label="Burndown chart of ideal and actual remaining story points by working day"
      >
        <title>Sprint burndown</title>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padL}
              y1={toY(tick)}
              x2={padL + plotW}
              y2={toY(tick)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <text
              x={padL - 6}
              y={toY(tick) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              style={{ fontSize: 9 }}
            >
              {formatPoints(tick)}
            </text>
          </g>
        ))}
        <line
          x1={padL}
          y1={padT}
          x2={padL}
          y2={padT + plotH}
          stroke="#CBD5E1"
          strokeWidth="1"
        />
        <line
          x1={padL}
          y1={padT + plotH}
          x2={padL + plotW}
          y2={padT + plotH}
          stroke="#CBD5E1"
          strokeWidth="1"
        />
        <polyline
          fill="none"
          stroke="#087E8B"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={idealPolyline}
        />
        {actualPolyline ? (
          <polyline
            fill="none"
            stroke="#163C43"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={actualPolyline}
          />
        ) : null}
        <text
          x={padL}
          y={height - 8}
          className="fill-muted-foreground"
          style={{ fontSize: 9 }}
        >
          Day 0
        </text>
        <text
          x={padL + plotW}
          y={height - 8}
          textAnchor="end"
          className="fill-muted-foreground"
          style={{ fontSize: 9 }}
        >
          Day {maxDay}
        </text>
      </svg>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Remaining story points by working day. Actual line stops at the last day you have logged.
      </p>
    </div>
  );
}
