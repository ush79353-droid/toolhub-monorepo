'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import { fmt } from './calculation';
import type { TeslaChargingResult } from './types';

interface TeslaChargingCostChartProps {
  result: TeslaChargingResult;
}

export function TeslaChargingCostChart({
  result,
}: TeslaChargingCostChartProps) {
  const points = result.chartPoints;
  if (points.length < 2) return null;

  const width = 560;
  const height = 200;
  const padL = 48;
  const padR = 12;
  const padT = 14;
  const padB = 32;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const maxCost = Math.max(...points.map((p) => p.cost), 1);
  const minSoc = points[0]!.socPercent;
  const maxSoc = 100;
  const socSpan = Math.max(maxSoc - minSoc, 1);

  const toX = (soc: number) => padL + ((soc - minSoc) / socSpan) * plotW;
  const toY = (cost: number) => padT + plotH - (cost / maxCost) * plotH;

  const poly = points
    .map((p) => `${toX(p.socPercent).toFixed(1)},${toY(p.cost).toFixed(1)}`)
    .join(' ');

  return (
    <div
      className="space-y-2"
      role="img"
      aria-label={`Charging cost versus battery level chart. Full charge estimate ${result.fullChargeCostDisplay ?? 'n/a'}.`}
    >
      <h4 className="text-sm font-semibold text-accent">
        Charging Cost vs. Battery Level
      </h4>
      <p className="text-[11px] text-muted-foreground">
        Simplified electricity-cost estimate — not charging power or time.
      </p>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <line
          x1={padL}
          x2={width - padR}
          y1={height - padB}
          y2={height - padB}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        <line
          x1={padL}
          x2={padL}
          y1={padT}
          y2={height - padB}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        <polyline fill="none" stroke="#087E8B" strokeWidth={2} points={poly} />
        {points
          .filter((_, i) => i % Math.ceil(points.length / 5) === 0)
          .map((p) => (
            <circle
              key={p.socPercent}
              cx={toX(p.socPercent)}
              cy={toY(p.cost)}
              r={3}
              fill="#087E8B"
            >
              <title>
                {fmt(p.socPercent, 0)}%:{' '}
                {formatCurrencyValue(p.cost, result.currency)}
              </title>
            </circle>
          ))}
        <text
          x={padL - 4}
          y={toY(maxCost) + 3}
          textAnchor="end"
          className="fill-muted-foreground"
          fontSize={9}
        >
          {formatCurrencyValue(maxCost, result.currency)}
        </text>
        <text
          x={padL}
          y={height - 8}
          className="fill-muted-foreground"
          fontSize={9}
        >
          {fmt(minSoc, 0)}%
        </text>
        <text
          x={width - padR}
          y={height - 8}
          textAnchor="end"
          className="fill-muted-foreground"
          fontSize={9}
        >
          100%
        </text>
      </svg>
    </div>
  );
}
