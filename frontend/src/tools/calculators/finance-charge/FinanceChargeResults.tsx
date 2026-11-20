'use client';

import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatFcMoney, formatFcPercent, formatFcRateDetail } from './calculation';
import type { FinanceChargeResult } from './types';

interface FinanceChargeResultsProps {
  result: FinanceChargeResult | null;
}

export function FinanceChargeResults({ result }: FinanceChargeResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const methodLabel =
    result.method === 'billing-cycle' ? 'Billing cycle' : 'Given term';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Final result</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Estimated finance charge for a constant balance over the selected
        period using simple interest (365-day year).
      </p>

      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-accent">Finance charge</dt>
          <dd className="text-lg font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedFinanceCharge}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="text-muted-foreground">Current balance</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedBalance}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total with finance charge</dt>
          <dd className="tabular-nums font-medium text-accent">
            {symbol}
            {result.formattedTotal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Period interest rate</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedPeriodRate}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Daily finance charge</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedDailyCharge}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Daily periodic rate</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedDailyRatePercent}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Method / days</dt>
          <dd className="tabular-nums text-accent">
            {methodLabel} · {formatFcPercent(result.calculationDays, result.calculationDays % 1 === 0 ? 0 : 2)} d
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        FC = B × (APR/100) × (Days/365) · r_d = APR/(100×365)
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      {result.dailyRows ? (
        <div className="rounded-lg border border-border bg-white">
          <div className="border-b border-border px-3 py-2.5 text-[13px] font-semibold text-accent">
            Daily interest and finance charge
          </div>
          <dl className="space-y-1 border-b border-border px-3 py-2.5 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">APR (decimal)</dt>
              <dd className="tabular-nums">
                {formatFcRateDetail(result.annualRateDecimal)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Daily rate</dt>
              <dd className="tabular-nums">
                {result.formattedDailyRatePercent}%
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Days in calculation</dt>
              <dd className="tabular-nums">
                {formatFcPercent(
                  result.calculationDays,
                  result.calculationDays % 1 === 0 ? 0 : 4
                )}
              </dd>
            </div>
          </dl>
          <div className="max-h-64 overflow-auto">
            <table className="w-full min-w-[20rem] text-left text-xs">
              <thead className="sticky top-0 bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Day</th>
                  <th className="px-2 py-1.5 font-medium">Balance</th>
                  <th className="px-2 py-1.5 font-medium">Daily int.</th>
                  <th className="px-2 py-1.5 font-medium">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {result.dailyRows.map((row) => (
                  <tr key={row.day} className="border-t border-border">
                    <td className="px-2 py-1 tabular-nums">{row.day}</td>
                    <td className="px-2 py-1 tabular-nums">
                      {symbol}
                      {formatFcMoney(row.balance, result.currency)}
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {formatFcRateDetail(row.dailyInterest)}
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {formatFcRateDetail(row.cumulativeInterest)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.dailyRowsTruncated ? (
            <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
              Showing the first {result.dailyRows.length} days. Cumulative on
              the last row equals the full-period finance charge (no
              compounding).
            </p>
          ) : (
            <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
              Constant balance · simple daily interest · no compounding.
            </p>
          )}
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/apr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APR
        </Link>
        {' · '}
        <Link
          href="/tools/credit-utilization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Utilization
        </Link>
        {' · '}
        <Link
          href="/tools/balance-transfer-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Balance Transfer
        </Link>
        {' · '}
        <Link
          href="/tools/credit-card-payoff-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Card Payoff
        </Link>
        {' · '}
        <Link
          href="/tools/simple-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Simple Interest
        </Link>
        {' · '}
        <Link
          href="/tools/compound-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Compound Interest
        </Link>
        .
      </p>
    </div>
  );
}
