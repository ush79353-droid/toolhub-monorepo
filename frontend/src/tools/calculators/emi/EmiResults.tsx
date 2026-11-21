'use client';

import { useState } from 'react';
import Link from 'next/link';
import { downloadTextFile } from '@/tools/shared/download';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { buildAmortizationCsv } from './calculation';
import { EmiChart } from './EmiChart';
import type { EmiResult } from './types';

interface EmiResultsProps {
  result: EmiResult | null;
}

export function EmiResults({ result }: EmiResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleView, setScheduleView] = useState<'monthly' | 'yearly'>(
    'monthly',
  );
  if (!result) return null;

  const fmt = (n: number) => formatCurrencyValue(n, result.currency);
  const schedule =
    result.hasExtraPayment && result.scheduleWithExtra
      ? result.scheduleWithExtra
      : result.schedule;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Your EMI Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedEMI}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          / mo
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Loan amount</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPrincipal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Interest rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.annualInterestRate.toFixed(2)}% / year
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Loan term</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.termLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total interest due</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total amount payable</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalPayable}
          </dd>
        </div>
      </dl>

      <EmiChart
        principal={result.principal}
        totalInterest={result.totalInterest}
        principalRatioPercent={result.principalRatioPercent}
        interestRatioPercent={result.interestRatioPercent}
        currency={result.currency}
      />

      {result.paymentsMade != null && result.outstandingBalance != null ? (
        <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs">
          <p className="font-medium text-accent">
            After {result.paymentsMade} payment
            {result.paymentsMade === 1 ? '' : 's'}
          </p>
          <dl className="mt-2 space-y-1">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Outstanding balance</dt>
              <dd className="tabular-nums font-medium">
                {fmt(result.outstandingBalance)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Principal repaid</dt>
              <dd className="tabular-nums font-medium">
                {fmt(result.principalRepaidToDate ?? 0)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Interest paid to date</dt>
              <dd className="tabular-nums font-medium">
                {fmt(result.interestPaidToDate ?? 0)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Remaining installments</dt>
              <dd className="tabular-nums font-medium">
                {result.remainingInstallments}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      {result.hasExtraPayment && result.payoffMonthsWithExtra != null ? (
        <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs">
          <p className="font-medium text-accent">With extra payments</p>
          <dl className="mt-2 space-y-1">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Payoff months</dt>
              <dd className="tabular-nums font-medium">
                {result.payoffMonthsWithExtra}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Interest with extras</dt>
              <dd className="tabular-nums font-medium">
                {fmt(result.totalInterestWithExtra ?? 0)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Interest saved</dt>
              <dd className="tabular-nums font-medium text-emerald-700">
                {fmt(result.interestSaved ?? 0)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Months saved</dt>
              <dd className="tabular-nums font-medium">
                {result.monthsSaved}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      {result.comparison ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[280px] text-left text-xs">
            <thead>
              <tr className="border-b border-border text-accent">
                <th className="px-3 py-2">Metric</th>
                <th className="px-3 py-2">Loan A</th>
                <th className="px-3 py-2">Loan B</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="px-3 py-1.5 text-muted-foreground">Monthly EMI</td>
                <td className="px-3 py-1.5 tabular-nums">
                  {fmt(result.comparison.loanA.monthlyEMI)}
                </td>
                <td className="px-3 py-1.5 tabular-nums">
                  {fmt(result.comparison.loanB.monthlyEMI)}
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-1.5 text-muted-foreground">
                  Total interest
                </td>
                <td className="px-3 py-1.5 tabular-nums">
                  {fmt(result.comparison.loanA.totalInterest)}
                </td>
                <td className="px-3 py-1.5 tabular-nums">
                  {fmt(result.comparison.loanB.totalInterest)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-muted-foreground">
                  Total payable
                </td>
                <td className="px-3 py-1.5 tabular-nums">
                  {fmt(result.comparison.loanA.totalPayable)}
                </td>
                <td className="px-3 py-1.5 tabular-nums">
                  {fmt(result.comparison.loanB.totalPayable)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs">
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-accent">
            {result.formulaBreakdown}
          </pre>
          <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setShowSchedule((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSchedule ? 'Hide amortization schedule' : 'Show amortization schedule'}
      </button>
      {showSchedule ? (
        <div className="space-y-2 rounded-lg border border-border bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div
              role="tablist"
              className="inline-flex h-8 items-center rounded-lg border border-border p-0.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={scheduleView === 'monthly'}
                className={`h-full rounded-md px-2.5 text-xs font-medium ${
                  scheduleView === 'monthly'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setScheduleView('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={scheduleView === 'yearly'}
                className={`h-full rounded-md px-2.5 text-xs font-medium ${
                  scheduleView === 'yearly'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setScheduleView('yearly')}
              >
                Yearly
              </button>
            </div>
            <button
              type="button"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
              onClick={() =>
                downloadTextFile(
                  buildAmortizationCsv(schedule, result.currency),
                  'emi-amortization.csv',
                  'text/csv;charset=utf-8',
                )
              }
            >
              Download CSV
            </button>
          </div>
          <div className="max-h-64 overflow-auto">
            {scheduleView === 'monthly' ? (
              <table className="w-full min-w-[520px] text-left text-xs">
                <thead className="sticky top-0 bg-muted text-[11px] uppercase text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5">#</th>
                    <th className="px-2 py-1.5">EMI</th>
                    <th className="px-2 py-1.5">Principal</th>
                    <th className="px-2 py-1.5">Interest</th>
                    <th className="px-2 py-1.5">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.month} className="border-t border-border/40">
                      <td className="px-2 py-1 tabular-nums">{row.month}</td>
                      <td className="px-2 py-1 tabular-nums">
                        {fmt(row.payment)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {fmt(row.principalPaid + row.extraPaid)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {fmt(row.interestPaid)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {fmt(row.remainingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[420px] text-left text-xs">
                <thead className="sticky top-0 bg-muted text-[11px] uppercase text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5">Year</th>
                    <th className="px-2 py-1.5">Paid</th>
                    <th className="px-2 py-1.5">Principal</th>
                    <th className="px-2 py-1.5">Interest</th>
                    <th className="px-2 py-1.5">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlySummary.map((row) => (
                    <tr key={row.year} className="border-t border-border/40">
                      <td className="px-2 py-1 tabular-nums">{row.year}</td>
                      <td className="px-2 py-1 tabular-nums">
                        {fmt(row.payment)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {fmt(row.principalPaid)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {fmt(row.interestPaid)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {fmt(row.endingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
          href="/tools/repayment-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Repayment
        </Link>
        {' · '}
        <Link
          href="/tools/simple-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Simple Interest
        </Link>
      </p>
    </div>
  );
}
