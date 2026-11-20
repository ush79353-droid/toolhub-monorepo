'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatLifoMoney } from './calculation';
import type { LifoInventoryResult } from './types';

interface LifoInventoryResultsProps {
  result: LifoInventoryResult | null;
}

export function LifoInventoryResults({ result }: LifoInventoryResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const zeroRev = result.status === 'zeroRevenue';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">LIFO summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Available units</dt>
          <dd className="tabular-nums text-accent">
            {result.totalAvailableUnits}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total purchase cost</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedTotalPurchaseCost}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">LIFO COGS</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedLifoCogs}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Ending inventory</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedEndingInventory}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Revenue</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedRevenue}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Gross profit</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedGrossProfit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Gross margin</dt>
          <dd
            className={`tabular-nums ${zeroRev ? 'text-rose-700' : 'text-accent'}`}
          >
            {result.formattedGrossProfitMargin != null
              ? `${result.formattedGrossProfitMargin}%`
              : 'Unavailable'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        LIFO: newest batch → COGS first · COGS + Ending = Purchases
      </p>

      <div className="mt-3 rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-accent"
          aria-expanded={breakdownOpen}
          onClick={() => setBreakdownOpen((o) => !o)}
        >
          LIFO inventory breakdown
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${
              breakdownOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {breakdownOpen ? (
          <div className="overflow-x-auto border-t border-border px-3 py-2">
            <table className="w-full min-w-[28rem] text-left text-xs">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="py-1 pr-2 font-medium">Layer</th>
                  <th className="py-1 pr-2 font-medium">Purchased</th>
                  <th className="py-1 pr-2 font-medium">Sold</th>
                  <th className="py-1 pr-2 font-medium">Remaining</th>
                  <th className="py-1 font-medium">Unit cost</th>
                </tr>
              </thead>
              <tbody>
                {result.layers.map((layer) => (
                  <tr key={layer.label} className="tabular-nums text-accent">
                    <td className="py-1 pr-2">{layer.label}</td>
                    <td className="py-1 pr-2">{layer.purchased}</td>
                    <td className="py-1 pr-2">{layer.sold}</td>
                    <td className="py-1 pr-2">{layer.remaining}</td>
                    <td className="py-1">
                      {symbol}
                      {formatLifoMoney(layer.unitCost, result.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            zeroRev ? 'text-rose-700' : 'text-amber-800'
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
          href="/tools/fifo-calculator-for-inventory"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FIFO Calculator
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
