'use client';

import type { MortgageAccelerationResult } from './types';

interface MortgageAccelerationResultsProps {
  result: MortgageAccelerationResult | null;
}

const ROWS: readonly {
  key: string;
  label: string;
  without: (r: MortgageAccelerationResult) => string;
  accelerated: (r: MortgageAccelerationResult) => string;
  difference: (r: MortgageAccelerationResult) => string;
}[] = [
  {
    key: 'payment',
    label: 'Payment',
    without: (r) => r.withoutAcceleration.formattedPeriodicPayment,
    accelerated: (r) => r.accelerated.formattedPeriodicPayment,
    difference: (r) => r.difference.formattedPayment,
  },
  {
    key: 'term',
    label: 'Term',
    without: (r) => r.withoutAcceleration.formattedTerm,
    accelerated: (r) => r.accelerated.formattedTerm,
    difference: (r) => r.difference.formattedTerm,
  },
  {
    key: 'payoff',
    label: 'Payoff date',
    without: (r) => r.withoutAcceleration.formattedPayoffDate,
    accelerated: (r) => r.accelerated.formattedPayoffDate,
    difference: (r) => r.difference.formattedPayoff,
  },
  {
    key: 'interest',
    label: 'Total interest',
    without: (r) => r.withoutAcceleration.formattedTotalInterest,
    accelerated: (r) => r.accelerated.formattedTotalInterest,
    difference: (r) => r.difference.formattedTotalInterest,
  },
  {
    key: 'additional',
    label: 'Additional costs',
    without: (r) => r.withoutAcceleration.formattedAdditionalCosts,
    accelerated: (r) => r.accelerated.formattedAdditionalCosts,
    difference: (r) => r.difference.formattedAdditionalCosts,
  },
  {
    key: 'total',
    label: 'Total payments',
    without: (r) => r.withoutAcceleration.formattedGrandTotal,
    accelerated: (r) => r.accelerated.formattedGrandTotal,
    difference: (r) => r.difference.formattedGrandTotal,
  },
];

export function MortgageAccelerationResults({
  result,
}: MortgageAccelerationResultsProps) {
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
              <th className="px-3 py-2.5 text-[12px] font-medium text-muted-foreground" scope="col">
                {' '}
              </th>
              <th
                className="px-3 py-2.5 text-[12px] font-semibold text-accent"
                scope="col"
              >
                {result.withoutAcceleration.label}
              </th>
              <th
                className="px-3 py-2.5 text-[12px] font-semibold text-accent"
                scope="col"
              >
                {result.accelerated.label}
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
              <tr key={row.key} className="border-b border-border/70 last:border-0">
                <th
                  scope="row"
                  className="whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.without(result)}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.accelerated(result)}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.difference(result)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        scroll sideways to see all of the results
      </p>
    </div>
  );
}
