'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { CarRefinanceResult } from './types';

interface CarRefinanceResultsProps {
  result: CarRefinanceResult;
}

function money(symbol: string, formatted: string): string {
  return `${symbol}${formatted}`;
}

export function CarRefinanceResults({ result }: CarRefinanceResultsProps) {
  const symbol = getCurrencySymbol(result.currency);
  const rows: { label: string; current: string; neu: string }[] = [
    {
      label: 'Loan amount',
      current: money(symbol, result.current.formattedLoanAmount),
      neu: money(symbol, result.neu.formattedLoanAmount),
    },
    {
      label: 'Monthly payment',
      current: money(symbol, result.current.formattedMonthlyPayment),
      neu: money(symbol, result.neu.formattedMonthlyPayment),
    },
    {
      label: 'Interest rate',
      current: `${result.current.interestRatePercent}%`,
      neu: `${result.neu.interestRatePercent}%`,
    },
    {
      label: 'Loan term',
      current: result.current.termLabel,
      neu: result.neu.termLabel,
    },
    {
      label: 'Total interest',
      current: money(symbol, result.current.formattedTotalInterest),
      neu: money(symbol, result.neu.formattedTotalInterest),
    },
    {
      label: 'Total payments',
      current: money(symbol, result.current.formattedTotalPayments),
      neu: money(symbol, result.neu.formattedTotalPayments),
    },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <h3 className="text-[13px] font-semibold text-accent">
        Refinance car loan summary
      </h3>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-[12px] font-semibold text-accent">
              <th scope="col" className="px-3 py-2.5 font-semibold">
                <span className="sr-only">Metric</span>
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Current loan*
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                New loan
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-b-0">
                <th
                  scope="row"
                  className="whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.current}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.neu}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        * The results apply for the remaining part of the loan. Scroll sideways on
        small screens to see all of the table.
      </p>

      <p className="text-sm leading-relaxed text-foreground/90">{result.explanation}</p>

      <ul className="space-y-1 text-xs text-muted-foreground">
        <li>
          Monthly payment difference:{' '}
          <span className="font-medium text-accent">
            {result.monthlyPaymentDiffAmount >= 0 ? 'save ' : 'extra '}
            {symbol}
            {result.formattedMonthlyPaymentDiff}/mo
          </span>
        </li>
        <li>
          Total interest difference:{' '}
          <span className="font-medium text-accent">
            {result.totalInterestDiffAmount >= 0 ? 'save ' : 'extra '}
            {symbol}
            {result.formattedTotalInterestDiff}
          </span>
        </li>
        <li>
          Total payments difference:{' '}
          <span className="font-medium text-accent">
            {result.totalPaymentsDiffAmount >= 0 ? 'save ' : 'extra '}
            {symbol}
            {result.formattedTotalPaymentsDiff}
          </span>
        </li>
      </ul>
    </div>
  );
}
