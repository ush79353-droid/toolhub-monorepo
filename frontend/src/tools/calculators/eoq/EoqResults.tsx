'use client';

import Link from 'next/link';

import { getCurrencySymbol } from '@/tools/shared/currency';
import { INVENTORY_UNITS, type EoqResult } from './types';

interface EoqResultsProps {
  result: EoqResult | null;
}

export function EoqResults({ result }: EoqResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const unit =
    INVENTORY_UNITS.find((u) => u.value === result.inventoryUnit)?.label ??
    'units';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">EOQ summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2 border-b border-border pb-1.5">
          <dt className="font-medium text-accent">Economic order quantity</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedEconomicOrderQuantity} {unit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Practical whole-unit EOQ</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedPracticalOrderQuantity} {unit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average cycle inventory</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedAverageCycleInventory} {unit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Orders per year</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedOrdersPerYear}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Days between orders</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedDaysBetweenOrders} days
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Annual ordering cost</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAnnualOrderingCost}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Annual holding cost</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAnnualHoldingCost}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total variable inventory cost</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedTotalAnnualVariableCost}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        EOQ = √(2 × D × S / H)
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
        Related:{' '}
        <Link
          href="/tools/ending-inventory-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Ending Inventory
        </Link>
        ,{' '}
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
