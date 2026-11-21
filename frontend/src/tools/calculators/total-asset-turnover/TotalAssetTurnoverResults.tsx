'use client';

import { useState } from 'react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { TotalAssetTurnoverResult } from './types';

interface TotalAssetTurnoverResultsProps {
  result: TotalAssetTurnoverResult | null;
}

export function TotalAssetTurnoverResults({
  result,
}: TotalAssetTurnoverResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const isZeroAvg = result.status === 'zeroAverageAssets';
  const hasTurnover = result.formattedTotalAssetTurnover != null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Total asset turnover summary
      </h3>
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Beginning assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedBeginningAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Ending assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedEndingAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAverageAssets}
          </dd>
        </div>
        {result.formattedRevenue !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Revenue</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedRevenue}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Total asset turnover</dt>
          <dd
            className={`font-semibold tabular-nums ${
              isZeroAvg ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {hasTurnover
              ? `${result.formattedTotalAssetTurnover}x`
              : 'Unavailable'}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        TAT = Revenue / Average Total Assets
      </p>

      {result.warningMessage ? (
        <p
          className={`text-xs leading-relaxed ${
            isZeroAvg ? 'text-rose-700' : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <div className="rounded-lg border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
          aria-expanded={breakdownOpen}
          onClick={() => setBreakdownOpen((o) => !o)}
        >
          <span>Total Asset Turnover Calculation Breakdown</span>
          <span className="text-xs font-normal text-muted-foreground">
            {breakdownOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {breakdownOpen ? (
          <div className="space-y-2 border-t border-border px-3 py-3 text-xs leading-relaxed text-accent sm:text-sm">
            <p className="font-mono text-[11px] sm:text-xs">
              Step 1: Average Assets = (Beginning + Ending) / 2
              <br />
              = ({result.formattedBeginningAssets} + {result.formattedEndingAssets})
              / 2 = {result.formattedAverageAssets}
            </p>
            {result.formattedRevenue !== null ? (
              <p className="font-mono text-[11px] sm:text-xs">
                Step 2: Asset Turnover = Revenue / Average Assets
                <br />
                = {result.formattedRevenue} / {result.formattedAverageAssets}
                {hasTurnover
                  ? ` = ${result.formattedTotalAssetTurnover}…`
                  : ' → unavailable'}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Enter revenue to complete the turnover calculation.
              </p>
            )}
            {hasTurnover ? (
              <p className="font-mono text-[11px] sm:text-xs">
                Step 3: Display = {result.formattedTotalAssetTurnover}x
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <a
          href="/tools/fixed-asset-turnover-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fixed Asset Turnover
        </a>
        {' · '}
        <a
          href="/tools/inventory-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inventory Turnover
        </a>
        {' · '}
        <a
          href="/tools/receivables-turnover-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Receivables Turnover
        </a>
        {' · '}
        <a
          href="/tools/financial-leverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Financial Leverage
        </a>
        .
      </p>
    </div>
  );
}
