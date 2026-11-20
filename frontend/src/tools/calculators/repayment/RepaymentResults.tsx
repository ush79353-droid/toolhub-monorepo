'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatRepMoney } from './calculation';
import type { RepaymentResult } from './types';

interface RepaymentResultsProps {
  result: RepaymentResult | null;
}

function DonutChart({
  principal,
  interest,
}: {
  principal: number;
  interest: number;
}) {
  const total = principal + interest;
  if (!(total > 0)) return null;
  const principalPct = (principal / total) * 100;
  const interestPct = 100 - principalPct;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div
        className="h-24 w-24 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(#0d7377 0 ${principalPct}%, #f59e0b ${principalPct}% 100%)`,
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 12px), #000 calc(100% - 11px))',
          WebkitMask:
            'radial-gradient(farthest-side, transparent calc(100% - 12px), #000 calc(100% - 11px))',
        }}
        role="img"
        aria-label={`Principal ${principalPct.toFixed(1)}%, interest ${interestPct.toFixed(1)}%`}
      />
      <ul className="space-y-1 text-xs text-muted-foreground">
        <li>
          <span className="text-primary">■</span> Principal{' '}
          {principalPct.toFixed(1)}%
        </li>
        <li>
          <span className="text-amber-500">■</span> Interest{' '}
          {interestPct.toFixed(1)}%
        </li>
      </ul>
    </div>
  );
}

export function RepaymentResults({ result }: RepaymentResultsProps) {
  const [scheduleOpen, setScheduleOpen] = useState(false);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);

  if (result.nonAmortizing) {
    return (
      <div
        className="space-y-2 rounded-xl border border-rose-200 bg-rose-50/80 p-4"
        role="alert"
        aria-live="polite"
      >
        <h3 className="text-sm font-semibold text-rose-800">Cannot repay</h3>
        <p className="text-xs leading-relaxed text-rose-800">
          {result.nonAmortizingMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Repayment results</h3>
      <p className="text-xs text-muted-foreground">
        {result.paymentFrequencyLabel}
      </p>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-accent">
          {result.mode === 'fixed-term'
            ? 'Pay back'
            : 'Fixed installment'}
        </span>
        <span className="text-xl font-semibold tabular-nums text-accent">
          {symbol}
          {result.formattedPayment}
        </span>
      </div>

      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="text-muted-foreground">
            Total of {result.numberOfPayments} loan payment
            {result.numberOfPayments === 1 ? '' : 's'}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {symbol}
            {result.formattedTotalRepayment}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Interest</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedTotalInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Principal</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedPrincipal}
          </dd>
        </div>
        {result.mode === 'fixed-installment' &&
        Math.abs(result.finalPayment - result.paymentAmount) > 0.005 ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Final payment</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedFinalPayment}
            </dd>
          </div>
        ) : null}
      </dl>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-accent">
          Repayment breakdown
        </p>
        <DonutChart
          principal={result.totalPrincipal}
          interest={result.totalInterest}
        />
      </div>

      <p className="font-mono text-xs text-muted-foreground">
        i = (1+j/m)^(m/p)−1 · A = P·i/(1−(1+i)^−n)
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <div className="rounded-lg border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
          aria-expanded={scheduleOpen}
          onClick={() => setScheduleOpen((o) => !o)}
        >
          <span>View amortization table</span>
          <span className="text-xs font-normal text-muted-foreground">
            {scheduleOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {scheduleOpen ? (
          <div className="max-h-72 overflow-auto border-t border-border">
            <table className="w-full min-w-[28rem] text-left text-xs">
              <thead className="sticky top-0 bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 font-medium">#</th>
                  <th className="px-2 py-1.5 font-medium">Payment</th>
                  <th className="px-2 py-1.5 font-medium">Principal</th>
                  <th className="px-2 py-1.5 font-medium">Interest</th>
                  <th className="px-2 py-1.5 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.paymentNumber} className="border-t border-border">
                    <td className="px-2 py-1 tabular-nums">
                      {row.paymentNumber}
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {symbol}
                      {formatRepMoney(row.paymentAmount, result.currency)}
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {symbol}
                      {formatRepMoney(row.principalPaid, result.currency)}
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {symbol}
                      {formatRepMoney(row.interestPaid, result.currency)}
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {symbol}
                      {formatRepMoney(row.remainingBalance, result.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/loan-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Loan
        </Link>
        {' · '}
        <Link
          href="/tools/auto-loan-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Auto Loan
        </Link>
        {' · '}
        <Link
          href="/tools/amortization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Amortization
        </Link>
        {' · '}
        <Link
          href="/tools/apr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APR
        </Link>
        {' · '}
        <Link
          href="/tools/piti-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PITI
        </Link>
        {' · '}
        <Link
          href="/tools/credit-card-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Card
        </Link>
        .
      </p>
    </div>
  );
}
