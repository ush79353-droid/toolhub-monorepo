'use client';

import Link from 'next/link';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { ReceivablesTurnoverResult } from './types';

interface ReceivablesTurnoverRatioResultsProps {
  result: ReceivablesTurnoverResult | null;
}

export function ReceivablesTurnoverRatioResults({
  result,
}: ReceivablesTurnoverRatioResultsProps) {
  const [open, setOpen] = useState(false);
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const undefinedTurnover = result.status === 'undefinedTurnover';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Turnover summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average accounts receivable</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAverageAR}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Receivables turnover</dt>
          <dd
            className={`font-semibold tabular-nums ${
              undefinedTurnover ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {undefinedTurnover
              ? 'Undefined'
              : result.formattedTurnoverRatio
                ? `${result.formattedTurnoverRatio} times`
                : '—'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        RTR = Net Credit Sales ÷ Average AR
      </p>

      <div className="mt-3 rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-accent"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Calculation breakdown
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
                  <td className="py-1 pr-2 text-muted-foreground">
                    Net credit sales
                  </td>
                  <td className="py-1 text-right">
                    {result.formattedNetCreditSales
                      ? `${symbol}${result.formattedNetCreditSales}`
                      : '—'}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Opening AR
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedOpeningAR}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Closing AR
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedClosingAR}
                  </td>
                </tr>
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2">Average AR</td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedAverageAR}
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-1 pr-2">Turnover ratio</td>
                  <td
                    className={`py-1 text-right ${
                      undefinedTurnover ? 'text-rose-700' : ''
                    }`}
                  >
                    {undefinedTurnover
                      ? 'Undefined'
                      : result.formattedTurnoverRatio
                        ? `${result.formattedTurnoverRatio} times`
                        : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              Avg AR = (Opening + Closing) / 2
              <br />
              RTR = Net Credit Sales / Avg AR
            </p>
          </div>
        ) : null}
      </div>

      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            undefinedTurnover ? 'text-rose-700' : 'text-muted-foreground'
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
          href="/tools/dso-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DSO Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/inventory-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inventory Turnover
        </Link>
        .
      </p>
    </div>
  );
}
