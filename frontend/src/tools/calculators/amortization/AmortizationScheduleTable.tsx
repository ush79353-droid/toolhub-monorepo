'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadTextFile } from '@/tools/shared/download';
import {
  buildAmortizationCsv,
  formatCurrencyValue,
  formatDisplayDate,
} from './calculation';
import type {
  AmortizationResult,
  AmortizationScheduleRow,
  AmortizationYearlyRow,
} from './types';

interface AmortizationScheduleTableProps {
  result: AmortizationResult;
}

export function AmortizationScheduleTable({ result }: AmortizationScheduleTableProps) {
  const [view, setView] = React.useState<'period' | 'yearly'>('period');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [pageSize, setPageSize] = React.useState<number>(12);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const fmt = (val: number) => formatCurrencyValue(val, result.currency);
  const hasExtra = result.totalExtraPaymentAmount > 0;

  // Handle CSV Download
  const handleDownloadCsv = () => {
    const csvContent = buildAmortizationCsv(result);
    const filename = `amortization-schedule-${result.loanAmount}-${result.termYears}yr.csv`;
    downloadTextFile(csvContent, filename);
  };

  // Keyboard escape for modal
  React.useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Data for current view
  const currentRows = view === 'period' ? result.schedule : result.yearlySchedule;
  const totalRowsCount = currentRows.length;
  const effectivePageSize = pageSize === -1 ? totalRowsCount : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalRowsCount / effectivePageSize));
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * effectivePageSize;
  const displayedRows =
    pageSize === -1
      ? currentRows
      : currentRows.slice(startIndex, startIndex + effectivePageSize);

  const renderTable = () => (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-xs">
        <thead className="sticky top-0 z-10 border-b border-border bg-muted/80 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
          <tr>
            <th scope="col" className="px-3 py-2.5">
              {view === 'period' ? 'Pmt #' : 'Year'}
            </th>
            <th scope="col" className="px-3 py-2.5">
              {view === 'period' ? 'Date' : 'Year / Count'}
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Opening Balance
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Regular Pmt
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Principal
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Interest
            </th>
            {hasExtra && (
              <th scope="col" className="px-3 py-2.5 text-right">
                Extra
              </th>
            )}
            <th scope="col" className="px-3 py-2.5 text-right">
              Total Pmt
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              Ending Balance
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 bg-white">
          {view === 'period'
            ? (displayedRows as AmortizationScheduleRow[]).map((row) => (
                <tr key={`period-${row.periodNumber}`} className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-2 font-medium text-foreground tabular-nums">
                    {row.periodNumber}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">
                    {formatDisplayDate(row.paymentDate)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                    {fmt(row.openingBalance)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-foreground tabular-nums">
                    {fmt(row.scheduledPayment)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-primary tabular-nums">
                    {fmt(row.principalPaid)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                    {fmt(row.interestPaid)}
                  </td>
                  {hasExtra && (
                    <td className="px-3 py-2 text-right font-medium text-emerald-600 tabular-nums">
                      {row.extraPayment > 0 ? fmt(row.extraPayment) : '—'}
                    </td>
                  )}
                  <td className="px-3 py-2 text-right font-semibold text-foreground tabular-nums">
                    {fmt(row.totalPayment)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-foreground tabular-nums">
                    {fmt(row.closingBalance)}
                  </td>
                </tr>
              ))
            : (displayedRows as AmortizationYearlyRow[]).map((row) => (
                <tr key={`year-${row.year}`} className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-2 font-medium text-foreground tabular-nums">
                    Yr {row.year}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">
                    {row.calendarYear} ({row.paymentsCount} pmts)
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                    {fmt(row.openingBalance)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-foreground tabular-nums">
                    {fmt(row.scheduledPayment)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-primary tabular-nums">
                    {fmt(row.principalPaid)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                    {fmt(row.interestPaid)}
                  </td>
                  {hasExtra && (
                    <td className="px-3 py-2 text-right font-medium text-emerald-600 tabular-nums">
                      {row.extraPayment > 0 ? fmt(row.extraPayment) : '—'}
                    </td>
                  )}
                  <td className="px-3 py-2 text-right font-semibold text-foreground tabular-nums">
                    {fmt(row.totalPayment)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-foreground tabular-nums">
                    {fmt(row.closingBalance)}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4 rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-accent">Amortization Schedule</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {view === 'period' ? `${result.actualPaymentsCount} Payments` : `${result.yearlySchedule.length} Years`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher: Period vs Yearly */}
          <div className="inline-flex h-8 items-center rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => {
                setView('period');
                setCurrentPage(1);
              }}
              className={`h-full rounded-md px-2.5 text-xs font-medium transition-colors ${
                view === 'period'
                  ? 'bg-white text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              By Payment
            </button>
            <button
              type="button"
              onClick={() => {
                setView('yearly');
                setCurrentPage(1);
              }}
              className={`h-full rounded-md px-2.5 text-xs font-medium transition-colors ${
                view === 'yearly'
                  ? 'bg-white text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual Summary
            </button>
          </div>

          {/* Download CSV */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            className="h-8 gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>

          {/* Full-screen expand */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 gap-1.5 text-xs"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Expand
          </Button>
        </div>
      </div>

      {/* Render Main Table */}
      <div className="rounded-lg border border-border/80 overflow-hidden">
        {renderTable()}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pt-1">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-7 rounded border border-border bg-white px-2 text-xs text-foreground cursor-pointer"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={60}>60</option>
            <option value={-1}>All ({totalRowsCount})</option>
          </select>
          <span>
            Showing {startIndex + 1}–
            {pageSize === -1 ? totalRowsCount : Math.min(startIndex + pageSize, totalRowsCount)} of{' '}
            {totalRowsCount}
          </span>
        </div>

        {pageSize !== -1 && totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 font-medium tabular-nums text-foreground">
              {safePage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 p-0"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Full-Screen Portal Modal */}
      {isModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-150"
            role="dialog"
            aria-modal="true"
            aria-label="Full Amortization Schedule"
          >
            <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-border bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold text-accent">
                    Complete Amortization Schedule
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {result.scheduledPaymentsCount} scheduled payments • {result.actualPaymentsCount}{' '}
                    actual until full payoff
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCsv}
                    className="gap-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </Button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Close schedule modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Scrollable Table */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="rounded-lg border border-border/80 overflow-hidden">
                  {renderTable()}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-border px-6 py-3 text-right">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Close Schedule
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
