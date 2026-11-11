import * as React from 'react';
import { formatCurrencyValue } from './calculation';
import type { LoanBalancePoint, SupportedCurrency } from './types';

interface LoanChartProps {
  principal: number;
  totalInterest: number;
  principalRatioPercent: number;
  interestRatioPercent: number;
  currency: SupportedCurrency;
  balanceCurve: LoanBalancePoint[];
  hasExtraPayments: boolean;
}

export function LoanChart({
  principal,
  totalInterest,
  principalRatioPercent,
  interestRatioPercent,
  currency,
  balanceCurve,
  hasExtraPayments,
}: LoanChartProps) {
  const total = principal + totalInterest;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const principalLength = total > 0 ? (principal / total) * circumference : circumference;
  const interestLength = Math.max(0, circumference - principalLength);

  // Build SVG path points for balance over time
  const width = 260;
  const height = 84;
  const padX = 6;
  const padY = 8;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;
  const maxPeriod =
    balanceCurve.length > 0 ? Math.max(1, balanceCurve[balanceCurve.length - 1].period) : 1;
  const maxBalance =
    balanceCurve.length > 0
      ? Math.max(
          1,
          ...balanceCurve.map((pt) => Math.max(pt.balance, pt.baselineBalance))
        )
      : Math.max(1, principal);

  const toX = (period: number) => padX + (period / maxPeriod) * plotW;
  const toY = (bal: number) => padY + plotH - (bal / maxBalance) * plotH;

  const actualPolyline = balanceCurve
    .map((pt) => `${toX(pt.period).toFixed(1)},${toY(pt.balance).toFixed(1)}`)
    .join(' ');

  const baselinePolyline = hasExtraPayments
    ? balanceCurve
        .map((pt) => `${toX(pt.period).toFixed(1)},${toY(pt.baselineBalance).toFixed(1)}`)
        .join(' ')
    : '';

  const areaPoints =
    balanceCurve.length > 0
      ? `${actualPolyline} ${toX(balanceCurve[balanceCurve.length - 1].period).toFixed(1)},${(padY + plotH).toFixed(1)} ${padX},${(padY + plotH).toFixed(1)}`
      : '';

  return (
    <div className="space-y-4 rounded-xl border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-accent">Principal vs. Total Interest</h3>
        <span className="text-xs font-normal text-muted-foreground tabular-nums">
          Total {formatCurrencyValue(total, currency)}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative mx-auto flex h-24 w-24 shrink-0 items-center justify-center sm:mx-0">
          <svg
            viewBox="0 0 110 110"
            className="h-24 w-24 -rotate-90"
            role="img"
            aria-label={`Loan composition: ${principalRatioPercent}% principal and ${interestRatioPercent}% interest`}
          >
            <title>Principal vs. Interest Breakdown</title>
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

          <dl className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/35 px-3 py-1.5">
              <dt className="flex items-center gap-2 font-normal text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-primary" aria-hidden="true" />
                <span>Principal ({principalRatioPercent.toFixed(1)}%)</span>
              </dt>
              <dd className="font-semibold text-accent tabular-nums">
                {formatCurrencyValue(principal, currency)}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/35 px-3 py-1.5">
              <dt className="flex items-center gap-2 font-normal text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-accent" aria-hidden="true" />
                <span>Interest ({interestRatioPercent.toFixed(1)}%)</span>
              </dt>
              <dd className="font-semibold text-accent tabular-nums">
                {formatCurrencyValue(totalInterest, currency)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {balanceCurve.length > 1 && (
        <div className="border-t border-border pt-3.5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-accent">Remaining Balance Over Time</span>
            {hasExtraPayments && (
              <span className="text-[11px] font-normal text-muted-foreground">
                Dashed: without extra payments
              </span>
            )}
          </div>
          <div className="rounded-lg border border-border bg-background/60 p-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-20 w-full overflow-visible"
              role="img"
              aria-label="Loan balance trajectory from start to end of term"
            >
              <line
                x1={padX}
                y1={padY + plotH}
                x2={width - padX}
                y2={padY + plotH}
                stroke="#DCE6E5"
                strokeWidth="1"
              />
              {baselinePolyline && (
                <polyline
                  fill="none"
                  stroke="#667477"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  points={baselinePolyline}
                />
              )}
              {areaPoints && <polygon fill="#D9F0EF" fillOpacity="0.65" points={areaPoints} />}
              <polyline
                fill="none"
                stroke="#087E8B"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={actualPolyline}
              />
            </svg>
            <div className="mt-1 flex items-center justify-between text-[11px] font-normal text-muted-foreground tabular-nums">
              <span>Start: {formatCurrencyValue(maxBalance, currency)}</span>
              <span>
                End:{' '}
                {formatCurrencyValue(balanceCurve[balanceCurve.length - 1]?.balance ?? 0, currency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

