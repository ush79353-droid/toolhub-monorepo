'use client';

import { useState } from 'react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { WorkingCapitalTurnoverRatioResult } from './types';

interface WorkingCapitalTurnoverRatioResultsProps {
  result: WorkingCapitalTurnoverRatioResult | null;
}

export function WorkingCapitalTurnoverRatioResults({
  result,
}: WorkingCapitalTurnoverRatioResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const warnTone =
    result.status === 'zeroAverageWc' ||
    result.status === 'negativeAverageWc';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Working capital turnover summary
      </h3>

      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average current assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAverageCurrentAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average current liabilities</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAverageCurrentLiabilities}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average working capital</dt>
          <dd className="tabular-nums font-medium text-accent">
            {symbol}
            {result.formattedAverageWorkingCapital}
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
          <dt className="font-medium text-accent">Working capital turnover</dt>
          <dd
            className={`font-semibold tabular-nums ${
              result.status === 'zeroAverageWc' ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {result.formattedWorkingCapitalTurnover != null
              ? `${result.formattedWorkingCapitalTurnover}x`
              : 'Unavailable'}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        WCT = Revenue / (Average CA − Average CL)
      </p>

      {result.warningMessage ? (
        <p
          className={`text-xs leading-relaxed ${
            warnTone ? 'text-rose-700' : 'text-amber-800'
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
          <span>Working Capital Turnover Breakdown</span>
          <span className="text-xs font-normal text-muted-foreground">
            {breakdownOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {breakdownOpen ? (
          <div className="space-y-2 border-t border-border px-3 py-3 font-mono text-[11px] leading-relaxed text-accent sm:text-xs">
            <p>
              ACA = ({result.formattedOpeningCurrentAssets} +{' '}
              {result.formattedClosingCurrentAssets}) / 2 ={' '}
              {result.formattedAverageCurrentAssets}
            </p>
            <p>
              ACL = ({result.formattedOpeningCurrentLiabilities} +{' '}
              {result.formattedClosingCurrentLiabilities}) / 2 ={' '}
              {result.formattedAverageCurrentLiabilities}
            </p>
            <p>
              AWC = {result.formattedAverageCurrentAssets} −{' '}
              {result.formattedAverageCurrentLiabilities} ={' '}
              {result.formattedAverageWorkingCapital}
            </p>
            {result.formattedRevenue !== null ? (
              <p>
                WCT = {result.formattedRevenue} /{' '}
                {result.formattedAverageWorkingCapital}
                {result.formattedWorkingCapitalTurnover != null
                  ? ` = ${result.formattedWorkingCapitalTurnover}x`
                  : ' → unavailable'}
              </p>
            ) : (
              <p className="font-sans text-muted-foreground">
                Enter revenue to complete the turnover calculation.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <a
          href="/tools/working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Working Capital
        </a>
        {' · '}
        <a
          href="/tools/current-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Ratio
        </a>
        {' · '}
        <a
          href="/tools/total-asset-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Total Asset Turnover
        </a>
        {' · '}
        <a
          href="/tools/inventory-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inventory Turnover
        </a>
        .
      </p>
    </div>
  );
}
