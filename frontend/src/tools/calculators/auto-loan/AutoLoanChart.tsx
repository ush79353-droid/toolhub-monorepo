import * as React from 'react';
import { formatCurrencyValue } from './calculation';
import type { SupportedCurrency } from './types';

interface AutoLoanChartProps {
  principal: number;
  totalInterest: number;
  principalRatioPercent: number;
  interestRatioPercent: number;
  currency: SupportedCurrency;
}

export function AutoLoanChart({
  principal,
  totalInterest,
  principalRatioPercent,
  interestRatioPercent,
  currency,
}: AutoLoanChartProps) {
  const total = principal + totalInterest;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const principalLength = total > 0 ? (principal / total) * circumference : circumference;
  const interestLength = Math.max(0, circumference - principalLength);

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
          Principal vs. Total Interest
        </h4>
        <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
          Total {formatCurrencyValue(total, currency)}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center sm:mx-0">
          <svg
            viewBox="0 0 120 120"
            className="h-28 w-28 -rotate-90"
            role="img"
            aria-label={`Loan composition: ${principalRatioPercent}% principal and ${interestRatioPercent}% interest`}
          >
            <title>Principal vs. Interest Breakdown</title>
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#D9F0EF"
              strokeWidth="15"
            />
            {interestLength > 0 && (
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#163C43"
                strokeWidth="15"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={0}
              />
            )}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#087E8B"
              strokeWidth="15"
              strokeDasharray={`${principalLength} ${circumference}`}
              strokeDashoffset={0}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Principal
            </span>
            <span className="text-sm font-extrabold text-accent tabular-nums">
              {principalRatioPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          <div
            className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary"
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
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/35 px-2.5 py-1.5">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-primary" aria-hidden="true" />
                <span>Principal ({principalRatioPercent.toFixed(1)}%)</span>
              </dt>
              <dd className="font-bold text-accent tabular-nums">
                {formatCurrencyValue(principal, currency)}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/35 px-2.5 py-1.5">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-accent" aria-hidden="true" />
                <span>Interest ({interestRatioPercent.toFixed(1)}%)</span>
              </dt>
              <dd className="font-bold text-accent tabular-nums">
                {formatCurrencyValue(totalInterest, currency)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
