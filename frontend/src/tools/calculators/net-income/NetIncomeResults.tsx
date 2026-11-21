'use client';

import Link from 'next/link';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { NetIncomeResult } from './types';

interface NetIncomeResultsProps {
  result: NetIncomeResult | null;
}

export function NetIncomeResults({ result }: NetIncomeResultsProps) {
  const [open, setOpen] = useState(false);
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const loss = result.netIncomeAfterTaxes < 0;

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Income summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Gross profit</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedGrossProfit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Operating income</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedOperatingIncome}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">EBT</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedEarningsBeforeTax}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total taxes</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedTotalTaxes}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Net income after taxes</dt>
          <dd
            className={`font-semibold tabular-nums ${
              loss ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {symbol}
            {result.formattedNetIncomeAfterTaxes}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Net profit margin</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedNetProfitMargin ?? 'Unavailable'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        NI = Rev − COGS − OpEx − Interest − Taxes
      </p>

      <div className="mt-3 rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-accent"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Net income breakdown
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
                  <td className="py-1 pr-2 text-muted-foreground">Revenue</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedRevenue}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Cost of sales
                  </td>
                  <td className="py-1 text-right">
                    ({symbol}
                    {result.formattedCostOfSales})
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 font-medium">Gross profit</td>
                  <td className="py-1 text-right font-medium">
                    {symbol}
                    {result.formattedGrossProfit}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Operating expenses
                  </td>
                  <td className="py-1 text-right">
                    ({symbol}
                    {result.formattedOperatingExpenses})
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 font-medium">Operating income</td>
                  <td className="py-1 text-right font-medium">
                    {symbol}
                    {result.formattedOperatingIncome}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">Interest</td>
                  <td className="py-1 text-right">
                    ({symbol}
                    {result.formattedInterest})
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 font-medium">Earnings before tax</td>
                  <td className="py-1 text-right font-medium">
                    {symbol}
                    {result.formattedEarningsBeforeTax}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Income taxes
                  </td>
                  <td className="py-1 text-right">
                    ({symbol}
                    {result.formattedTotalTaxes})
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 font-semibold text-accent">
                    Net income
                  </td>
                  <td
                    className={`py-1 text-right font-semibold ${
                      loss ? 'text-rose-700' : 'text-accent'
                    }`}
                  >
                    {symbol}
                    {result.formattedNetIncomeAfterTaxes}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

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
          href="/tools/ebt-calculator-earnings-before-tax"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBT
        </Link>
        {' · '}
        <Link
          href="/tools/net-operating-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Operating Income
        </Link>
        .
      </p>
    </div>
  );
}
