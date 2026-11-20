'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { FinancialLeverageRatioResult } from './types';

interface FinancialLeverageRatioResultsProps {
  result: FinancialLeverageRatioResult | null;
}

export function FinancialLeverageRatioResults({
  result,
}: FinancialLeverageRatioResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const isZeroEquity = result.status === 'zeroEquity';
  const isNegativeEquity = result.status === 'negativeEquity';
  const isInconsistent = result.status === 'inconsistentBalanceSheet';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Financial leverage summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedTotalAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total equity</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedTotalEquity}
          </dd>
        </div>
        {result.formattedTotalLiabilities !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Implied liabilities</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedTotalLiabilities}
            </dd>
          </div>
        ) : null}
        {result.formattedEquityRatio !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Equity ratio</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedEquityRatio}%
            </dd>
          </div>
        ) : null}
        {result.formattedLiabilitiesToEquity !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Liabilities / equity</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedLiabilitiesToEquity}×
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Financial leverage</dt>
          <dd
            className={`font-semibold tabular-nums ${
              isZeroEquity || isNegativeEquity || isInconsistent
                ? 'text-rose-700'
                : 'text-accent'
            }`}
          >
            {result.formattedFinancialLeverage != null
              ? `${result.formattedFinancialLeverage}×`
              : 'Unavailable'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        FL = Total Assets / Total Equity (equity multiplier)
      </p>
      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            isZeroEquity || isNegativeEquity || isInconsistent
              ? 'text-rose-700'
              : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <a
          href="/tools/degree-of-operating-leverage-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Degree of Operating Leverage
        </a>
        .
      </p>
    </div>
  );
}
