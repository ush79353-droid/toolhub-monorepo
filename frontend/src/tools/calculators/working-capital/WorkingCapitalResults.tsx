'use client';

import Link from 'next/link';

import { useState } from 'react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { WorkingCapitalResult } from './types';

interface WorkingCapitalResultsProps {
  result: WorkingCapitalResult | null;
}

export function WorkingCapitalResults({ result }: WorkingCapitalResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const warnTone =
    result.status === 'zeroLiabilities' ||
    result.status === 'zeroAverageWc' ||
    result.status === 'negativeAverageWc';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Working capital summary
      </h3>

      <dl className="space-y-1.5 text-sm">
        {result.formattedWorkingCapital !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Working capital</dt>
            <dd className="tabular-nums font-medium text-accent">
              {symbol}
              {result.formattedWorkingCapital}
            </dd>
          </div>
        ) : null}
        {result.formattedWorkingCapitalRatio !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Working capital ratio</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedWorkingCapitalRatio}
            </dd>
          </div>
        ) : null}
        {result.formattedBeginningWorkingCapital !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Beginning WC</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedBeginningWorkingCapital}
            </dd>
          </div>
        ) : null}
        {result.formattedEndingWorkingCapital !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Ending WC</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedEndingWorkingCapital}
            </dd>
          </div>
        ) : null}
        {result.formattedAverageWorkingCapital !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Average WC</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedAverageWorkingCapital}
            </dd>
          </div>
        ) : null}
        {result.formattedChangeInWorkingCapital !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Change in WC</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedChangeInWorkingCapital}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">WC turnover</dt>
          <dd
            className={`font-semibold tabular-nums ${
              result.status === 'zeroAverageWc' ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {result.formattedWorkingCapitalTurnoverRatio != null
              ? `${result.formattedWorkingCapitalTurnoverRatio}x`
              : 'Unavailable'}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        WC = CA − CL · Ratio = CA / CL · Turnover = Revenue / Avg WC
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
          <span>Working Capital Calculation Breakdown</span>
          <span className="text-xs font-normal text-muted-foreground">
            {breakdownOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {breakdownOpen ? (
          <div className="space-y-2 border-t border-border px-3 py-3 text-xs leading-relaxed text-accent sm:text-sm">
            {result.formattedWorkingCapital !== null ? (
              <p className="font-mono text-[11px] sm:text-xs">
                WC = {result.formattedCurrentAssets} −{' '}
                {result.formattedCurrentLiabilities} ={' '}
                {result.formattedWorkingCapital}
                {result.formattedWorkingCapitalRatio != null
                  ? ` · Ratio = ${result.formattedWorkingCapitalRatio}`
                  : ''}
              </p>
            ) : null}
            {result.formattedAverageWorkingCapital !== null ? (
              <p className="font-mono text-[11px] sm:text-xs">
                Beg WC = {result.formattedBeginningWorkingCapital} · End WC ={' '}
                {result.formattedEndingWorkingCapital}
                <br />
                Avg WC = {result.formattedAverageWorkingCapital}
                {result.formattedChangeInWorkingCapital != null
                  ? ` · ΔWC = ${result.formattedChangeInWorkingCapital}`
                  : ''}
                {result.formattedWorkingCapitalTurnoverRatio != null
                  ? ` · Turnover = ${result.formattedWorkingCapitalTurnoverRatio}x`
                  : ''}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Expand turnover inputs to compute beginning/ending WC, average,
                change, and turnover.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/current-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/net-operating-working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Operating Working Capital
        </Link>
        {' · '}
        <Link
          href="/tools/total-asset-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Total Asset Turnover
        </Link>
        {' · '}
        <Link
          href="/tools/inventory-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inventory Turnover
        </Link>
        .
      </p>
    </div>
  );
}
