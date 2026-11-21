'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { NetOperatingAssetsResult } from './types';

interface NetOperatingAssetsResultsProps {
  result: NetOperatingAssetsResult | null;
}

export function NetOperatingAssetsResults({
  result,
}: NetOperatingAssetsResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const negative = result.status === 'negativeNoa';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">NOA summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Operating assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedOperatingAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Operating liabilities</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedOperatingLiabilities}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Net operating assets</dt>
          <dd
            className={`font-semibold tabular-nums ${
              negative ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {symbol}
            {result.formattedNetOperatingAssets}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        NOA = Operating Assets − Operating Liabilities
      </p>

      <div className="mt-3 rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-accent"
          aria-expanded={breakdownOpen}
          onClick={() => setBreakdownOpen((o) => !o)}
        >
          NOA calculation breakdown
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${
              breakdownOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {breakdownOpen ? (
          <div className="overflow-x-auto border-t border-border px-3 py-2">
            <table className="w-full min-w-[16rem] text-left text-xs">
              <tbody className="tabular-nums text-accent">
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">Cash</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedCash}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Accounts receivable
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedAccountsReceivable}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">Inventory</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedInventory}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Prepaid expenses
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedPrepaidExpenses}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Fixed assets
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedFixedAssets}
                  </td>
                </tr>
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2">Total operating assets</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedOperatingAssets}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Accounts payable
                  </td>
                  <td className="py-1 text-right">
                    ({symbol}
                    {result.formattedAccountsPayable})
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Accrued operating expenses
                  </td>
                  <td className="py-1 text-right">
                    ({symbol}
                    {result.formattedAccruedOperatingExpenses})
                  </td>
                </tr>
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2">Total operating liabilities</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedOperatingLiabilities}
                  </td>
                </tr>
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2">Net operating assets</td>
                  <td
                    className={`py-1 text-right ${negative ? 'text-rose-700' : ''}`}
                  >
                    {symbol}
                    {result.formattedNetOperatingAssets}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            negative ? 'text-rose-700' : 'text-amber-800'
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
          href="/tools/net-operating-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Operating Income
        </a>
        {' · '}
        <a
          href="/tools/accrual-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Accrual Ratio
        </a>
        .
      </p>
    </div>
  );
}
