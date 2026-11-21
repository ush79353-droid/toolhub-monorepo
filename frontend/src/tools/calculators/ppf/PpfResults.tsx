'use client';

import { useState } from 'react';
import { downloadTextFile } from '@/tools/shared/download';
import { buildPpfScheduleCsv } from './calculation';
import { PpfChart } from './PpfChart';
import type { PpfResult } from './types';

interface PpfResultsProps {
  result: PpfResult | null;
}

export function PpfResults({ result }: PpfResultsProps) {
  const [showSchedule, setShowSchedule] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Investment Summary</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedMaturity}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          estimated maturity value
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Initial investment</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInitial}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.depositFrequency === 'custom'
              ? 'First scheduled deposit'
              : `${result.depositFrequency.replace('-', ' ')} deposit`}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInitial}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total investment</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInvestment}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total interest</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Number of deposits</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.numberOfDeposits}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Opening financial year</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.openingFinancialYear}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">End of term</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.maturityDate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Interest rate used</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.interestRateUsed}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Inflation-adjusted value (today&apos;s money)
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInflationAdjusted}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <PpfChart schedule={result.yearlyBreakdown} />

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSchedule((v) => !v)}
      >
        {showSchedule ? 'Hide' : 'Show'} financial-year schedule
      </button>

      {showSchedule ? (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 font-medium">FY</th>
                  <th className="px-2 py-1.5 font-medium">Opening</th>
                  <th className="px-2 py-1.5 font-medium">Deposits</th>
                  <th className="px-2 py-1.5 font-medium">Interest</th>
                  <th className="px-2 py-1.5 font-medium">Closing</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.financialYear} className="border-t border-border">
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      {row.financialYear}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.openingBalance.toFixed(2)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.deposits.toFixed(2)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.interestCredited.toFixed(2)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.closingBalance.toFixed(2)}
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
              downloadTextFile(
                'ppf-yearly-schedule.csv',
                buildPpfScheduleCsv(result),
                'text/csv',
              )
            }
          >
            Download CSV
          </button>
        </div>
      ) : null}
    </div>
  );
}
