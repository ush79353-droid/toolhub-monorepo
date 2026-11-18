'use client';

import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { formatLoanRepaymentMoney } from './calculation';
import type { YearlyRow } from './types';

interface LoanRepaymentTableProps {
  rows: YearlyRow[];
  currency: SupportedCurrency;
}

export function LoanRepaymentTable({ rows, currency }: LoanRepaymentTableProps) {
  const symbol = getCurrencySymbol(currency);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-accent">Loan repayment datasheet</h3>
        <p className="text-xs text-muted-foreground">Yearly totals in {symbol}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-2 py-2 font-medium">Year</th>
              <th className="px-2 py-2 font-medium">Yearly payment</th>
              <th className="px-2 py-2 font-medium">Yearly principal</th>
              <th className="px-2 py-2 font-medium">Yearly interest</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.year} className="border-b border-border/70 tabular-nums">
                <td className="px-2 py-2 text-accent">{row.year}</td>
                <td className="px-2 py-2 text-accent">
                  {formatLoanRepaymentMoney(row.yearlyPayment, currency)}
                </td>
                <td className="px-2 py-2 text-accent">
                  {formatLoanRepaymentMoney(row.yearlyPrincipal, currency)}
                </td>
                <td className="px-2 py-2 text-accent">
                  {formatLoanRepaymentMoney(row.yearlyInterest, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
