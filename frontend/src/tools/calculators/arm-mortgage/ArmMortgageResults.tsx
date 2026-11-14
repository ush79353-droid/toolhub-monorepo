'use client';

import * as React from 'react';
import { Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { AutoLoanChart } from '../auto-loan/AutoLoanChart';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { ArmMortgageResult } from './types';

function money(cents: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(cents / 100, currency);
}

function signedMoney(cents: number, currency: SupportedCurrency): string {
  if (cents === 0) return money(0, currency);
  const sign = cents > 0 ? '+' : '−';
  return `${sign}${money(Math.abs(cents), currency)}`;
}

function formatRate(rate: number): string {
  return `${rate.toFixed(3)}%`;
}

function formatIso(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{hint}</p> : null}
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
  const [scheduleView, setScheduleView] = React.useState<'year' | 'month'>('year');
  const [showSchedule, setShowSchedule] = React.useState(false);

  if (!result) return null;

  const currency = result.currency;
  const principal = result.totalPrincipalCents / 100;
  const interest = result.totalInterestCents / 100;
  const totalPi = principal + interest;
  const principalRatio = totalPi > 0 ? (principal / totalPi) * 100 : 0;
  const interestRatio = totalPi > 0 ? (interest / totalPi) * 100 : 0;

  const paymentRange =
    result.minPaymentCents === result.maxPaymentCents
      ? money(result.minPaymentCents, currency)
      : `${money(result.minPaymentCents, currency)} – ${money(result.maxPaymentCents, currency)}`;

  const bars = [
    { label: 'Initial payment', cents: result.initialPaymentCents, tone: 'bg-primary' },
    ...(result.firstAdjustedPaymentCents !== null
      ? [{ label: 'After first reset', cents: result.firstAdjustedPaymentCents, tone: 'bg-accent' }]
      : []),
    { label: 'Highest expected payment', cents: result.maxPaymentCents, tone: 'bg-[#0E6B75]' },
    { label: 'Contractual ceiling payment', cents: result.contractualMaxPaymentCents, tone: 'bg-[#5C8A90]' },
  ];
  const maxBar = Math.max(...bars.map((bar) => bar.cents), 1);

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
      {/* Reference Parity Master Hero Card */}
      <div className="rounded-2xl border border-primary/20 bg-brand-softTeal/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-block rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-wider">
              Monthly Payment Range
            </span>
            <p className="mt-1.5 text-2xl font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-3xl">
              {paymentRange}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/ mo</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Initial payment of {money(result.initialPaymentCents, currency)}/mo at {formatRate(result.initialRate)} for{' '}
              {result.fixedMonths / 12} years ({result.fixedMonths} months), then adjusting every{' '}
              {result.adjustEveryMonths} months.
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

        <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-border/60 pt-3.5 sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <span>APR</span>
              <InfoTooltip
                label="APR Conventions"
                text={`Reference APR (average note rate across the ${result.termYears}-year term): ${result.averageRate.toFixed(3)}%.\nTruth in Lending Actuarial APR (cash-flow IRR including upfront fees): ${result.actuarialApr.toFixed(3)}%.`}
                align="left"
              />
            </div>
            <p className="mt-0.5 text-lg font-bold text-accent tabular-nums">
              {formatRate(result.averageRate)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Actuarial: {formatRate(result.actuarialApr)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Mortgage term</p>
            <p className="mt-0.5 text-lg font-bold text-accent tabular-nums">
              {result.termYears} years
            </p>
            <p className="text-[10px] text-muted-foreground">{result.paymentCount} payments</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Paid interest</p>
            <p className="mt-0.5 text-lg font-bold text-accent tabular-nums">
              {money(result.totalInterestCents, currency)}
            </p>
            <p className="text-[10px] text-muted-foreground">Over entire loan</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Additional costs</p>
            <p className="mt-0.5 text-lg font-bold text-accent tabular-nums">
              {money(result.additionalCostsCents, currency)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {result.upfrontFeesCents > 0 ? `Fees: ${money(result.upfrontFeesCents, currency)}` : 'Zero extra fees'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Financial Breakdown Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Stat
          label="Total payments"
          value={money(result.totalPaymentsCents, currency)}
          hint={`Principal + Interest${result.upfrontFeesCents > 0 ? ' + Fees' : ''}`}
        />
        <Stat
          label="Mortgage balance"
          value={money(result.principalCents, currency)}
          hint={result.downPaymentCents > 0 ? `Down payment: ${money(result.downPaymentCents, currency)}` : '100% financed'}
        />
        <Stat
          label="Maximum interest rate"
          value={formatRate(result.rateCap)}
          hint={`Initial rate: ${formatRate(result.initialRate)}`}
        />
        <Stat
          label="First reset payment"
          value={result.firstAdjustedPaymentCents === null ? '—' : money(result.firstAdjustedPaymentCents, currency)}
          hint={
            result.firstAdjustmentPaymentNumber
              ? `Month ${result.firstAdjustmentPaymentNumber} (${formatRate(result.projectedRateAfterFirstReset ?? result.initialRate)})`
              : 'No reset in term'
          }
        />
        <Stat
          label="First reset change"
          value={result.paymentDifferenceCents === null ? '—' : signedMoney(result.paymentDifferenceCents, currency)}
          hint="Per month after fixed period"
        />
        <Stat
          label="Payoff date"
          value={formatIso(result.payoffDate)}
          hint={`${result.paymentCount} monthly payments`}
        />
      </div>

      {/* Contract Rate Limits */}
      <div className="rounded-xl border border-border bg-muted/30 p-3.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">Contract rate limits & ceilings</h3>
        <div className="mt-2.5 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-3">
          <Stat
            label="Rate cap (ceiling)"
            value={formatRate(result.maximumPermittedRate)}
            hint="Maximum interest rate"
          />
          <Stat
            label="Rate floor"
            value={formatRate(result.minimumPermittedRate)}
            hint="Minimum interest rate"
          />
          <Stat
            label="Highest contractual payment"
            value={money(result.contractualMaxPaymentCents, currency)}
            hint="If rate rises to ceiling immediately"
          />
        </div>
      </div>

      {/* Dedicated Interest-Rate Adjustment Schedule Table */}
      {result.adjustmentMilestones.length > 0 ? (
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-accent">Interest-Rate Adjustment Schedule</h3>
              <p className="text-xs text-muted-foreground">
                Year-by-year trajectory of rate adjustments, scheduled monthly payments, and principal balance.
              </p>
            </div>
          </div>
          <div className="brand-scroll mt-3 max-h-[260px] overflow-auto rounded-lg border border-border">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="sticky top-0 bg-muted/80 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
                <tr>
                  <th className="px-3 py-2 font-medium">Year</th>
                  <th className="px-3 py-2 font-medium">Interest Rate</th>
                  <th className="px-3 py-2 font-medium">Monthly Payment</th>
                  <th className="px-3 py-2 font-medium">Annual Interest</th>
                  <th className="px-3 py-2 font-medium">Remaining Balance</th>
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

      {/* Visual Chart & Payment Comparison */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AutoLoanChart
          principal={principal}
          totalInterest={interest}
          principalRatioPercent={principalRatio}
          interestRatioPercent={interestRatio}
          currency={currency}
        />

        <figure className="rounded-xl border border-border bg-white p-4">
          <figcaption className="text-sm font-medium text-accent">Payment Comparison</figcaption>
          <p className="mt-1 text-xs text-muted-foreground">
            Comparison between initial payment, first adjustment, expected peak, and contractual ceiling.
          </p>
          <div className="mt-3.5 space-y-3">
            {bars.map((bar) => (
              <div key={bar.label}>
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className="font-semibold text-accent tabular-nums">{money(bar.cents, currency)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${bar.tone}`}
                    style={{ width: `${Math.max(2, (bar.cents / maxBar) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </figure>
      </div>

      {/* Detailed Amortization Table */}
      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-sm font-medium text-accent hover:bg-muted/30"
          onClick={() => setShowSchedule((open) => !open)}
          aria-expanded={showSchedule}
        >
          <span>Detailed Amortization Schedule ({result.paymentCount} payments)</span>
          <span className="text-xs font-normal text-primary">{showSchedule ? 'Hide' : 'View Schedule'}</span>
        </button>

        {showSchedule ? (
          <div className="border-t border-border">
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5">
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
                    className={`h-8 rounded-lg px-3 text-xs font-medium transition-colors ${
                      scheduleView === id ? 'bg-primary text-white shadow-xs' : 'border border-border text-muted-foreground hover:text-foreground'
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
                className="h-8 gap-1.5 text-xs font-medium"
                onClick={downloadCsv}
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
            </div>

            <div className="brand-scroll max-h-[340px] overflow-auto border-t border-border">
              {scheduleView === 'year' ? (
                <table className="w-full min-w-[640px] text-left text-xs">
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
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="sticky top-0 bg-muted/90 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
                    <tr>
                      {['#', 'Date', 'Interest Rate', 'Payment', 'Principal', 'Interest', 'Ending Balance'].map((h) => (
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
        ) : null}
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-border bg-background/70 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Highlighted rows indicate a scheduled rate adjustment. Initial rate applies for the introductory period, then
          adjusts according to the specified adjustment parameters up to the interest rate cap. This is an educational
          estimate and not a commitment to lend.
        </p>
      </div>
    </div>
  );
}
