'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';

interface EmiChartProps {
  principal: number;
  totalInterest: number;
  principalRatioPercent: number;
  interestRatioPercent: number;
  currency: SupportedCurrency;
}

export function EmiChart({
  principal,
  totalInterest,
  principalRatioPercent,
  interestRatioPercent,
  currency,
}: EmiChartProps) {
  const total = principal + totalInterest;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const principalLength =
    total > 0 ? (principal / total) * circumference : circumference;
  const interestLength = Math.max(0, circumference - principalLength);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-accent">
          Principal vs. Interest
        </h3>
        <span className="text-xs tabular-nums text-muted-foreground">
          Total {formatCurrencyValue(total, currency)}
        </span>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative mx-auto flex h-24 w-24 shrink-0 items-center justify-center sm:mx-0">
          <svg
            viewBox="0 0 110 110"
            className="h-24 w-24 -rotate-90"
            role="img"
            aria-label={`Loan composition: ${principalRatioPercent.toFixed(1)}% principal and ${interestRatioPercent.toFixed(1)}% interest`}
          >
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="14"
              strokeDasharray={`${principalLength} ${interestLength}`}
              strokeDashoffset="0"
            />
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-rose-400"
              strokeWidth="14"
              strokeDasharray={`${interestLength} ${principalLength}`}
              strokeDashoffset={-principalLength}
            />
          </svg>
        </div>
        <ul className="space-y-2 text-xs text-accent">
          <li className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Principal
            </span>
            <span className="tabular-nums font-medium">
              {formatCurrencyValue(principal, currency)} (
              {principalRatioPercent.toFixed(1)}%)
            </span>
          </li>
          <li className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              Interest
            </span>
            <span className="tabular-nums font-medium">
              {formatCurrencyValue(totalInterest, currency)} (
              {interestRatioPercent.toFixed(1)}%)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
