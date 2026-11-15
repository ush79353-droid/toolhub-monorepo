'use client';

import type { PricePair } from './types';

interface BetaStockChartProps {
  pairs: PricePair[];
}

export function BetaStockChart({ pairs }: BetaStockChartProps) {
  if (pairs.length === 0) return null;

  const width = 560;
  const height = 200;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxY = Math.max(
    1,
    ...pairs.flatMap((p) => [p.asset, p.benchmark])
  );
  const maxDay = Math.max(1, pairs.length - 1);

  const toX = (index: number) =>
    pairs.length === 1 ? padL + plotW / 2 : padL + (index / maxDay) * plotW;
  const toY = (value: number) => padT + plotH - (value / maxY) * plotH;

  const assetLine = pairs
    .map((p, i) => `${toX(i).toFixed(1)},${toY(p.asset).toFixed(1)}`)
    .join(' ');
  const benchLine = pairs
    .map((p, i) => `${toX(i).toFixed(1)},${toY(p.benchmark).toFixed(1)}`)
    .join(' ');

  return (
    <div className="rounded-xl border border-border bg-white p-3 sm:p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-accent">Prices</h3>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-3 bg-accent" aria-hidden="true" />
            Asset
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-3 bg-primary" aria-hidden="true" />
            Benchmark
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-44 w-full min-w-[280px] sm:h-48"
          role="img"
          aria-label="Line chart of asset and benchmark prices by day"
        >
          <title>Asset and benchmark prices</title>
          {[0, 0.5, 1].map((t) => {
            const y = padT + plotH * (1 - t);
            return (
              <g key={t}>
                <line
                  x1={padL}
                  x2={width - padR}
                  y1={y}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text x={4} y={y + 3} className="fill-muted-foreground" fontSize="9">
                  {Math.round(maxY * t).toLocaleString('en-US', { notation: 'compact' })}
                </text>
              </g>
            );
          })}
          <polyline
            fill="none"
            stroke="#087E8B"
            strokeWidth="2"
            points={benchLine}
          />
          <polyline
            fill="none"
            stroke="#163C43"
            strokeWidth="2"
            points={assetLine}
          />
          {pairs.map((_, index) => (
            <text
              key={index}
              x={toX(index)}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="9"
            >
              {index + 1}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
