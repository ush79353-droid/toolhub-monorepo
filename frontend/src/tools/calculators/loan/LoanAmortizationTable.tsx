'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { CalendarRange, ChevronDown, ChevronUp, Download, Maximize2, X } from 'lucide-react';
import {
  buildLoanAmortizationCsv,
  formatCurrencyValue,
  formatDisplayDate,
  getFrequencyPeriodLabel,
} from './calculation';
import type { LoanResult } from './types';

interface LoanAmortizationTableProps {
  result: LoanResult;
}

function ScheduleViewControls({
  view,
  periodLabel,
  onViewChange,
  onDownloadCsv,
}: {
  view: 'period' | 'yearly';
  periodLabel: string;
  onViewChange: (view: 'period' | 'yearly') => void;
  onDownloadCsv: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="tablist"
        aria-label="Amortization schedule view"
        className="inline-flex h-8 items-center rounded-lg border border-border bg-background p-0.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === 'period'}
          onClick={() => onViewChange('period')}
          className={`h-full rounded-md px-2.5 text-xs font-medium transition-colors ${
            view === 'period'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {periodLabel}
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

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onDownloadCsv}
        className="h-8 text-xs font-medium"
      >
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
  result: LoanResult;
  view: 'period' | 'yearly';
}) {
  const fmt = (value: number) => formatCurrencyValue(value, result.currency);
  const showExtraColumn = result.totalExtraPayments > 0;
  const showPhaseColumn = result.loanMode === 'interest-only';

  if (view === 'period') {
    return (
      <table className="w-full min-w-[660px] text-left text-xs">
        <thead className="sticky top-0 z-10 border-b border-border bg-muted text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2.5">
              #
            </th>
            <th scope="col" className="px-3 py-2.5">
              Date
            </th>
            {showPhaseColumn && (
              <th scope="col" className="px-3 py-2.5">
                Phase
              </th>
            )}
            <th scope="col" className="px-3 py-2.5 text-right">
              Beginning
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Regular
            </th>
            {showExtraColumn && (
              <th scope="col" className="px-3 py-2.5 text-right">
                Extra
              </th>
            )}
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
          {result.schedule.map((row) => (
            <tr key={row.periodNumber} className="hover:bg-muted/35">
              <td className="px-3 py-2 font-mono text-muted-foreground">{row.periodNumber}</td>
              <td className="px-3 py-2 whitespace-nowrap">{formatDisplayDate(row.paymentDate)}</td>
              {showPhaseColumn && (
                <td className="px-3 py-2 whitespace-nowrap text-[11px] text-muted-foreground">
                  {row.phase === 'interest-only' ? 'Interest-Only' : 'Amortized'}
                </td>
              )}
              <td className="px-3 py-2 text-right tabular-nums">{fmt(row.beginningBalance)}</td>
              <td className="px-3 py-2 text-right font-medium text-accent tabular-nums">
                {fmt(row.regularPayment)}
              </td>
              {showExtraColumn && (
                <td className="px-3 py-2 text-right font-medium text-primary tabular-nums">
                  {row.extraPayment > 0 ? fmt(row.extraPayment) : '—'}
                </td>
              )}
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
            <td className="px-3 py-2.5">{result.actualPaymentsCount} pmt</td>
            {showPhaseColumn && <td className="px-3 py-2.5">—</td>}
            <td className="px-3 py-2.5 text-right">—</td>
            <td className="px-3 py-2.5 text-right tabular-nums">
              {fmt(result.scheduleTotals.regularPayment)}
            </td>
            {showExtraColumn && (
              <td className="px-3 py-2.5 text-right tabular-nums">
                {fmt(result.scheduleTotals.extraPayment)}
              </td>
            )}
            <td className="px-3 py-2.5 text-right tabular-nums">
              {fmt(result.scheduleTotals.totalPrincipal)}
            </td>
            <td className="px-3 py-2.5 text-right tabular-nums">
              {fmt(result.scheduleTotals.totalInterest)}
            </td>
            <td className="px-3 py-2.5 text-right tabular-nums">
              {fmt(result.remainingBalanceAtEnd)}
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }

  return (
    <table className="w-full min-w-[600px] text-left text-xs">
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
            Regular
          </th>
          {showExtraColumn && (
            <th scope="col" className="px-3 py-2.5 text-right">
              Extra
            </th>
          )}
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
              {fmt(row.regularPayment)}
            </td>
            {showExtraColumn && (
              <td className="px-3 py-2 text-right font-medium text-primary tabular-nums">
                {row.extraPayment > 0 ? fmt(row.extraPayment) : '—'}
              </td>
            )}
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
          <td className="px-3 py-2.5 text-right tabular-nums">{result.actualPaymentsCount}</td>
          <td className="px-3 py-2.5 text-right">—</td>
          <td className="px-3 py-2.5 text-right tabular-nums">
            {fmt(result.scheduleTotals.regularPayment)}
          </td>
          {showExtraColumn && (
            <td className="px-3 py-2.5 text-right tabular-nums">
              {fmt(result.scheduleTotals.extraPayment)}
            </td>
          )}
          <td className="px-3 py-2.5 text-right tabular-nums">
            {fmt(result.scheduleTotals.totalPrincipal)}
          </td>
          <td className="px-3 py-2.5 text-right tabular-nums">
            {fmt(result.scheduleTotals.totalInterest)}
          </td>
          <td className="px-3 py-2.5 text-right tabular-nums">
            {fmt(result.remainingBalanceAtEnd)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export function LoanAmortizationTable({ result }: LoanAmortizationTableProps) {
  const [view, setView] = React.useState<'period' | 'yearly'>('yearly');
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

  const periodLabel = getFrequencyPeriodLabel(result.paymentFrequency);

  const handleDownloadCsv = () => {
    const csv = buildLoanAmortizationCsv(result, view, result.currency);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `loan-amortization-${view === 'period' ? periodLabel.toLowerCase() : 'yearly'}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (result.schedule.length === 0) {
    return null;
  }

  return (
    <div id="loan-amortization-schedule" className="scroll-mt-24 rounded-xl border border-border bg-white">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <CalendarRange className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-accent">Amortization Schedule</h3>
              <p className="text-xs font-normal text-muted-foreground">
                {result.actualPaymentsCount} {periodLabel.toLowerCase()} payment
                {result.actualPaymentsCount === 1 ? '' : 's'} ({result.yearlySchedule.length}{' '}
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
            <ScheduleViewControls
              view={view}
              periodLabel={periodLabel}
              onViewChange={setView}
              onDownloadCsv={handleDownloadCsv}
            />
          </div>
          <div className="max-h-[320px] w-full overflow-auto">
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
                    Loan Amortization Schedule
                  </h3>
                  <p className="text-xs font-normal text-muted-foreground">
                    {result.actualPaymentsCount} {periodLabel.toLowerCase()} payments across{' '}
                    {result.yearlySchedule.length} calendar year
                    {result.yearlySchedule.length === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <ScheduleViewControls
                    view={view}
                    periodLabel={periodLabel}
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
          </div>,
          document.body
        )}
    </div>
  );
}

