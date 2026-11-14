'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { ArmMortgageResult } from './types';

function money(cents: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(cents / 100, currency);
}

function formatRate(rate: number): string {
  return `${rate.toFixed(3)}%`;
}

function MetricItem({
  label,
  value,
  subtext,
  tip,
}: {
  label: string;
  value: string;
  subtext?: string;
  tip?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} align="left" /> : null}
      </div>
      <p className="mt-1 text-base font-bold text-accent tabular-nums sm:text-lg">{value}</p>
      {subtext ? <p className="mt-0.5 text-[11px] text-muted-foreground">{subtext}</p> : null}
    </div>
  );
}

export function ArmMortgageResults({
  result,
  copied,
  onCopy,
}: {
  result: ArmMortgageResult | null;
  copied: boolean;
  onCopy: () => void;
}) {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [scheduleView, setScheduleView] = React.useState<'year' | 'month'>('year');

  if (!result) return null;

  const currency = result.currency;

  const paymentRange =
    result.minPaymentCents === result.maxPaymentCents
      ? money(result.minPaymentCents, currency)
      : `${money(result.minPaymentCents, currency)} – ${money(result.maxPaymentCents, currency)}`;

  const downloadCsv = () => {
    const headers = ['Payment #', 'Date', 'Interest Rate (%)', 'Payment', 'Principal', 'Interest', 'Ending Balance'];
    const rows = result.schedule.map((r) => [
      r.paymentNumber,
      r.date,
      r.annualRate.toFixed(3),
      (r.paymentCents / 100).toFixed(2),
      (r.principalCents / 100).toFixed(2),
      (r.interestCents / 100).toFixed(2),
      (r.balanceCents / 100).toFixed(2),
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `arm-mortgage-schedule-${result.termYears}yr.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* 1. Primary Compact Results Card */}
      <div className="rounded-2xl border border-primary/20 bg-brand-softTeal/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-block rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              Monthly Payment Range
            </span>
            <p className="mt-1.5 text-2xl font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-3xl">
              {paymentRange}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/ mo</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Initial payment of {money(result.initialPaymentCents, currency)}/mo at {formatRate(result.initialRate)} for{' '}
              {result.fixedMonths / 12} years ({result.fixedMonths} months), then adjusting every{' '}
              {result.adjustEveryMonths} months up to a {formatRate(result.maximumPermittedRate)} cap.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-8 bg-white px-2.5 text-xs font-medium shadow-xs hover:bg-slate-50"
            onClick={onCopy}
          >
            {copied ? 'Copied' : 'Copy Results'}
          </Button>
        </div>

        {/* Essential Supporting Metrics */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-border/60 pt-3.5 sm:grid-cols-3">
          <MetricItem
            label="APR"
            value={formatRate(result.averageRate)}
            subtext={`Actuarial: ${formatRate(result.actuarialApr)}`}
            tip={`Reference APR (arithmetic average note rate across the ${result.termYears}-year term): ${result.averageRate.toFixed(3)}%.\nTruth in Lending Actuarial APR (cash-flow IRR including upfront fees): ${result.actuarialApr.toFixed(3)}%.`}
          />

          <MetricItem
            label="Mortgage term"
            value={`${result.termYears} years`}
            subtext={`${result.paymentCount} payments`}
          />

          <MetricItem
            label="Total interest paid"
            value={money(result.totalInterestCents, currency)}
            subtext="Over full loan term"
          />

          <MetricItem
            label="Additional costs"
            value={money(result.additionalCostsCents, currency)}
            subtext={result.upfrontFeesCents > 0 ? `Fees: ${money(result.upfrontFeesCents, currency)}` : 'Zero extra fees'}
          />

          <MetricItem
            label="Total payments"
            value={money(result.totalPaymentsCents, currency)}
            subtext={`Principal + Interest${result.upfrontFeesCents > 0 ? ' + Fees' : ''}`}
          />

          <MetricItem
            label="Mortgage balance"
            value={money(result.principalCents, currency)}
            subtext="Initial principal"
          />
        </div>
      </div>

      {/* 2. Optional Expandable Amortization & Rate Adjustment Schedule */}
      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-sm font-medium text-accent hover:bg-muted/30"
          onClick={() => setScheduleOpen((open) => !open)}
          aria-expanded={scheduleOpen}
        >
          <span>Detailed Amortization & Adjustment Schedule</span>
          <span className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
            {scheduleOpen ? 'Hide' : 'View Schedule'}
            {scheduleOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>

        {scheduleOpen ? (
          <div className="border-t border-border p-3.5 space-y-4">
            {/* Year-by-year Rate Adjustment Milestone Table */}
            {result.adjustmentMilestones.length > 0 ? (
              <div>
                <div className="flex items-center justify-between pb-2">
                  <h4 className="text-xs font-semibold text-accent uppercase tracking-wider">
                    Rate Adjustment Trajectory
                  </h4>
                </div>
                <div className="brand-scroll max-h-[220px] overflow-auto rounded-lg border border-border">
                  <table className="w-full min-w-[500px] text-left text-xs">
                    <thead className="sticky top-0 bg-muted/90 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
                      <tr>
                        <th className="px-3 py-2 font-medium">Year</th>
                        <th className="px-3 py-2 font-medium">Rate</th>
                        <th className="px-3 py-2 font-medium">Monthly Payment</th>
                        <th className="px-3 py-2 font-medium">Annual Interest</th>
                        <th className="px-3 py-2 font-medium">Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.adjustmentMilestones.map((milestone) => (
                        <tr
                          key={milestone.year}
                          className={`border-t border-border/70 ${
                            milestone.isAdjustment ? 'bg-brand-softTeal/40 font-medium' : 'hover:bg-muted/30'
                          }`}
                        >
                          <td className="px-3 py-2 tabular-nums text-accent">
                            Year {milestone.year}
                            {milestone.isAdjustment ? (
                              <span className="ml-1.5 rounded-sm bg-primary/10 px-1 py-0.2 text-[10px] text-primary">
                                Reset
                              </span>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 tabular-nums text-accent">{formatRate(milestone.rate)}</td>
                          <td className="px-3 py-2 tabular-nums text-accent">{money(milestone.monthlyPaymentCents, currency)}</td>
                          <td className="px-3 py-2 tabular-nums text-muted-foreground">{money(milestone.annualInterestCents, currency)}</td>
                          <td className="px-3 py-2 tabular-nums font-semibold text-accent">{money(milestone.endingBalanceCents, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {/* Amortization schedule toggle and CSV download */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <div className="flex gap-1.5" role="group" aria-label="Schedule grouping">
                  {(
                    [
                      ['year', 'Year by year'],
                      ['month', 'Month by month'],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={scheduleView === id}
                      onClick={() => setScheduleView(id)}
                      className={`h-7 rounded-md px-2.5 text-xs font-medium transition-colors ${
                        scheduleView === id
                          ? 'bg-primary text-white shadow-xs'
                          : 'border border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs font-medium"
                  onClick={downloadCsv}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>
              </div>

              <div className="brand-scroll max-h-[260px] overflow-auto rounded-lg border border-border">
                {scheduleView === 'year' ? (
                  <table className="w-full min-w-[560px] text-left text-xs">
                    <thead className="sticky top-0 bg-muted/90 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
                      <tr>
                        {['Year', 'Ending Rate', 'Monthly Payment', 'Principal', 'Interest', 'Ending Balance'].map((h) => (
                          <th key={h} className="px-3 py-2 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlySchedule.map((row) => (
                        <tr key={row.year} className={`border-t border-border/70 ${row.adjusted ? 'bg-brand-softTeal/40' : 'hover:bg-muted/30'}`}>
                          <td className="px-3 py-2 tabular-nums font-medium text-accent">Year {row.year}</td>
                          <td className="px-3 py-2 tabular-nums text-accent">{formatRate(row.endingRate)}</td>
                          <td className="px-3 py-2 tabular-nums text-accent">{money(row.lastPaymentCents, currency)}</td>
                          <td className="px-3 py-2 tabular-nums text-muted-foreground">{money(row.principalCents, currency)}</td>
                          <td className="px-3 py-2 tabular-nums text-muted-foreground">{money(row.interestCents, currency)}</td>
                          <td className="px-3 py-2 tabular-nums font-semibold text-accent">{money(row.balanceCents, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full min-w-[560px] text-left text-xs">
                    <thead className="sticky top-0 bg-muted/90 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
                      <tr>
                        {['#', 'Date', 'Rate', 'Payment', 'Principal', 'Interest', 'Ending Balance'].map((h) => (
                          <th key={h} className="px-3 py-2 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row) => (
                        <tr
                          key={row.paymentNumber}
                          className={`border-t border-border/70 ${row.rateAdjusted ? 'bg-brand-softTeal/40' : 'hover:bg-muted/30'}`}
                        >
                          <td className="px-3 py-2 tabular-nums font-medium text-accent">{row.paymentNumber}</td>
                          <td className="px-3 py-2 text-muted-foreground">{row.date}</td>
                          <td className="px-3 py-2 tabular-nums text-accent">
                            {formatRate(row.annualRate)}
                            {row.rateAdjusted ? ' *' : ''}
                          </td>
                          <td className="px-3 py-2 tabular-nums font-medium text-accent">{money(row.paymentCents, currency)}</td>
                          <td className="px-3 py-2 tabular-nums text-muted-foreground">{money(row.principalCents, currency)}</td>
                          <td className="px-3 py-2 tabular-nums text-muted-foreground">{money(row.interestCents, currency)}</td>
                          <td className="px-3 py-2 tabular-nums font-semibold text-accent">{money(row.balanceCents, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 3. Compact Educational Note */}
      <div className="flex items-start gap-2 rounded-xl border border-border bg-background/70 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Estimates are based on the specified initial interest rate, adjustment frequency, expected adjustment rate, and interest rate cap. This is an educational projection and not a commitment to lend.
        </p>
      </div>
    </div>
  );
}
