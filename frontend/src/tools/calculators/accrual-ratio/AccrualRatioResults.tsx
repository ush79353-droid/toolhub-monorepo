'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { AccrualRatioResult } from './types';

interface AccrualRatioResultsProps {
  result: AccrualRatioResult | null;
}

export function AccrualRatioResults({ result }: AccrualRatioResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const methodLabel =
    result.method === 'balanceSheet'
      ? 'Balance sheet accrual ratio'
      : 'Cash flow accrual ratio';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Accrual ratio</h3>
      <p className="mt-1 text-xs text-muted-foreground">{methodLabel}</p>

      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Beginning NOA</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedBeginningNOA}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Ending NOA</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedEndingNOA}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average NOA</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAverageNOA}
          </dd>
        </div>
        {result.method === 'balanceSheet' ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Change in NOA</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedChangeInNOA}
            </dd>
          </div>
        ) : (
          <>
            {result.formattedNetIncome !== null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Net income</dt>
                <dd className="tabular-nums text-accent">
                  {symbol}
                  {result.formattedNetIncome}
                </dd>
              </div>
            ) : null}
            {result.formattedOperatingCashFlow !== null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Operating cash flow</dt>
                <dd className="tabular-nums text-accent">
                  {symbol}
                  {result.formattedOperatingCashFlow}
                </dd>
              </div>
            ) : null}
            {result.formattedCashFlowAccruals !== null ? (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Cash flow accruals</dt>
                <dd className="tabular-nums text-accent">
                  {symbol}
                  {result.formattedCashFlowAccruals}
                </dd>
              </div>
            ) : null}
          </>
        )}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Accrual ratio</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedAccrualRatioPercent !== null
              ? `${result.formattedAccrualRatioPercent}%`
              : 'Unavailable'}
          </dd>
        </div>
        {result.accrualRatio !== null ? (
          <div className="flex justify-between gap-2 text-xs text-muted-foreground">
            <dt>Decimal ratio</dt>
            <dd className="tabular-nums">{result.accrualRatio.toFixed(6)}</dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
    </div>
  );
}
