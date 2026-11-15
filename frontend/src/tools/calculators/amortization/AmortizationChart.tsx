'use client';

import * as React from 'react';
import { formatCurrencyValue } from './calculation';
import type { AmortizationChartPoint, SupportedCurrency } from './types';

interface AmortizationChartProps {
  principal: number;
  totalInterest: number;
  principalRatioPercent: number;
  interestRatioPercent: number;
  currency: SupportedCurrency;
  chartPoints: AmortizationChartPoint[];
  hasExtraPayments: boolean;
}

export function AmortizationChart({
  principal,
  totalInterest,
  principalRatioPercent,
  interestRatioPercent,
  currency,
  chartPoints,
  hasExtraPayments,
}: AmortizationChartProps) {
  const total = principal + totalInterest;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const principalLength = total > 0 ? (principal / total) * circumference : circumference;
  const interestLength = Math.max(0, circumference - principalLength);

  // SVG dimensions for the balance trajectory curve
  const width = 480;
  const height = 180;
  const padLeft = 40;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxPeriod =
    chartPoints.length > 0 ? Math.max(1, chartPoints[chartPoints.length - 1].period) : 1;
  const maxBalance =
    chartPoints.length > 0
      ? Math.max(
          1,
          principal,
          ...chartPoints.map((pt) => Math.max(pt.balance, pt.baselineBalance))
        )
      : Math.max(1, principal);

  const toX = (period: number) => padLeft + (period / maxPeriod) * plotW;
  const toY = (bal: number) => padTop + plotH - (bal / maxBalance) * plotH;

  // Build SVG path strings
  const balancePoints = chartPoints.map((pt) => `${toX(pt.period).toFixed(1)},${toY(pt.balance).toFixed(1)}`);
  const actualPolyline = balancePoints.join(' ');

  const baselinePoints = hasExtraPayments
    ? chartPoints.map((pt) => `${toX(pt.period).toFixed(1)},${toY(pt.baselineBalance).toFixed(1)}`)
    : [];
  const baselinePolyline = baselinePoints.join(' ');

  // Gradient area under actual balance
  const firstPt = chartPoints[0] || { period: 0 };
  const lastPt = chartPoints[chartPoints.length - 1] || { period: maxPeriod };
  const areaPath =
    chartPoints.length > 0
      ? `M ${toX(firstPt.period).toFixed(1)},${(padTop + plotH).toFixed(1)} ` +
        `L ${actualPolyline} ` +
        `L ${toX(lastPt.period).toFixed(1)},${(padTop + plotH).toFixed(1)} Z`
      : '';

  // Interactive hover inspection
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const approxPeriod = xRatio * maxPeriod;
    const closestIdx = chartPoints.findIndex((pt) => pt.period >= approxPeriod);
    if (closestIdx !== -1) {
      setHoverIndex(closestIdx);
    } else {
      setHoverIndex(chartPoints.length - 1);
    }
  };

  const activePoint = hoverIndex !== null && chartPoints[hoverIndex] ? chartPoints[hoverIndex] : null;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
        <h3 className="text-sm font-semibold text-accent">Amortization Balance & Cost Breakdown</h3>
        <span className="text-xs font-normal text-muted-foreground tabular-nums">
          Total Cost: {formatCurrencyValue(total, currency)}
        </span>
      </div>

      {/* Donut and composition summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative mx-auto flex h-24 w-24 shrink-0 items-center justify-center sm:mx-0">
          <svg
            viewBox="0 0 110 110"
            className="h-24 w-24 -rotate-90"
            role="img"
            aria-label={`Amortization composition: ${principalRatioPercent}% principal, ${interestRatioPercent}% interest`}
          >
            <title>Principal vs Interest Breakdown</title>
            <circle cx="55" cy="55" r={radius} fill="none" stroke="#D9F0EF" strokeWidth="13" />
            {interestLength > 0 && (
              <circle
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                stroke="#163C43"
                strokeWidth="13"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={0}
              />
            )}
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke="#087E8B"
              strokeWidth="13"
              strokeDasharray={`${principalLength} ${circumference}`}
              strokeDashoffset={0}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-medium text-muted-foreground">Principal</span>
            <span className="text-xs font-semibold text-accent tabular-nums">
              {principalRatioPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          <div
            className="flex h-2 w-full overflow-hidden rounded-full bg-secondary"
            aria-hidden="true"
          >
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(100, Math.max(0, principalRatioPercent))}%` }}
            />
            <div
              className="h-full bg-accent"
              style={{ width: `${Math.min(100, Math.max(0, interestRatioPercent))}%` }}
            />
          </div>

          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Principal
              </dt>
              <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
                {formatCurrencyValue(principal, currency)}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Total Interest
              </dt>
              <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
                {formatCurrencyValue(totalInterest, currency)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Trajectory curve over time */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-accent">Remaining Loan Balance Trajectory</span>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-3 rounded-full bg-primary" />
              {hasExtraPayments ? 'With Extra Payments' : 'Scheduled Balance'}
            </span>
            {hasExtraPayments && (
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 border-t-2 border-dashed border-muted-foreground/60" />
                Baseline (No Extra)
              </span>
            )}
          </div>
        </div>

        <div className="relative rounded-lg border border-border/70 bg-muted/10 p-2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIndex(null)}
            role="img"
            aria-label="Amortization loan balance curve over time"
          >
            <defs>
              <linearGradient id="amortAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#087E8B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#087E8B" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padTop + plotH * (1 - ratio);
              const val = maxBalance * ratio;
              return (
                <g key={ratio}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="2 3"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-muted-foreground tabular-nums font-mono"
                  >
                    {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Baseline Curve (if extra payments active) */}
            {hasExtraPayments && baselinePolyline && (
              <polyline
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                points={baselinePolyline}
              />
            )}

            {/* Shaded Area under actual curve */}
            {areaPath && <path d={areaPath} fill="url(#amortAreaGrad)" />}

            {/* Actual Curve */}
            {actualPolyline && (
              <polyline
                fill="none"
                stroke="#087E8B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={actualPolyline}
              />
            )}

            {/* Active hover crosshair indicator */}
            {activePoint && (
              <g>
                <line
                  x1={toX(activePoint.period)}
                  y1={padTop}
                  x2={toX(activePoint.period)}
                  y2={padTop + plotH}
                  stroke="#163C43"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={toX(activePoint.period)}
                  cy={toY(activePoint.balance)}
                  r="4.5"
                  fill="#087E8B"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* X-axis labels */}
            <text
              x={padLeft}
              y={height - 8}
              className="text-[10px] fill-muted-foreground"
            >
              Start
            </text>
            <text
              x={width - padRight}
              y={height - 8}
              textAnchor="end"
              className="text-[10px] fill-muted-foreground"
            >
              {maxPeriod} payments
            </text>
          </svg>

          {/* Interactive Tooltip Card */}
          {activePoint && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-md bg-muted/60 px-3 py-1.5 text-xs">
              <span className="font-medium text-foreground">
                Payment #{activePoint.period} ({activePoint.date})
              </span>
              <div className="flex items-center gap-3 tabular-nums">
                <span className="text-muted-foreground">
                  Balance:{' '}
                  <strong className="text-foreground">
                    {formatCurrencyValue(activePoint.balance, currency)}
                  </strong>
                </span>
                <span className="text-muted-foreground">
                  Cumulative Principal:{' '}
                  <strong className="text-foreground">
                    {formatCurrencyValue(activePoint.cumulativePrincipal, currency)}
                  </strong>
                </span>
                <span className="text-muted-foreground">
                  Cumulative Interest:{' '}
                  <strong className="text-foreground">
                    {formatCurrencyValue(activePoint.cumulativeInterest, currency)}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

