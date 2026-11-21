'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { MoratoriumChart } from './MoratoriumChart';
import type { MoratoriumResult } from './types';

interface MoratoriumResultsProps {
  result: MoratoriumResult | null;
}

export function MoratoriumResults({ result }: MoratoriumResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  if (!result) return null;

  const fmt = (n: number) => formatCurrencyValue(n, result.currency);
  const moraStartIdx = result.schedule.findIndex((r) => r.phase === 'moratorium');
  const moraEndIdx = (() => {
    let last = moraStartIdx;
    for (let i = 0; i < result.schedule.length; i++) {
      if (result.schedule[i]!.phase === 'moratorium') last = i;
    }
    return last;
  })();

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Payment Summary</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedRevisedEMI}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          revised EMI
        </span>
      </p>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[320px] text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-muted-foreground">
              <th className="px-2 py-2 font-medium">Metric</th>
              <th className="px-2 py-2 font-medium">Original</th>
              <th className="px-2 py-2 font-medium">After moratorium</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="px-2 py-1.5">Monthly EMI</td>
              <td className="px-2 py-1.5 tabular-nums">
                {result.formattedOriginalEMI}
              </td>
              <td className="px-2 py-1.5 tabular-nums font-medium">
                {result.formattedRevisedEMI}
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-2 py-1.5">Balance</td>
              <td className="px-2 py-1.5 tabular-nums">
                {fmt(result.balanceAtMoratoriumStart)}
              </td>
              <td className="px-2 py-1.5 tabular-nums font-medium">
                {result.formattedBalanceAfter}
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-2 py-1.5">Remaining payments</td>
              <td className="px-2 py-1.5 tabular-nums">
                {result.originalRemainingPayments}
              </td>
              <td className="px-2 py-1.5 tabular-nums font-medium">
                {result.revisedRemainingPayments}
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-2 py-1.5">Total interest</td>
              <td className="px-2 py-1.5 tabular-nums">
                {fmt(result.originalTotalInterest)}
              </td>
              <td className="px-2 py-1.5 tabular-nums font-medium">
                {fmt(result.revisedTotalInterest)}
              </td>
            </tr>
            <tr>
              <td className="px-2 py-1.5">Maturity date</td>
              <td className="px-2 py-1.5 tabular-nums">
                {result.originalMaturityDate}
              </td>
              <td className="px-2 py-1.5 tabular-nums font-medium">
                {result.revisedMaturityDate}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Moratorium interest accrued</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.accruedMoratoriumInterest)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Interest paid in moratorium</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.paidMoratoriumInterest)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Capitalized interest</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.capitalizedInterest)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Additional financing cost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAdditionalCost}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total repayment (all phases)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.totalRepayment)}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <MoratoriumChart
        schedule={result.schedule}
        currency={result.currency}
        moratoriumStartIndex={moraStartIdx < 0 ? 0 : moraStartIdx}
        moratoriumEndIndex={moraEndIdx < 0 ? 0 : moraEndIdx}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowSteps((v) => !v)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-accent hover:bg-muted/30"
        >
          {showSteps ? 'Hide' : 'Show'} step-by-step
        </button>
        <button
          type="button"
          onClick={() => setShowSchedule((v) => !v)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-accent hover:bg-muted/30"
        >
          {showSchedule ? 'Hide' : 'Show'} schedule
        </button>
      </div>

      {showSteps ? (
        <div className="rounded-lg border border-border bg-white px-3 py-2">
          <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-muted/30 p-2 font-mono text-[11px] text-accent">
            {result.formulaBreakdown}
          </pre>
        </div>
      ) : null}

      {showSchedule ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                <th className="px-2 py-2 font-medium">#</th>
                <th className="px-2 py-2 font-medium">Date</th>
                <th className="px-2 py-2 font-medium">Phase</th>
                <th className="px-2 py-2 font-medium">Payment</th>
                <th className="px-2 py-2 font-medium">Interest</th>
                <th className="px-2 py-2 font-medium">Principal</th>
                <th className="px-2 py-2 font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr
                  key={`${row.paymentNumber}-${row.paymentDate}`}
                  className={`border-b border-border/50 ${
                    row.phase === 'moratorium' ? 'bg-brand-softTeal/25' : ''
                  }`}
                >
                  <td className="px-2 py-1.5 tabular-nums">{row.paymentNumber}</td>
                  <td className="px-2 py-1.5 tabular-nums">{row.paymentDate}</td>
                  <td className="px-2 py-1.5">{row.phase}</td>
                  <td className="px-2 py-1.5 tabular-nums">{fmt(row.payment)}</td>
                  <td className="px-2 py-1.5 tabular-nums">{fmt(row.interest)}</td>
                  <td className="px-2 py-1.5 tabular-nums">{fmt(row.principal)}</td>
                  <td className="px-2 py-1.5 tabular-nums font-medium">
                    {fmt(row.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/emi-calculator-equated-monthly-installment"
          className="text-primary underline-offset-2 hover:underline"
        >
          EMI Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/loan-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Loan Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/compound-interest-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Compound Interest
        </Link>
      </p>
    </div>
  );
}
