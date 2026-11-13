'use client';

import * as React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { AutoLoanChart } from '../auto-loan/AutoLoanChart';
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

  const bars = [
    { label: 'Initial payment', cents: result.initialPaymentCents, tone: 'bg-primary' },
    ...(result.firstAdjustedPaymentCents !== null
      ? [{ label: 'After first reset (assumption)', cents: result.firstAdjustedPaymentCents, tone: 'bg-accent' }]
      : []),
    { label: 'Highest on your assumption', cents: result.maxProjectedPaymentCents, tone: 'bg-[#0E6B75]' },
    { label: 'Highest if caps bind upward', cents: result.contractualMaxPaymentCents, tone: 'bg-[#5C8A90]' },
  ];
  const maxBar = Math.max(...bars.map((bar) => bar.cents), 1);

  return (
    <div className="space-y-3.5">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[13px] font-medium text-accent">Initial principal and interest</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {money(result.initialPaymentCents, currency)}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">/ mo</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatRate(result.initialRate)} for {result.fixedMonths} months, then a reset every{' '}
              {result.adjustEveryMonths} months. Later rates are assumptions, not a forecast.
            </p>
          </div>
          <Button type="button" variant="outline" className="h-8 bg-white px-2.5 text-xs font-medium" onClick={onCopy}>
            {copied ? 'Copied' : 'Copy Results'}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-accent">Your rate assumption</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <Stat
            label="Payment after first reset"
            value={result.firstAdjustedPaymentCents === null ? '—' : money(result.firstAdjustedPaymentCents, currency)}
            hint={
              result.firstAdjustmentPaymentNumber
                ? `Payment ${result.firstAdjustmentPaymentNumber}`
                : 'No reset inside the term'
            }
          />
          <Stat
            label="Change vs initial payment"
            value={result.paymentDifferenceCents === null ? '—' : signedMoney(result.paymentDifferenceCents, currency)}
            hint="Projected, after caps"
          />
          <Stat label="Rate in effect now" value={formatRate(result.initialRate)} hint="Initial note rate" />
          <Stat
            label="Projected rate at first reset"
            value={result.projectedRateAfterFirstReset === null ? '—' : formatRate(result.projectedRateAfterFirstReset)}
            hint={`Index + margin starts at ${formatRate(result.fullyIndexedRate)}`}
          />
          <Stat
            label="Highest projected payment"
            value={money(result.maxProjectedPaymentCents, currency)}
            hint="Largest P&I on the path you entered"
          />
          <Stat
            label="Total interest"
            value={money(result.totalInterestCents, currency)}
            hint="On this assumption only"
          />
          <Stat label="Total principal and interest" value={money(result.totalPaymentsCents, currency)} />
          <Stat
            label="Estimated housing payment"
            value={money(result.initialHousingPaymentCents, currency)}
            hint={
              result.housingExtrasCents > 0
                ? `Includes ${money(result.housingExtrasCents, currency)} tax, insurance, HOA, and PMI`
                : 'P&I only — housing extras are zero'
            }
          />
          <Stat
            label="Payoff"
            value={formatIso(result.payoffDate)}
            hint={`${result.paymentCount} monthly payments`}
          />
          <Stat
            label="Loan amount"
            value={money(result.principalCents, currency)}
            hint={`Down payment ${money(result.downPaymentCents, currency)}`}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-3.5">
        <h3 className="text-sm font-medium text-accent">Contract rate limits</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          These come from the caps you entered. They are not the same as the payment on your index assumption.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-3">
          <Stat label="Maximum permitted rate" value={formatRate(result.maximumPermittedRate)} hint="Initial + lifetime increase" />
          <Stat label="Minimum permitted rate" value={formatRate(result.minimumPermittedRate)} hint="Initial − lifetime decrease, or 0%" />
          <Stat
            label="Highest payment if caps bind"
            value={money(result.contractualMaxPaymentCents, currency)}
            hint="Rate rises as fast as the caps allow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <AutoLoanChart
          principal={principal}
          totalInterest={interest}
          principalRatioPercent={principalRatio}
          interestRatioPercent={interestRatio}
          currency={currency}
        />
        <figure className="rounded-xl border border-border bg-white p-4">
          <figcaption className="text-sm font-medium text-accent">Payment comparison</figcaption>
          <p className="mt-1 text-xs text-muted-foreground">
            The last bar is the contractual cap path. The others follow the index, margin, and step you entered.
          </p>
          <div className="mt-3 space-y-2.5">
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

      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-sm font-medium text-accent"
          onClick={() => setShowSchedule((open) => !open)}
          aria-expanded={showSchedule}
        >
          Amortization schedule ({result.paymentCount} payments)
          <span className="text-xs font-normal text-primary">{showSchedule ? 'Hide' : 'View'}</span>
        </button>
        {showSchedule ? (
          <div className="border-t border-border">
            <div className="flex gap-2 px-3.5 py-2.5" role="group" aria-label="Schedule grouping">
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
                  className={`h-8 rounded-lg px-3 text-xs font-medium ${
                    scheduleView === id ? 'bg-primary text-white' : 'border border-border text-muted-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="brand-scroll max-h-[320px] overflow-auto border-t border-border">
              {scheduleView === 'year' ? (
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="sticky top-0 bg-muted text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <tr>
                      {['Year', 'Ending rate', 'Last payment', 'Principal', 'Interest', 'Balance'].map((h) => (
                        <th key={h} className="px-3 py-2 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlySchedule.map((row) => (
                      <tr key={row.year} className={row.adjusted ? 'bg-brand-softTeal/60' : 'hover:bg-muted/35'}>
                        <td className="px-3 py-2 tabular-nums">{row.year}</td>
                        <td className="px-3 py-2 tabular-nums">{formatRate(row.endingRate)}</td>
                        <td className="px-3 py-2 tabular-nums">{money(row.lastPaymentCents, currency)}</td>
                        <td className="px-3 py-2 tabular-nums">{money(row.principalCents, currency)}</td>
                        <td className="px-3 py-2 tabular-nums">{money(row.interestCents, currency)}</td>
                        <td className="px-3 py-2 tabular-nums">{money(row.balanceCents, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="sticky top-0 bg-muted text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <tr>
                      {['#', 'Date', 'Rate', 'Payment', 'Principal', 'Interest', 'Balance'].map((h) => (
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
                        className={row.rateAdjusted ? 'bg-brand-softTeal/60' : 'hover:bg-muted/35'}
                      >
                        <td className="px-3 py-2 tabular-nums">{row.paymentNumber}</td>
                        <td className="px-3 py-2">{row.date}</td>
                        <td className="px-3 py-2 tabular-nums">
                          {formatRate(row.annualRate)}
                          {row.rateAdjusted ? ' *' : ''}
                        </td>
                        <td className="px-3 py-2 tabular-nums">{money(row.paymentCents, currency)}</td>
                        <td className="px-3 py-2 tabular-nums">{money(row.principalCents, currency)}</td>
                        <td className="px-3 py-2 tabular-nums">{money(row.interestCents, currency)}</td>
                        <td className="px-3 py-2 tabular-nums">{money(row.balanceCents, currency)}</td>
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
          Highlighted rows include a modeled reset. Index, margin, and any step are numbers you entered. Contract caps
          are shown separately. Tax, insurance, HOA, and PMI are not part of interest. This is an educational
          projection, not a lender disclosure.
        </p>
      </div>
    </div>
  );
}
