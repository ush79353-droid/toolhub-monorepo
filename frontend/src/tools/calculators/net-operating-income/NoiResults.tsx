'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { NoiResult } from './types';

interface NoiResultsProps {
  result: NoiResult | null;
}

export function NoiResults({ result }: NoiResultsProps) {
  if (!result || !result.formattedNoi) return null;

  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 sm:px-4"
      aria-live="polite"
    >
      <h3 className="text-[13px] font-semibold text-accent">Result</h3>
      <dl className="mt-2.5 space-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Net operating income (NOI)</dt>
          <dd className="text-base font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedNoi}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Effective gross income</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedEffectiveGrossIncome}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Operating expenses</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedOperatingExpenses}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Potential gross income</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedPotentialGrossIncome}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Vacancy loss</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedVacancyLoss}
          </dd>
        </div>
        {result.formattedExpenseRatio !== null ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Operating expense ratio</dt>
            <dd className="font-semibold tabular-nums text-accent">
              {result.formattedExpenseRatio}%
            </dd>
          </div>
        ) : null}
        {result.formattedNoiMargin !== null ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">NOI margin</dt>
            <dd className="font-semibold tabular-nums text-accent">
              {result.formattedNoiMargin}%
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">
        Annual estimate. Debt service, depreciation, and income taxes are not
        included in standard property NOI.
      </p>
    </div>
  );
}
