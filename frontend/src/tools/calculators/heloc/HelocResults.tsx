'use client';

import { useMemo, useState } from 'react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatHelocMoney, formatHelocRate } from './calculation';
import { HelocChart } from './HelocChart';
import type { HelocResult } from './types';

const PAGE_SIZE = 24;

interface HelocResultsProps {
  result: HelocResult | null;
  drawPeriodYears: string;
  repaymentTermYears: string;
  initialInterestRate: string;
}

export function HelocResults({
  result,
  drawPeriodYears,
  repaymentTermYears,
  initialInterestRate,
}: HelocResultsProps) {
  const [page, setPage] = useState(0);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const pageCount = result
    ? Math.max(1, Math.ceil(result.schedule.length / PAGE_SIZE))
    : 1;

  const safePage = Math.min(page, pageCount - 1);

  const rows = useMemo(() => {
    if (!result) return [];
    const start = safePage * PAGE_SIZE;
    return result.schedule.slice(start, start + PAGE_SIZE);
  }, [result, safePage]);

  if (!result) {
    return (
      <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Results
        </legend>
        <p className="text-sm text-muted-foreground">
          Enter HELOC details to see draw-period interest-only payments,
          repayment installments, fees, and the amortization schedule.
        </p>
      </fieldset>
    );
  }

  const symbol = getCurrencySymbol(result.currency);
  const drawYears = Number(drawPeriodYears) || result.drawMonths / 12;
  const repayYears = Number(repaymentTermYears) || result.repaymentMonths / 12;
  const totalYears = result.totalMonths / 12;

  return (
    <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <legend className="px-1 text-[13px] font-semibold text-accent">
        Results
      </legend>

      <div className="grid gap-2 sm:grid-cols-2">
        <Metric
          label="Draw-period payment (interest-only)"
          value={`${symbol}${result.formattedInitialDrawPayment}/mo`}
        />
        <Metric
          label="Initial repayment payment (P&I)"
          value={`${symbol}${result.formattedInitialRepaymentPayment}/mo`}
        />
        <Metric
          label="Initial annual interest rate"
          value={`${initialInterestRate || formatHelocRate(0)}%`}
        />
        <Metric
          label="Loan term"
          value={`${drawYears} y draw + ${repayYears} y repayment (${totalYears} y total)`}
        />
        <Metric
          label="Paid interest"
          value={`${symbol}${result.formattedTotalInterest}`}
        />
        <Metric
          label="Additional costs (fees)"
          value={`${symbol}${result.formattedTotalFees}`}
        />
        <Metric
          label="Total cash outflow"
          value={`${symbol}${result.formattedTotalCashOutflow}`}
          emphasize
        />
        <Metric
          label="Financing cost (interest + fees)"
          value={`${symbol}${result.formattedFinancingCost}`}
        />
      </div>

      <dl className="grid gap-1.5 rounded-lg border border-border bg-white p-3 text-xs text-accent sm:grid-cols-2 sm:text-sm">
        <div className="flex justify-between gap-2">
          <dt>Initial principal</dt>
          <dd className="tabular-nums font-medium">
            {symbol}
            {result.formattedInitialPrincipal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Draw-period interest</dt>
          <dd className="tabular-nums font-medium">
            {symbol}
            {result.formattedDrawPeriodInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Repayment-period interest</dt>
          <dd className="tabular-nums font-medium">
            {symbol}
            {result.formattedRepaymentPeriodInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Upfront fees</dt>
          <dd className="tabular-nums font-medium">
            {symbol}
            {result.formattedUpfrontFees}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Annual fees (modeled term)</dt>
          <dd className="tabular-nums font-medium">
            {symbol}
            {result.formattedRecurringFees}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Principal repaid</dt>
          <dd className="tabular-nums font-medium">
            {symbol}
            {formatHelocMoney(result.principalRepaid, result.currency)}
          </dd>
        </div>
      </dl>

      <HelocChart
        points={result.chartPoints}
        currency={result.currency}
        drawPeriodYears={drawYears}
      />

      <div className="rounded-lg border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
          aria-expanded={scheduleOpen}
          onClick={() => setScheduleOpen((o) => !o)}
        >
          <span>Amortization schedule</span>
          <span className="text-xs font-normal text-muted-foreground">
            {scheduleOpen ? 'Hide' : 'Show'} · {result.schedule.length} months
          </span>
        </button>
        {scheduleOpen ? (
          <div className="border-t border-border p-2 sm:p-3">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Month</th>
                    <th className="px-2 py-1.5 font-medium">Stage</th>
                    <th className="px-2 py-1.5 font-medium">Start bal.</th>
                    <th className="px-2 py-1.5 font-medium">APR</th>
                    <th className="px-2 py-1.5 font-medium">Payment</th>
                    <th className="px-2 py-1.5 font-medium">Principal</th>
                    <th className="px-2 py-1.5 font-medium">Interest</th>
                    <th className="px-2 py-1.5 font-medium">Fees</th>
                    <th className="px-2 py-1.5 font-medium">End bal.</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.month} className="border-t border-border">
                      <td className="px-2 py-1 tabular-nums">{row.month}</td>
                      <td className="px-2 py-1 capitalize">{row.phase}</td>
                      <td className="px-2 py-1 tabular-nums">
                        {formatHelocMoney(row.beginningBalance, result.currency)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {formatHelocRate(row.annualInterestRate)}%
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {formatHelocMoney(row.scheduledPayment, result.currency)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {formatHelocMoney(row.monthlyPrincipal, result.currency)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {formatHelocMoney(row.monthlyInterest, result.currency)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {formatHelocMoney(row.fees, result.currency)}
                      </td>
                      <td className="px-2 py-1 tabular-nums">
                        {formatHelocMoney(row.endingBalance, result.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                Page {safePage + 1} of {pageCount}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-md border border-border px-2 py-1 disabled:opacity-40"
                  disabled={safePage <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="rounded-md border border-border px-2 py-1 disabled:opacity-40"
                  disabled={safePage >= pageCount - 1}
                  onClick={() =>
                    setPage((p) => Math.min(pageCount - 1, p + 1))
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Model assumptions: interest-only during the draw period with no extra
        draws or principal payments; amortizing repayment afterward; annual fees
        charged once every 12 months; upfront fees paid separately (not financed
        into principal). Adjustable-rate projections are assumptions, not market
        forecasts.
      </p>
    </fieldset>
  );
}

function Metric({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p
        className={`mt-0.5 text-sm tabular-nums text-accent ${
          emphasize ? 'font-semibold' : 'font-medium'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
