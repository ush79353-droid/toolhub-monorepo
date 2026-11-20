'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatAprMoney } from './calculation';
import type { AprResult } from './types';

interface AprResultsProps {
  result: AprResult | null;
}

export function AprResults({ result }: AprResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const warnTone =
    result.status === 'solverFailed' || result.status === 'invalid';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">APR summary</h3>

      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-accent">Annual percentage rate</dt>
          <dd
            className={`text-lg font-semibold tabular-nums ${
              result.formattedApr == null ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {result.formattedApr != null
              ? `${result.formattedApr}%`
              : 'Unavailable'}
          </dd>
        </div>
        {result.formattedEar != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Effective annual rate</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedEar}%
            </dd>
          </div>
        ) : null}
        {result.nominalAnnualRate != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Nominal interest rate</dt>
            <dd className="tabular-nums text-accent">
              {result.nominalAnnualRate.toFixed(2)}%
            </dd>
          </div>
        ) : null}
        {result.formattedPeriodicPayment != null ? (
          <div className="flex justify-between gap-2 border-t border-border pt-1.5">
            <dt className="text-muted-foreground">Regular payment</dt>
            <dd className="tabular-nums font-medium text-accent">
              {symbol}
              {result.formattedPeriodicPayment}
            </dd>
          </div>
        ) : null}
        {result.paymentCount != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Number of payments</dt>
            <dd className="tabular-nums text-accent">{result.paymentCount}</dd>
          </div>
        ) : null}
        {result.formattedAmortizingPrincipal != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Amortizing principal</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedAmortizingPrincipal}
            </dd>
          </div>
        ) : null}
        {result.formattedNetProceeds != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Net loan proceeds</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedNetProceeds}
            </dd>
          </div>
        ) : null}
        {result.formattedTotalFees != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Included finance fees</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedTotalFees}
            </dd>
          </div>
        ) : null}
        {result.formattedTotalInterest != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total interest</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedTotalInterest}
            </dd>
          </div>
        ) : null}
        {result.formattedTotalPayments != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total payments</dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedTotalPayments}
            </dd>
          </div>
        ) : null}
        {result.formattedTotalFinanceCharges != null ? (
          <div className="flex justify-between gap-2">
            <dt className="font-medium text-accent">Total financing cost</dt>
            <dd className="font-semibold tabular-nums text-accent">
              {symbol}
              {result.formattedTotalFinanceCharges}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        PMT from amortizing principal · APR from PV(payments) = net proceeds ·
        EAR = (1 + r)^m − 1
      </p>

      {result.warningMessage ? (
        <p
          className={`text-xs leading-relaxed ${
            warnTone ? 'text-rose-700' : 'text-amber-800'
          }`}
          role="status"
        >
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
          aria-expanded={breakdownOpen}
          onClick={() => setBreakdownOpen((o) => !o)}
        >
          <span>APR Calculation Breakdown</span>
          <span className="text-xs font-normal text-muted-foreground">
            {breakdownOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {breakdownOpen ? (
          <div className="space-y-2 border-t border-border px-3 py-3 text-xs leading-relaxed text-accent sm:text-sm">
            <p className="font-mono text-[11px] sm:text-xs">
              Periods/year = {result.paymentsPerYear}
              {result.paymentCount != null
                ? ` · n = ${result.paymentCount}`
                : ''}
              {result.formattedAmortizingPrincipal != null
                ? ` · P = ${symbol}${result.formattedAmortizingPrincipal}`
                : ''}
              {result.formattedNetProceeds != null
                ? ` · Proceeds = ${symbol}${result.formattedNetProceeds}`
                : ''}
            </p>
            {result.formattedPeriodicPayment != null ? (
              <p className="font-mono text-[11px] sm:text-xs">
                PMT ≈ {symbol}
                {result.formattedPeriodicPayment}
                {result.formattedApr != null
                  ? ` · APR ≈ ${result.formattedApr}%`
                  : ' · APR unavailable'}
                {result.formattedEar != null
                  ? ` · EAR ≈ ${result.formattedEar}%`
                  : ''}
              </p>
            ) : null}
            <p className="text-muted-foreground">
              Solve periodic rate so the present value of scheduled payments
              equals net proceeds, then annualize × periods per year.
            </p>
          </div>
        ) : null}
      </div>

      {result.schedule.length > 0 ? (
        <div className="rounded-lg border border-border bg-white">
          <button
            type="button"
            className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
            aria-expanded={scheduleOpen}
            onClick={() => setScheduleOpen((o) => !o)}
          >
            <span>Payment schedule</span>
            <span className="text-xs font-normal text-muted-foreground">
              {scheduleOpen ? 'Hide' : 'Show'}
            </span>
          </button>
          {scheduleOpen ? (
            <div className="max-h-72 overflow-auto border-t border-border">
              <table className="w-full min-w-[28rem] text-left text-xs">
                <thead className="sticky top-0 bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Period</th>
                    <th className="px-2 py-1.5 font-medium">Payment</th>
                    <th className="px-2 py-1.5 font-medium">Interest</th>
                    <th className="px-2 py-1.5 font-medium">Principal</th>
                    <th className="px-2 py-1.5 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.period} className="border-t border-border">
                      <td className="px-2 py-1 tabular-nums">{row.period}</td>
                      <td className="px-2 py-1 tabular-nums">
                        {symbol}
                        {formatAprMoney(row.payment, result.currency)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {symbol}
                        {formatAprMoney(row.interest, result.currency)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {symbol}
                        {formatAprMoney(row.principal, result.currency)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {symbol}
                        {formatAprMoney(row.balance, result.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : null}

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
          href="/tools/loan-repayment-calculator-loan-payoff-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Loan Repayment
        </Link>
        {' · '}
        <Link
          href="/tools/interest-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Rate
        </Link>
        {' · '}
        <Link
          href="/tools/apy-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APY
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
          href="/tools/2836-rule-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          28/36 Rule
        </Link>
        .
      </p>
    </div>
  );
}
