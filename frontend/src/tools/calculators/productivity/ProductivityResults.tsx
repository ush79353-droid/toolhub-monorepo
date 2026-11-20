'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { ProductivityResult } from './types';

interface ProductivityResultsProps {
  result: ProductivityResult | null;
}

export function ProductivityResults({ result }: ProductivityResultsProps) {
  const [open, setOpen] = useState(false);
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Productivity summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Revenue</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedRevenue}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Revenue per employee</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedRevenuePerEmployee
              ? `${symbol}${result.formattedRevenuePerEmployee}`
              : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Revenue per working hour</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedRevenuePerWorkingHour
              ? `${symbol}${result.formattedRevenuePerWorkingHour}/hour`
              : '—'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        RPE = Revenue ÷ Employees · RPH = Revenue ÷ Hours
      </p>

      {result.employeeUnavailableReason ? (
        <p className="mt-2 text-xs text-amber-800" role="status">
          {result.employeeUnavailableReason}
        </p>
      ) : null}
      {result.hourlyUnavailableReason ? (
        <p className="mt-2 text-xs text-amber-800" role="status">
          {result.hourlyUnavailableReason}
        </p>
      ) : null}

      <div className="mt-3 rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-accent"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Productivity calculation breakdown
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
                  <td className="py-1 pr-2 text-muted-foreground">Employees</td>
                  <td className="py-1 text-right">
                    {result.formattedEmployees ?? '—'}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Working time entered
                  </td>
                  <td className="py-1 text-right">
                    {result.formattedWorkingTimeEntered
                      ? `${result.formattedWorkingTimeEntered} ${result.workingHoursUnit}`
                      : '—'}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Converted hours
                  </td>
                  <td className="py-1 text-right">
                    {result.formattedTotalWorkingHours
                      ? `${result.formattedTotalWorkingHours} hours`
                      : '—'}
                  </td>
                </tr>
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2">Revenue per employee</td>
                  <td className="py-1 text-right">
                    {result.formattedRevenuePerEmployee
                      ? `${symbol}${result.formattedRevenuePerEmployee}`
                      : '—'}
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-1 pr-2">Revenue per working hour</td>
                  <td className="py-1 text-right">
                    {result.formattedRevenuePerWorkingHour
                      ? `${symbol}${result.formattedRevenuePerWorkingHour}/hour`
                      : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {result.warningMessage ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <a
          href="/tools/net-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Income
        </a>
        {' · '}
        <a
          href="/tools/marginal-cost-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Marginal Cost
        </a>
        .
      </p>
    </div>
  );
}
