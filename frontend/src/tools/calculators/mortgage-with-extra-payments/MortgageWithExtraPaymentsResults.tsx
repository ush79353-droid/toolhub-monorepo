'use client';

import type { MortgageWithExtraPaymentsResult } from './types';

interface MortgageWithExtraPaymentsResultsProps {
  result: MortgageWithExtraPaymentsResult | null;
}

const ROWS: readonly {
  key: string;
  label: string;
  original: (r: MortgageWithExtraPaymentsResult) => string;
  withExtra: (r: MortgageWithExtraPaymentsResult) => string;
  difference: (r: MortgageWithExtraPaymentsResult) => string;
}[] = [
  {
    key: 'payoff',
    label: 'Payoff',
    original: (r) => r.original.formattedPayoffDate,
    withExtra: (r) => r.withExtra.formattedPayoffDate,
    difference: (r) => r.difference.formattedPayoff,
  },
  {
    key: 'payment',
    label: 'Payment',
    original: (r) => r.original.formattedPayment,
    withExtra: (r) => r.withExtra.formattedPayment,
    difference: (r) => r.difference.formattedPayment,
  },
  {
    key: 'freq',
    label: 'Freq.',
    original: (r) => r.original.freqLabel,
    withExtra: (r) => r.withExtra.freqLabel,
    difference: (r) => r.difference.formattedFreq,
  },
  {
    key: 'term',
    label: 'Term',
    original: (r) => r.original.formattedTerm,
    withExtra: (r) => r.withExtra.formattedTerm,
    difference: (r) => r.difference.formattedTerm,
  },
  {
    key: 'interest',
    label: 'Interest',
    original: (r) => r.original.formattedInterest,
    withExtra: (r) => r.withExtra.formattedInterest,
    difference: (r) => r.difference.formattedInterest,
  },
  {
    key: 'tot',
    label: 'Tot. pmt',
    original: (r) => r.original.formattedTotalPayment,
    withExtra: (r) => r.withExtra.formattedTotalPayment,
    difference: (r) => r.difference.formattedTotalPayment,
  },
];

export function MortgageWithExtraPaymentsResults({
  result,
}: MortgageWithExtraPaymentsResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
        Enter valid mortgage inputs to see the payment summary.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-[13px] font-semibold text-accent">Payment summary</h3>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[640px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th
                className="px-3 py-2.5 text-[12px] font-medium text-muted-foreground"
                scope="col"
              >
                {' '}
              </th>
              <th
                className="px-3 py-2.5 text-[12px] font-semibold text-accent"
                scope="col"
              >
                Original
              </th>
              <th
                className="px-3 py-2.5 text-[12px] font-semibold text-accent"
                scope="col"
              >
                With extra
              </th>
              <th
                className="px-3 py-2.5 text-[12px] font-semibold text-accent"
                scope="col"
              >
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.key}
                className="border-b border-border/70 last:border-0"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.original(result)}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.withExtra(result)}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.difference(result)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Scroll sideways to see all of the table on smaller screens.
      </p>
    </div>
  );
}
