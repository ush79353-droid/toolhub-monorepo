'use client';

import * as React from 'react';
import Link from 'next/link';
import type { SipLumpsumResult } from './types';

interface SipLumpsumResultsProps {
  result: SipLumpsumResult | null;
}

export function SipLumpsumResults({ result }: SipLumpsumResultsProps) {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);

  if (!result) return null;

  const rows: { label: string; value: string }[] = [
    { label: 'Opening balance', value: result.formattedOpeningBalance },
    { label: 'Final balance', value: result.formattedFinalBalance },
    {
      label: result.periodicInOutLabel,
      value: result.formattedPeriodicDeposit,
    },
    { label: 'Total in/out', value: result.formattedTotalDeposits },
    { label: 'Total return', value: result.formattedTotalReturn },
    {
      label: 'Number of transactions',
      value: String(result.numberOfTransactions),
    },
    { label: 'End of term', value: result.endDateLabel },
  ];

  if (result.formattedRealFinalBalance) {
    rows.splice(2, 0, {
      label: 'Inflation-adjusted final',
      value: result.formattedRealFinalBalance,
    });
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-sm leading-relaxed text-foreground/90">
        {result.summaryMessage}
      </p>

      <dl className="space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="tabular-nums font-medium text-accent">{row.value}</dd>
          </div>
        ))}
      </dl>

      {result.schedule.length > 0 ? (
        <div className="border-t border-border pt-3">
          <button
            type="button"
            className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
            onClick={() => setScheduleOpen((v) => !v)}
            aria-expanded={scheduleOpen}
          >
            {scheduleOpen ? 'Hide schedule' : 'Show schedule'}
          </button>
          {scheduleOpen ? (
            <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-border bg-white">
              <table className="w-full min-w-[28rem] text-left text-xs">
                <thead className="sticky top-0 bg-muted/80 text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">#</th>
                    <th className="px-2 py-1.5 font-medium">Date</th>
                    <th className="px-2 py-1.5 font-medium">Deposit</th>
                    <th className="px-2 py-1.5 font-medium">Interest</th>
                    <th className="px-2 py-1.5 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.period} className="border-t border-border/70">
                      <td className="px-2 py-1 tabular-nums">{row.period}</td>
                      <td className="px-2 py-1">{row.dateLabel}</td>
                      <td className="px-2 py-1 tabular-nums">
                        {row.deposit.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {row.interest.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {row.balance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.depositPeriods > result.schedule.length ? (
                <p className="border-t border-border px-2 py-1.5 text-[11px] text-muted-foreground">
                  Showing first {result.schedule.length} of{' '}
                  {result.depositPeriods} periods.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/sip-calculator-systematic-investment-plan"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          SIP Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/lumpsum-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Lumpsum Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/rd-calculator-recurring-deposit"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          RD Calculator
        </Link>
        .
      </p>
    </div>
  );
}
