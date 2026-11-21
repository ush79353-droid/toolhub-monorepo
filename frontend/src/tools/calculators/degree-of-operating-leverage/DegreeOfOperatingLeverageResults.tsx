'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { DegreeOfOperatingLeverageResult } from './types';

interface DegreeOfOperatingLeverageResultsProps {
  result: DegreeOfOperatingLeverageResult | null;
}

export function DegreeOfOperatingLeverageResults({
  result,
}: DegreeOfOperatingLeverageResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Degree of operating leverage summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Method</dt>
          <dd className="text-accent">
            {result.method === 'contributionMargin'
              ? 'Contribution margin'
              : 'Period-to-period'}
          </dd>
        </div>
        {result.formattedSalesChangePercentage !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Change in sales</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedSalesChangePercentage}%
            </dd>
          </div>
        ) : null}
        {result.formattedEbitChangePercentage !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Change in EBIT</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedEbitChangePercentage}%
            </dd>
          </div>
        ) : null}
        {result.formattedContributionMargin !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Contribution margin</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedContributionMargin}
            </dd>
          </div>
        ) : null}
        {result.formattedOperatingIncome !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">EBIT</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedOperatingIncome}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Degree of operating leverage</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedDegreeOfOperatingLeverage}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        {result.method === 'contributionMargin'
          ? 'DOL = CM / EBIT'
          : 'DOL = %ΔEBIT / %ΔSales'}
      </p>
      {result.warningMessage ? (
        <p className="mt-2 text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
    </div>
  );
}
