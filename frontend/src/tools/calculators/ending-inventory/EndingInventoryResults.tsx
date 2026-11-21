'use client';

import Link from 'next/link';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { EndingInventoryResult } from './types';

interface EndingInventoryResultsProps {
  result: EndingInventoryResult | null;
}

export function EndingInventoryResults({
  result,
}: EndingInventoryResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const isNegative = result.status === 'negativeEndingInventory';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Ending inventory summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Starting inventory</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedStartingInventory}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Net purchases</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedNetPurchases}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">COGS</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedCostOfGoodsSold}
          </dd>
        </div>
        {!isNegative ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Average inventory</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedAverageInventory}
            </dd>
          </div>
        ) : null}
        {result.formattedInventoryTurnover !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Inventory turnover</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedInventoryTurnover} times
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Ending inventory</dt>
          <dd
            className={`font-semibold tabular-nums ${
              isNegative ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {symbol}
            {result.formattedEndingInventory}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        Ending = Starting + Net purchases − COGS
      </p>
      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            isNegative ? 'text-rose-700' : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}
      {!isNegative ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result.interpretation}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/dio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DIO
        </Link>
        .
      </p>
    </div>
  );
}
