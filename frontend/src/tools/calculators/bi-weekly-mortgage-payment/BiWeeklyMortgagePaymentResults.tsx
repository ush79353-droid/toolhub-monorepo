'use client';

import type { BiWeeklyMortgagePaymentResult } from './types';

interface BiWeeklyMortgagePaymentResultsProps {
  result: BiWeeklyMortgagePaymentResult | null;
}

const ROWS: readonly {
  key: string;
  label: string;
  monthly: (r: BiWeeklyMortgagePaymentResult) => string;
  biweekly: (r: BiWeeklyMortgagePaymentResult) => string;
}[] = [
  {
    key: 'payment',
    label: 'Payment',
    monthly: (r) => r.monthly.formattedPayment,
    biweekly: (r) => r.biweekly.formattedPayment,
  },
  {
    key: 'term',
    label: 'Term',
    monthly: (r) => r.monthly.formattedTerm,
    biweekly: (r) => r.biweekly.formattedTerm,
  },
  {
    key: 'payoff',
    label: 'Payoff date',
    monthly: (r) => r.monthly.formattedPayoffDate,
    biweekly: (r) => r.biweekly.formattedPayoffDate,
  },
  {
    key: 'interest',
    label: 'Total interest',
    monthly: (r) => r.monthly.formattedTotalInterest,
    biweekly: (r) => r.biweekly.formattedTotalInterest,
  },
  {
    key: 'total',
    label: 'Total payments',
    monthly: (r) => r.monthly.formattedTotalPayments,
    biweekly: (r) => r.biweekly.formattedTotalPayments,
  },
];

export function BiWeeklyMortgagePaymentResults({
  result,
}: BiWeeklyMortgagePaymentResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
        Enter valid mortgage inputs to see the payment summary.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[480px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-3 py-2.5 text-[12px] font-medium text-muted-foreground" scope="col">
                {' '}
              </th>
              <th
                className="px-3 py-2.5 text-[12px] font-semibold text-accent"
                scope="col"
              >
                {result.monthly.label}
              </th>
              <th
                className="px-3 py-2.5 text-[12px] font-semibold text-accent"
                scope="col"
              >
                {result.biweekly.label}
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-b border-border/70 last:border-0">
                <th
                  scope="row"
                  className="whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.monthly(result)}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.biweekly(result)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Scroll sideways to see all of the table
      </p>
    </div>
  );
}
