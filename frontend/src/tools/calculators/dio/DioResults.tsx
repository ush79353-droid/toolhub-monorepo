'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { DioResult } from './types';

interface DioResultsProps {
  result: DioResult | null;
}

export function DioResults({ result }: DioResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Days inventory outstanding summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average inventory</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAverageInventory}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cost of goods sold</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedCostOfGoodsSold}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Accounting period</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedAccountingPeriodDays} days
          </dd>
        </div>
        {result.formattedInventoryTurnover !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Inventory turnover</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedInventoryTurnover}× / period
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">DIO</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedDaysInventoryOutstanding} days
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        DIO = (Average inventory / COGS) × T
      </p>
      {result.warningMessage ? (
        <p className="mt-2 text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        DIO is one component of the cash conversion cycle: CCC = DIO + DSO − DPO.
        See the{' '}
        <a
          href="/tools/cash-conversion-cycle-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Conversion Cycle Calculator
        </a>{' '}
        for the full working-capital cycle.
      </p>
    </div>
  );
}
