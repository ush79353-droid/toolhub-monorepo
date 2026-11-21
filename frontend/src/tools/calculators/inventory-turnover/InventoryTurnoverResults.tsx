'use client';

import Link from 'next/link';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { InventoryTurnoverResult } from './types';

interface InventoryTurnoverResultsProps {
  result: InventoryTurnoverResult | null;
}

export function InventoryTurnoverResults({
  result,
}: InventoryTurnoverResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const warn =
    result.status === 'zeroAverageInventory' ||
    result.status === 'zeroCOGS' ||
    result.status === 'undefinedTurnover';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Inventory turnover summary
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
          <dt className="text-muted-foreground">Inventory turnover</dt>
          <dd
            className={`tabular-nums ${warn ? 'text-rose-700' : 'text-accent'}`}
          >
            {result.formattedInventoryTurnover != null
              ? `${result.formattedInventoryTurnover}×`
              : 'Unavailable'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Inventory days</dt>
          <dd
            className={`font-semibold tabular-nums ${
              warn ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {result.formattedInventoryDays != null
              ? `${result.formattedInventoryDays} days`
              : 'Unavailable'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        Turnover = COGS / Avg Inventory · Days = (Avg / COGS) × Period
      </p>
      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            warn ? 'text-rose-700' : 'text-amber-800'
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
        <Link
          href="/tools/dio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DIO Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/cash-conversion-cycle-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Conversion Cycle
        </Link>
        .
      </p>
    </div>
  );
}
