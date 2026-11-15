'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Download, Maximize2, X } from 'lucide-react';
import { downloadTextFile } from '@/tools/shared/download';
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
}: {
  view: 'monthly' | 'yearly';
  onViewChange: (view: 'monthly' | 'yearly') => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Amortization schedule view"
      className="inline-flex h-8 items-center rounded-lg border border-border bg-background p-0.5"
    >
      <button
        type="button"
        role="tab"
        aria-selected={view === 'monthly'}
        onClick={() => onViewChange('monthly')}
        className={`h-full rounded-md px-2.5 text-xs font-medium transition-colors ${
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
        className={`h-full rounded-md px-2.5 text-xs font-medium transition-colors ${
          view === 'yearly'
            ? 'bg-primary text-white shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Yearly
      </button>
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
      <table className="w-full min-w-[620px] text-left text-xs">
        <thead className="sticky top-0 z-10 border-b border-border bg-muted text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
              <td className="px-3 py-2 text-right font-medium text-accent tabular-nums">
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
        <tfoot className="sticky bottom-0 border-t-2 border-border bg-brand-softTeal text-xs font-semibold text-accent">
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
    <table className="w-full min-w-[580px] text-left text-xs">
      <thead className="sticky top-0 z-10 border-b border-border bg-muted text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
            <td className="px-3 py-2 font-medium text-accent">{row.year}</td>
            <td className="px-3 py-2 text-right tabular-nums">{row.paymentsCount}</td>
            <td className="px-3 py-2 text-right tabular-nums">{fmt(row.beginningBalance)}</td>
            <td className="px-3 py-2 text-right font-medium text-accent tabular-nums">
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
      <tfoot className="sticky bottom-0 border-t-2 border-border bg-brand-softTeal text-xs font-semibold text-accent">
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [modalOpen]);

  React.useEffect(() => {
    if (!inlineExpanded) return;
    const node = document.getElementById('amortization-schedule');
    window.requestAnimationFrame(() => {
      node?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }, [inlineExpanded]);

  const handleDownloadCsv = () => {
    const csv = `\uFEFF${buildAmortizationCsv(result, view, result.currency)}`;
    downloadTextFile(csv, `auto-loan-amortization-${view}.csv`);
  };

  if (result.monthlySchedule.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-4 text-center">
        <h3 className="text-sm font-medium text-accent">Amortization Schedule</h3>
        <p className="mt-1 text-xs font-normal text-muted-foreground">
          No schedule is generated when Amount Financed is{' '}
          {formatCurrencyValue(result.amountFinanced, result.currency)}.
        </p>
      </div>
    );
  }

  return (
    <div id="amortization-schedule" className="scroll-mt-24 rounded-xl border border-border bg-white">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-accent">Amortization Schedule</h3>
            <p className="text-xs font-normal text-muted-foreground">
              {result.monthlySchedule.length} monthly installments ({result.yearlySchedule.length}{' '}
              calendar year{result.yearlySchedule.length === 1 ? '' : 's'})
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={inlineExpanded}
            onClick={() => setInlineExpanded((prev) => !prev)}
            className="h-9 flex-1 text-xs font-medium"
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
            className="h-9 text-xs font-medium"
          >
            <Maximize2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Full View
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            className="h-9 text-xs font-medium"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            CSV
          </Button>
        </div>
      </div>

      {inlineExpanded && (
        <div className="border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background/60 px-4 py-2.5">
            <ScheduleViewControls view={view} onViewChange={setView} />
          </div>
          <div className="brand-scroll max-h-[320px] w-full overflow-auto">
            <ScheduleTableContent result={result} view={view} />
          </div>
        </div>
      )}

      {modalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-accent/50 p-4 backdrop-blur-[2px]"
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalOpen(false);
            }}
          >
            <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/70 px-5 py-4">
                <div>
                  <h3 id={dialogTitleId} className="text-base font-semibold text-accent">
                    Auto Loan Amortization Schedule
                  </h3>
                  <p className="text-xs font-normal text-muted-foreground">
                    {result.monthlySchedule.length} monthly installments across{' '}
                    {result.yearlySchedule.length} calendar years
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <ScheduleViewControls view={view} onViewChange={setView} />
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

              <div className="brand-scroll flex-1 overflow-auto">
                <ScheduleTableContent result={result} view={view} />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
