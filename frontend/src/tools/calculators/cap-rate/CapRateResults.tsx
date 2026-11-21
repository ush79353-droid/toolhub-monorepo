'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { CapRateResult } from './types';

interface CapRateResultsProps {
  result: CapRateResult | null;
}

export function CapRateResults({ result }: CapRateResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const hasPrimary = Boolean(result.formattedNoi);
  const hasReverse = Boolean(result.formattedEstimatedPropertyValue);
  const hasRequired = Boolean(result.formattedRequiredAnnualNoi);

  if (!hasPrimary && !hasReverse && !hasRequired) return null;

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h3 className="text-[13px] font-semibold text-accent">Results</h3>
      <dl className="mt-2.5 space-y-2 text-sm">
        {result.formattedCapRate !== null ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Capitalization rate</dt>
            <dd className="text-base font-semibold tabular-nums text-accent">
              {result.formattedCapRate}%
            </dd>
          </div>
        ) : null}
        {hasPrimary ? (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">Annual NOI</dt>
              <dd className="font-semibold tabular-nums text-accent">
                {symbol}
                {result.formattedNoi}
              </dd>
            </div>
            {result.formattedEffectiveGrossIncome ? (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Effective gross income</dt>
                <dd className="font-semibold tabular-nums text-accent">
                  {symbol}
                  {result.formattedEffectiveGrossIncome}
                </dd>
              </div>
            ) : null}
            {result.formattedExpenseRatio !== null ? (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Operating expense ratio</dt>
                <dd className="font-semibold tabular-nums text-accent">
                  {result.formattedExpenseRatio}%
                </dd>
              </div>
            ) : null}
          </>
        ) : null}
        {hasReverse ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Estimated property value</dt>
            <dd className="font-semibold tabular-nums text-accent">
              {symbol}
              {result.formattedEstimatedPropertyValue}
            </dd>
          </div>
        ) : null}
        {hasRequired ? (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">Required annual NOI</dt>
              <dd className="font-semibold tabular-nums text-accent">
                {symbol}
                {result.formattedRequiredAnnualNoi}
              </dd>
            </div>
            {result.formattedRequiredMonthlyNoi ? (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Required monthly NOI</dt>
                <dd className="font-semibold tabular-nums text-accent">
                  {symbol}
                  {result.formattedRequiredMonthlyNoi}
                </dd>
              </div>
            ) : null}
          </>
        ) : null}
      </dl>
    </div>
  );
}
