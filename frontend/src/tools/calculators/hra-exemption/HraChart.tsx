'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';

interface HraChartProps {
  actualHRA: number;
  exemptHRA: number;
  taxableHRA: number;
  currency: SupportedCurrency;
}

export function HraChart({
  actualHRA,
  exemptHRA,
  taxableHRA,
  currency,
}: HraChartProps) {
  const total = actualHRA > 0 ? actualHRA : exemptHRA + taxableHRA;
  if (total <= 0) return null;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const exemptLen = (exemptHRA / total) * circumference;
  const taxableLen = Math.max(0, circumference - exemptLen);
  const exemptPct = (exemptHRA / total) * 100;
  const taxablePct = (taxableHRA / total) * 100;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-accent">
          HRA: Exempt vs Taxable
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
            aria-label={`HRA composition: ${exemptPct.toFixed(1)}% exempt and ${taxablePct.toFixed(1)}% taxable`}
          >
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="14"
              strokeDasharray={`${exemptLen} ${taxableLen}`}
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
              strokeDasharray={`${taxableLen} ${exemptLen}`}
              strokeDashoffset={-exemptLen}
            />
          </svg>
        </div>
        <ul className="space-y-2 text-xs text-accent">
          <li className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Tax-free HRA
            </span>
            <span className="tabular-nums font-medium">
              {formatCurrencyValue(exemptHRA, currency)} (
              {exemptPct.toFixed(1)}%)
            </span>
          </li>
          <li className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              Taxable HRA
            </span>
            <span className="tabular-nums font-medium">
              {formatCurrencyValue(taxableHRA, currency)} (
              {taxablePct.toFixed(1)}%)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
