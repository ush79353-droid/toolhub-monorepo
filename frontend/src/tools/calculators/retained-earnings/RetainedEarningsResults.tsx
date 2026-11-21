'use client';

import Link from 'next/link';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { RetainedEarningsResult } from './types';

interface RetainedEarningsResultsProps {
  result: RetainedEarningsResult | null;
}

export function RetainedEarningsResults({
  result,
}: RetainedEarningsResultsProps) {
  const [open, setOpen] = useState(false);
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const negative = result.retainedEarnings < 0;

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Retained earnings summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Dividends distributed</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedDividends}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Retention ratio</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedRetentionRatio}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Retained earnings</dt>
          <dd
            className={`font-semibold tabular-nums ${
              negative ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {symbol}
            {result.formattedRetainedEarnings}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Per share</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedRetainedEarningsPerShare
              ? `${symbol}${result.formattedRetainedEarningsPerShare}/share`
              : '—'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        RE = Earnings − Dividends
      </p>

      <div className="mt-3 rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-accent"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Retained earnings calculation breakdown
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
                  <td className="py-1 pr-2 text-muted-foreground">Earnings</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedEarnings}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Dividend payout ratio
                  </td>
                  <td className="py-1 text-right">
                    {result.formattedPayoutRatio}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">Dividends</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedDividends}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Retention ratio
                  </td>
                  <td className="py-1 text-right">
                    {result.formattedRetentionRatio}
                  </td>
                </tr>
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2">Retained earnings</td>
                  <td
                    className={`py-1 text-right ${
                      negative ? 'text-rose-700' : ''
                    }`}
                  >
                    {symbol}
                    {result.formattedRetainedEarnings}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">Shares</td>
                  <td className="py-1 text-right">
                    {result.formattedShares ?? '—'}
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-1 pr-2">RE per share</td>
                  <td className="py-1 text-right">
                    {result.formattedRetainedEarningsPerShare
                      ? `${symbol}${result.formattedRetainedEarningsPerShare}`
                      : '—'}
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
            result.status === 'payoutAbove100'
              ? 'text-amber-800'
              : 'text-muted-foreground'
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
