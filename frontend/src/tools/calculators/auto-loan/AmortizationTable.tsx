'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  buildAmortizationCsv,
  formatCurrencyValue,
  formatDisplayDate,
} from './calculation';
import type { AutoLoanResult } from './types';

interface AmortizationTableProps {
  result: AutoLoanResult;
}

export function AmortizationTable({ result }: AmortizationTableProps) {
  const [view, setView] = React.useState<'monthly' | 'yearly'>('monthly');
  const fmt = (value: number) => formatCurrencyValue(value, result.currency);

  const handleDownloadCsv = () => {
    const csv = buildAmortizationCsv(result, view, result.currency);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auto-loan-amortization-${view}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (result.monthlySchedule.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-white p-6 text-center">
        <h3 className="text-base font-bold text-accent">Amortization Schedule</h3>
        <p className="mt-1.5 text-xs text-muted-foreground">
          No amortization schedule is needed when Amount Financed is{' '}
          {fmt(result.amountFinanced)}.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h3 className="text-base font-bold text-accent">Amortization Schedule</h3>
          <p className="text-xs text-muted-foreground">
            {result.monthlySchedule.length} monthly installments across{' '}
            {result.yearlySchedule.length} calendar year
            {result.yearlySchedule.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Schedule view"
            className="inline-flex rounded-lg border border-border bg-background p-0.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === 'monthly'}
              onClick={() => setView('monthly')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                view === 'monthly'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'yearly'}
              onClick={() => setView('yearly')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                view === 'yearly'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly Summary
            </button>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={handleDownloadCsv}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download CSV
          </Button>
        </div>
      </div>

      <div className="max-h-[480px] w-full overflow-auto">
        {view === 'monthly' ? (
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Payment #
                </th>
                <th scope="col" className="px-4 py-3">
                  Payment Date
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Beginning Balance
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Monthly Payment
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Principal Paid
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Interest Paid
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Ending Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {result.monthlySchedule.map((row) => (
                <tr key={row.paymentNumber} className="hover:bg-muted/35">
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">
                    {row.paymentNumber}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {formatDisplayDate(row.paymentDate)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmt(row.beginningBalance)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-accent tabular-nums">
                    {fmt(row.monthlyPayment)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-primary tabular-nums">
                    {fmt(row.principalPaid)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmt(row.interestPaid)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmt(row.endingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky bottom-0 border-t-2 border-border bg-brand-softTeal text-xs font-bold text-accent">
              <tr>
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3">{result.monthlySchedule.length} payments</td>
                <td className="px-4 py-3 text-right">—</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {fmt(result.scheduleTotals.totalPayment)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {fmt(result.scheduleTotals.totalPrincipal)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {fmt(result.scheduleTotals.totalInterest)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{fmt(0)}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Year
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Payments
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Beginning Balance
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Total Payment
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Principal Paid
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Interest Paid
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Ending Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {result.yearlySchedule.map((row) => (
                <tr key={row.year} className="hover:bg-muted/35">
                  <td className="px-4 py-2.5 font-bold text-accent">{row.year}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{row.paymentsCount}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmt(row.beginningBalance)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-accent tabular-nums">
                    {fmt(row.totalPayment)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-primary tabular-nums">
                    {fmt(row.principalPaid)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmt(row.interestPaid)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmt(row.endingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky bottom-0 border-t-2 border-border bg-brand-softTeal text-xs font-bold text-accent">
              <tr>
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {result.monthlySchedule.length}
                </td>
                <td className="px-4 py-3 text-right">—</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {fmt(result.scheduleTotals.totalPayment)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {fmt(result.scheduleTotals.totalPrincipal)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {fmt(result.scheduleTotals.totalInterest)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{fmt(0)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </section>
  );
}

