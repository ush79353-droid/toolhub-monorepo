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
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const principalLength = total > 0 ? (principal / total) * circumference : circumference;
  const interestLength = Math.max(0, circumference - principalLength);

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Accessible SVG Donut Breakdown */}
        <div className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center sm:mx-0">
          <svg
            viewBox="0 0 140 140"
            className="h-36 w-36 -rotate-90"
            role="img"
            aria-label={`Loan payment composition: ${principalRatioPercent}% principal and ${interestRatioPercent}% interest`}
          >
            <title>Principal vs. Interest Breakdown</title>
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#D9F0EF"
              strokeWidth="18"
            />
            {interestLength > 0 && (
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#163C43"
                strokeWidth="18"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={0}
              />
            )}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#087E8B"
              strokeWidth="18"
              strokeDasharray={`${principalLength} ${circumference}`}
              strokeDashoffset={0}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Principal
            </span>
            <span className="text-lg font-extrabold text-accent tabular-nums">
              {principalRatioPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Readable Text Summary & Horizontal Stacked Bar */}
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="text-sm font-bold text-accent">Principal vs. Total Interest</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Of your {formatCurrencyValue(total, currency)} in scheduled loan payments,{' '}
              <strong className="text-accent">
                {formatCurrencyValue(principal, currency)} ({principalRatioPercent.toFixed(1)}%)
              </strong>{' '}
              pays down financed principal and{' '}
              <strong className="text-accent">
                {formatCurrencyValue(totalInterest, currency)} ({interestRatioPercent.toFixed(1)}%)
              </strong>{' '}
              goes to interest charges.
            </p>
          </div>

          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-secondary"
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

          <dl className="grid grid-cols-1 gap-2 pt-1 text-xs sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-primary" />
                <span>Principal</span>
              </dt>
              <dd className="font-bold text-accent tabular-nums">
                {formatCurrencyValue(principal, currency)}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-accent" />
                <span>Total Interest</span>
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

