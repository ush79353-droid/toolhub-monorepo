'use client';

import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { formatHelocMoney } from './calculation';
import type { HelocChartPoint } from './types';

interface HelocChartProps {
  points: HelocChartPoint[];
  currency: SupportedCurrency;
  drawPeriodYears: number;
}

function polyline(
  values: number[],
  years: number[],
  toX: (year: number) => number,
  toY: (v: number) => number
): string {
  return values
    .map((v, i) => `${toX(years[i]!).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(' ');
}

export function HelocChart({
  points,
  currency,
  drawPeriodYears,
}: HelocChartProps) {
  if (points.length < 2) return null;

  const width = 560;
  const height = 220;
  const padL = 48;
  const padR = 12;
  const padT = 16;
  const padB = 32;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const years = points.map((p) => p.year);
  const minYear = years[0]!;
  const maxYear = years[years.length - 1]!;
  const yearSpan = Math.max(1, maxYear - minYear);

  const maxVal = Math.max(
    1,
    ...points.flatMap((p) => [
      p.outstandingBalance,
      p.cumulativeInterest,
      p.cumulativePrincipal,
    ])
  );

  const toX = (year: number) => padL + ((year - minYear) / yearSpan) * plotW;
  const toY = (v: number) => padT + plotH - (v / maxVal) * plotH;
  const symbol = getCurrencySymbol(currency);

  const series = [
    {
      key: 'bal',
      label: 'Outstanding balance',
      color: '#087E8B',
      values: points.map((p) => p.outstandingBalance),
    },
    {
      key: 'int',
      label: 'Cumulative interest',
      color: '#C44536',
      values: points.map((p) => p.cumulativeInterest),
    },
    {
      key: 'prin',
      label: 'Cumulative principal',
      color: '#D4A017',
      values: points.map((p) => p.cumulativePrincipal),
    },
  ] as const;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => maxVal * f);
  const xTicks = [minYear, Math.round(minYear + yearSpan / 2), maxYear].filter(
    (v, i, arr) => arr.indexOf(v) === i
  );

  const drawMarker =
    drawPeriodYears > 0 &&
    drawPeriodYears >= minYear &&
    drawPeriodYears <= maxYear
      ? toX(drawPeriodYears)
      : null;

  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-accent">
          HELOC Payment and Balance Breakdown
        </h3>
        <span className="text-xs text-muted-foreground">
          Amount ({symbol}) over time (years)
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-48 w-full min-w-[300px] sm:h-52"
        role="img"
        aria-label="HELOC outstanding balance, cumulative interest, and cumulative principal over time"
      >
        <title>HELOC Payment and Balance Breakdown</title>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padL}
              x2={width - padR}
              y1={toY(tick)}
              y2={toY(tick)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <text
              x={padL - 6}
              y={toY(tick) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize="9"
            >
              {formatHelocMoney(tick, currency).replace(/\.00$/, '')}
            </text>
          </g>
        ))}
        {drawMarker != null ? (
          <line
            x1={drawMarker}
            x2={drawMarker}
            y1={padT}
            y2={padT + plotH}
            stroke="#9CA3AF"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        ) : null}
        {series.map((s) => (
          <polyline
            key={s.key}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            points={polyline(s.values, years, toX, toY)}
          />
        ))}
        {xTicks.map((year) => (
          <text
            key={year}
            x={toX(year)}
            y={height - 10}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="9"
          >
            {year}
          </text>
        ))}
      </svg>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        {series.map((s) => (
          <li key={s.key} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-3"
              style={{ backgroundColor: s.color }}
              aria-hidden="true"
            />
            {s.label}
          </li>
        ))}
        {drawMarker != null ? (
          <li className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-3 border-t border-dashed border-muted-foreground"
              aria-hidden="true"
            />
            End of draw period
          </li>
        ) : null}
      </ul>
    </div>
  );
}
