'use client';

import { useState } from 'react';
import { downloadTextFile } from '@/tools/shared/download';
import type { PomisResult } from './types';

interface PomisResultsProps {
  result: PomisResult | null;
}

export function PomisResults({ result }: PomisResultsProps) {
  const [showSchedule, setShowSchedule] = useState(false);
  if (!result) return null;

  const accountLabel =
    result.accountType === 'joint' ? 'Joint' : 'Individual';

  const csv = [
    'Month,PaymentDate,MonthlyInterest,CumulativeInterest,PrincipalOutstanding,MaturityPrincipal',
    ...result.schedule.map((row) =>
      [
        row.month,
        row.paymentDate,
        row.monthlyInterest.toFixed(2),
        row.cumulativeInterest.toFixed(2),
        row.principalOutstanding.toFixed(2),
        row.isMaturityPrincipal ? 'yes' : 'no',
      ].join(','),
    ),
  ].join('\n');

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Payment Summary</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedMonthlyIncome}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          estimated monthly income
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Annual income</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAnnualIncome}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total interest ({result.investmentTermYears}y)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Investment principal</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPrincipal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Principal at maturity</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPrincipal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total cash received</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalCash}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Account type</dt>
          <dd className="font-medium text-accent">{accountLabel}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Annual interest rate used</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.interestRateUsed}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Investment term</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.investmentTermYears} years ({result.scheduledPaymentCount}{' '}
            payments)
          </dd>
        </div>
        {result.maturityDate ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Expected maturity date</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.maturityDate}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Total cash received = principal returned at maturity + cumulative monthly
        interest payments (not a single lump-sum payout).
      </p>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSchedule((v) => !v)}
      >
        {showSchedule ? 'Hide' : 'Show'} interest schedule
      </button>

      {showSchedule ? (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 font-medium">#</th>
                  <th className="px-2 py-1.5 font-medium">Date</th>
                  <th className="px-2 py-1.5 font-medium">Interest</th>
                  <th className="px-2 py-1.5 font-medium">Cumulative</th>
                  <th className="px-2 py-1.5 font-medium">Principal</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row, idx) => (
                  <tr
                    key={`${row.month}-${row.isMaturityPrincipal}-${idx}`}
                    className="border-t border-border"
                  >
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.isMaturityPrincipal ? 'M' : row.month}
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      {row.paymentDate}
                      {row.isMaturityPrincipal ? ' (principal)' : ''}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.isMaturityPrincipal
                        ? '—'
                        : row.monthlyInterest.toFixed(2)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.cumulativeInterest.toFixed(2)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.principalOutstanding.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            onClick={() =>
              downloadTextFile('pomis-interest-schedule.csv', csv, 'text/csv')
            }
          >
            Download CSV
          </button>
          <p className="text-[11px] text-muted-foreground">
            Dates are projected from the start date; actual credit dates depend
            on scheme processing.
          </p>
        </div>
      ) : null}
    </div>
  );
}
