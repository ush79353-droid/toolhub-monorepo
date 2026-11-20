'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { CashConversionCycleResult } from './types';

interface CashConversionCycleResultsProps {
  result: CashConversionCycleResult | null;
}

export function CashConversionCycleResults({
  result,
}: CashConversionCycleResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Cash conversion cycle summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Period</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedPeriodDays} days
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Accounts receivable days (DSO)</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedAccountsReceivableDays} days
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Inventory days (DIO)</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedInventoryDays} days
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Accounts payable days (DPO)</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedAccountsPayableDays} days
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Operating cycle</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedOperatingCycle} days
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Cash conversion cycle</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedCashConversionCycle} days
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        CCC = DIO + DSO − DPO
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Avg inv {symbol}
        {result.formattedAverageInventory} · Avg AR {symbol}
        {result.formattedAverageAccountsReceivable} · Avg AP {symbol}
        {result.formattedAverageAccountsPayable}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
    </div>
  );
}
