'use client';

import Link from 'next/link';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { NetOperatingWorkingCapitalResult } from './types';

interface NetOperatingWorkingCapitalResultsProps {
  result: NetOperatingWorkingCapitalResult | null;
}

export function NetOperatingWorkingCapitalResults({
  result,
}: NetOperatingWorkingCapitalResultsProps) {
  const [open, setOpen] = useState(false);
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const negative = result.status === 'negativeNowc';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">NOWC summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Current operating assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedCurrentOperatingAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Current operating liabilities</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedCurrentOperatingLiabilities}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">NOWC</dt>
          <dd
            className={`font-semibold tabular-nums ${
              negative ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {symbol}
            {result.formattedNetOperatingWorkingCapital}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        NOWC = COA − COL
      </p>

      <div className="mt-3 rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-accent"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          NOWC calculation breakdown
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {open ? (
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
                  <td className="py-1 pr-2 text-muted-foreground">Inventories</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedInventories}
                  </td>
                </tr>
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2">Current operating assets</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedCurrentOperatingAssets}
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
                    Accrued expenses
                  </td>
                  <td className="py-1 text-right">
                    ({symbol}
                    {result.formattedAccruedExpenses})
                  </td>
                </tr>
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2">Current operating liabilities</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedCurrentOperatingLiabilities}
                  </td>
                </tr>
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2 text-accent">NOWC</td>
                  <td
                    className={`py-1 text-right ${
                      negative ? 'text-rose-700' : 'text-accent'
                    }`}
                  >
                    {symbol}
                    {result.formattedNetOperatingWorkingCapital}
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
        <Link
          href="/tools/net-operating-assets-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Operating Assets
        </Link>
        {' · '}
        <Link
          href="/tools/net-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Income
        </Link>
        .
      </p>
    </div>
  );
}
