'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarRange, ChevronDown, ChevronUp, Download, Maximize2, X } from 'lucide-react';
import {
  buildAmortizationCsv,
  formatCurrencyValue,
  formatDisplayDate,
} from './calculation';
import type { AutoLoanResult } from './types';

interface AmortizationTableProps {
  result: AutoLoanResult;
}

function ScheduleViewControls({
  view,
  onViewChange,
  onDownloadCsv,
}: {
  view: 'monthly' | 'yearly';
  onViewChange: (view: 'monthly' | 'yearly') => void;
  onDownloadCsv: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="tablist"
        aria-label="Amortization schedule view"
        className="inline-flex rounded-lg border border-border bg-background p-0.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === 'monthly'}
          onClick={() => onViewChange('monthly')}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
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
          onClick={() => onViewChange('yearly')}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
            view === 'yearly'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Yearly
        </button>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={onDownloadCsv} className="h-8 text-xs">
        <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
        Download CSV
      </Button>
    </div>
  );
}

function ScheduleTableContent({
  result,
  view,
}: {
  result: AutoLoanResult;
  view: 'monthly' | 'yearly';
}) {
  const fmt = (value: number) => formatCurrencyValue(value, result.currency);

  if (view === 'monthly') {
    return (
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead className="sticky top-0 z-10 border-b border-border bg-muted text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2.5">
              #
            </th>
            <th scope="col" className="px-3 py-2.5">
              Date
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Beginning
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Payment
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Principal
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Interest
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Ending
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-foreground">
          {result.monthlySchedule.map((row) => (
            <tr key={row.paymentNumber} className="hover:bg-muted/35">
              <td className="px-3 py-2 font-mono text-muted-foreground">{row.paymentNumber}</td>
              <td className="px-3 py-2 whitespace-nowrap">{formatDisplayDate(row.paymentDate)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{fmt(row.beginningBalance)}</td>
              <td className="px-3 py-2 text-right font-semibold text-accent tabular-nums">
                {fmt(row.monthlyPayment)}
              </td>
              <td className="px-3 py-2 text-right text-primary tabular-nums">
                {fmt(row.principalPaid)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">{fmt(row.interestPaid)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{fmt(row.endingBalance)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="sticky bottom-0 border-t-2 border-border bg-brand-softTeal text-xs font-bold text-accent">
          <tr>
            <td className="px-3 py-2.5">Total</td>
            <td className="px-3 py-2.5">{result.monthlySchedule.length} mo</td>
            <td className="px-3 py-2.5 text-right">—</td>
            <td className="px-3 py-2.5 text-right tabular-nums">
              {fmt(result.scheduleTotals.totalPayment)}
            </td>
            <td className="px-3 py-2.5 text-right tabular-nums">
              {fmt(result.scheduleTotals.totalPrincipal)}
            </td>
            <td className="px-3 py-2.5 text-right tabular-nums">
              {fmt(result.scheduleTotals.totalInterest)}
            </td>
            <td className="px-3 py-2.5 text-right tabular-nums">{fmt(0)}</td>
          </tr>
        </tfoot>
      </table>
    );
  }

  return (
    <table className="w-full min-w-[600px] text-left text-xs">
      <thead className="sticky top-0 z-10 border-b border-border bg-muted text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <tr>
          <th scope="col" className="px-3 py-2.5">
            Year
          </th>
          <th scope="col" className="px-3 py-2.5 text-right">
            Payments
          </th>
          <th scope="col" className="px-3 py-2.5 text-right">
            Beginning
          </th>
          <th scope="col" className="px-3 py-2.5 text-right">
            Total Payment
          </th>
          <th scope="col" className="px-3 py-2.5 text-right">
            Principal
          </th>
          <th scope="col" className="px-3 py-2.5 text-right">
            Interest
          </th>
          <th scope="col" className="px-3 py-2.5 text-right">
            Ending
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border text-foreground">
        {result.yearlySchedule.map((row) => (
          <tr key={row.year} className="hover:bg-muted/35">
            <td className="px-3 py-2 font-bold text-accent">{row.year}</td>
            <td className="px-3 py-2 text-right tabular-nums">{row.paymentsCount}</td>
            <td className="px-3 py-2 text-right tabular-nums">{fmt(row.beginningBalance)}</td>
            <td className="px-3 py-2 text-right font-semibold text-accent tabular-nums">
              {fmt(row.totalPayment)}
            </td>
            <td className="px-3 py-2 text-right text-primary tabular-nums">
              {fmt(row.principalPaid)}
            </td>
            <td className="px-3 py-2 text-right tabular-nums">{fmt(row.interestPaid)}</td>
            <td className="px-3 py-2 text-right tabular-nums">{fmt(row.endingBalance)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot className="sticky bottom-0 border-t-2 border-border bg-brand-softTeal text-xs font-bold text-accent">
        <tr>
          <td className="px-3 py-2.5">Total</td>
          <td className="px-3 py-2.5 text-right tabular-nums">{result.monthlySchedule.length}</td>
          <td className="px-3 py-2.5 text-right">—</td>
          <td className="px-3 py-2.5 text-right tabular-nums">
            {fmt(result.scheduleTotals.totalPayment)}
          </td>
          <td className="px-3 py-2.5 text-right tabular-nums">
            {fmt(result.scheduleTotals.totalPrincipal)}
          </td>
          <td className="px-3 py-2.5 text-right tabular-nums">
            {fmt(result.scheduleTotals.totalInterest)}
          </td>
          <td className="px-3 py-2.5 text-right tabular-nums">{fmt(0)}</td>
        </tr>
      </tfoot>
    </table>
  );
}

export function AmortizationTable({ result }: AmortizationTableProps) {
  const [view, setView] = React.useState<'monthly' | 'yearly'>('yearly');
  const [inlineExpanded, setInlineExpanded] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const dialogTitleId = React.useId();

  React.useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [modalOpen]);

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
      <div className="rounded-xl border border-border bg-white p-4 text-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
          Amortization Schedule
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">
          No schedule is generated when Amount Financed is{' '}
          {formatCurrencyValue(result.amountFinanced, result.currency)}.
        </p>
      </div>
    );
  }

  return (
    <div id="amortization-schedule" className="scroll-mt-24 rounded-xl border border-border bg-white">
      {/* Compact Access Bar inside Right Column */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <CalendarRange className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                Amortization Schedule
              </h4>
              <p className="text-[11px] text-muted-foreground">
                {result.monthlySchedule.length} monthly installments ({result.yearlySchedule.length}{' '}
                calendar year{result.yearlySchedule.length === 1 ? '' : 's'})
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={inlineExpanded}
            onClick={() => setInlineExpanded((prev) => !prev)}
            className="h-8 flex-1 text-xs"
          >
            {inlineExpanded ? (
              <>
                <ChevronUp className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Hide Table
              </>
            ) : (
              <>
                <ChevronDown className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                View Schedule
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="h-8 text-xs"
          >
            <Maximize2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Full View
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            className="h-8 text-xs"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            CSV
          </Button>
        </div>
      </div>

      {/* Expandable Inline Preview */}
      {inlineExpanded && (
        <div className="border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background/60 px-4 py-2.5">
            <ScheduleViewControls
              view={view}
              onViewChange={setView}
              onDownloadCsv={handleDownloadCsv}
            />
          </div>
          <div className="max-h-[340px] w-full overflow-auto">
            <ScheduleTableContent result={result} view={view} />
          </div>
        </div>
      )}

      {/* Accessible Full-Width Schedule Dialog */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          className="fixed inset-0 z-50 flex items-center justify-center bg-accent/50 p-4 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/70 px-5 py-4">
              <div>
                <h3 id={dialogTitleId} className="text-base font-bold text-accent">
                  Auto Loan Amortization Schedule
                </h3>
                <p className="text-xs text-muted-foreground">
                  {result.monthlySchedule.length} monthly installments across{' '}
                  {result.yearlySchedule.length} calendar years
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ScheduleViewControls
                  view={view}
                  onViewChange={setView}
                  onDownloadCsv={handleDownloadCsv}
                />
                <button
                  type="button"
                  aria-label="Close amortization dialog"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <ScheduleTableContent result={result} view={view} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
