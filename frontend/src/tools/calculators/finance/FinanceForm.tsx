'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatFinanceMoney,
  formatFinancePercent,
  formatFinancePeriods,
} from './calculation';
import { FinanceValueChart } from './FinanceChart';
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  FINANCE_MODES,
  PAYMENT_FREQUENCY_OPTIONS,
  PAYMENT_TIMING_OPTIONS,
  type FinanceFieldErrors,
  type FinanceInput,
  type FinanceMode,
  type FinanceResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function visibleFields(mode: FinanceMode): Array<'n' | 'iy' | 'pv' | 'pmt' | 'fv'> {
  switch (mode) {
    case 'FV':
      return ['n', 'iy', 'pv', 'pmt'];
    case 'PMT':
      return ['n', 'iy', 'pv', 'fv'];
    case 'IY':
      return ['n', 'pv', 'pmt', 'fv'];
    case 'N':
      return ['iy', 'pv', 'pmt', 'fv'];
    case 'PV':
      return ['n', 'iy', 'pmt', 'fv'];
  }
}

interface FinanceFormProps {
  input: FinanceInput;
  errors: FinanceFieldErrors;
  result: FinanceResult | null;
  onChange: (next: FinanceInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onLoadExample: () => void;
}

export function FinanceForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onLoadExample,
}: FinanceFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<FinanceInput>) => onChange({ ...input, ...patch });
  const fields = visibleFields(input.mode);

  const money = (v: number) => `${symbol}${formatFinanceMoney(v, input.currency)}`;

  const primaryResultLabel =
    input.mode === 'IY'
      ? `I/Y = ${result ? `${formatFinancePercent(result.calculatedValue)}%` : '—'}`
      : input.mode === 'N'
        ? `N = ${result ? formatFinancePeriods(result.calculatedValue) : '—'}`
        : `${input.mode} = ${result ? money(result.calculatedValue) : '—'}`;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onCalculate();
          }}
          className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          noValidate
          autoComplete="off"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Solve for one TVM variable. Cash inflows are positive; outflows are negative.
            </p>
            <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
              Load example
            </Button>
          </div>

          <div
            className="flex flex-wrap gap-1 rounded-lg border border-border bg-white p-1"
            role="tablist"
            aria-label="Solve for"
          >
            {FINANCE_MODES.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={input.mode === tab.value}
                className={`min-w-[3.25rem] flex-1 rounded-md px-2 py-2 text-xs font-semibold transition-colors ${
                  input.mode === tab.value
                    ? 'bg-primary text-white'
                    : 'text-accent hover:bg-muted/40'
                }`}
                onClick={() => set({ mode: tab.value })}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            <label className={labelClass} htmlFor="fin-currency">
              <span>Display currency</span>
            </label>
            <div className="max-w-[140px]">
              <CurrencySelect
                id="fin-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
          </div>

          {fields.includes('n') ? (
            <div>
              <div className={labelClass}>
                <label htmlFor="fin-n">N (# of periods)</label>
                <InfoTooltip
                  label="Number of periods"
                  text="Total payment or compounding periods matching the selected payment frequency."
                  align="left"
                />
              </div>
              <FieldShell error={errors.n}>
                <input
                  id="fin-n"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.n}
                  aria-invalid={Boolean(errors.n)}
                  onChange={(event) => set({ n: event.target.value })}
                />
              </FieldShell>
              {errors.n ? <p className="mt-1 text-xs text-rose-600">{errors.n}</p> : null}
            </div>
          ) : null}

          {fields.includes('iy') ? (
            <div>
              <div className={labelClass}>
                <label htmlFor="fin-iy">I/Y (Interest per year)</label>
                <InfoTooltip
                  label="Interest per year"
                  text="Nominal annual interest rate. Converted to a period rate using your compounding and payment frequencies."
                  align="left"
                />
              </div>
              <FieldShell error={errors.iy}>
                <input
                  id="fin-iy"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.iy}
                  aria-invalid={Boolean(errors.iy)}
                  onChange={(event) => set({ iy: event.target.value })}
                />
                <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
              </FieldShell>
              {errors.iy ? <p className="mt-1 text-xs text-rose-600">{errors.iy}</p> : null}
            </div>
          ) : null}

          {fields.includes('pv') ? (
            <div>
              <div className={labelClass}>
                <label htmlFor="fin-pv">PV (Present Value)</label>
                <InfoTooltip
                  label="Present value"
                  text="Current cash amount. Positive = cash received; negative = cash paid."
                  align="left"
                />
              </div>
              <FieldShell error={errors.pv}>
                <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
                <input
                  id="fin-pv"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.pv}
                  aria-invalid={Boolean(errors.pv)}
                  onChange={(event) => set({ pv: event.target.value })}
                />
              </FieldShell>
              {errors.pv ? <p className="mt-1 text-xs text-rose-600">{errors.pv}</p> : null}
            </div>
          ) : null}

          {fields.includes('pmt') ? (
            <div>
              <div className={labelClass}>
                <label htmlFor="fin-pmt">PMT (Periodic Payment)</label>
                <InfoTooltip
                  label="Periodic payment"
                  text="Regular payment each period. Positive = received; negative = paid."
                  align="left"
                />
              </div>
              <FieldShell error={errors.pmt}>
                <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
                <input
                  id="fin-pmt"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.pmt}
                  aria-invalid={Boolean(errors.pmt)}
                  onChange={(event) => set({ pmt: event.target.value })}
                />
              </FieldShell>
              {errors.pmt ? <p className="mt-1 text-xs text-rose-600">{errors.pmt}</p> : null}
            </div>
          ) : null}

          {fields.includes('fv') ? (
            <div>
              <div className={labelClass}>
                <label htmlFor="fin-fv">FV (Future Value)</label>
                <InfoTooltip
                  label="Future value"
                  text="Cash amount at the end of the last period. Positive = received; negative = paid."
                  align="left"
                />
              </div>
              <FieldShell error={errors.fv}>
                <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
                <input
                  id="fin-fv"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.fv}
                  aria-invalid={Boolean(errors.fv)}
                  onChange={(event) => set({ fv: event.target.value })}
                />
              </FieldShell>
              {errors.fv ? <p className="mt-1 text-xs text-rose-600">{errors.fv}</p> : null}
            </div>
          ) : null}

          <details className="rounded-lg border border-border bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-accent">
              <span>Settings</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            </summary>
            <div className="space-y-3 border-t border-border px-3 py-3">
              <div>
                <label className={labelClass} htmlFor="fin-pay-freq">
                  Payment frequency
                </label>
                <select
                  id="fin-pay-freq"
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                  value={input.paymentFrequency}
                  onChange={(event) =>
                    set({
                      paymentFrequency: event.target
                        .value as FinanceInput['paymentFrequency'],
                    })
                  }
                >
                  {PAYMENT_FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="fin-comp-freq">
                  Compounding
                </label>
                <select
                  id="fin-comp-freq"
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                  value={input.compoundingFrequency}
                  onChange={(event) =>
                    set({
                      compoundingFrequency: event.target
                        .value as FinanceInput['compoundingFrequency'],
                    })
                  }
                >
                  {COMPOUNDING_FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="fin-timing">
                  Payment timing
                </label>
                <select
                  id="fin-timing"
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                  value={input.paymentTiming}
                  onChange={(event) =>
                    set({
                      paymentTiming: event.target.value as FinanceInput['paymentTiming'],
                    })
                  }
                >
                  {PAYMENT_TIMING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </details>

          {errors.form ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errors.form}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" className="h-11 min-w-[120px]">
              Calculate
            </Button>
            <Button type="button" variant="outline" className="h-11" onClick={onClear}>
              Clear
            </Button>
          </div>
        </form>

        <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <h3 className="text-sm font-semibold text-accent">Results</h3>
          {result ? (
            <>
              <p className="text-2xl font-semibold tabular-nums text-primary">
                {primaryResultLabel}
              </p>
              <p className="text-sm text-muted-foreground">{result.summaryText}</p>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between gap-3 border-b border-border/70 py-1.5">
                  <dt className="text-muted-foreground">PV</dt>
                  <dd className="tabular-nums text-accent">{money(result.pv)}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-border/70 py-1.5">
                  <dt className="text-muted-foreground">PMT</dt>
                  <dd className="tabular-nums text-accent">{money(result.pmt)}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-border/70 py-1.5">
                  <dt className="text-muted-foreground">I/Y</dt>
                  <dd className="tabular-nums text-accent">
                    {formatFinancePercent(result.iy)}%
                  </dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-border/70 py-1.5">
                  <dt className="text-muted-foreground">N</dt>
                  <dd className="tabular-nums text-accent">
                    {formatFinancePeriods(result.n)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-border/70 py-1.5">
                  <dt className="text-muted-foreground">FV</dt>
                  <dd className="tabular-nums text-accent">{money(result.fv)}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-border/70 py-1.5">
                  <dt className="text-muted-foreground">Sum of all periodic payments</dt>
                  <dd className="tabular-nums text-accent">{money(result.totalPayments)}</dd>
                </div>
                <div className="flex justify-between gap-3 py-1.5">
                  <dt className="text-muted-foreground">Total interest</dt>
                  <dd className="tabular-nums text-accent">{money(result.totalInterest)}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter the known values and press Calculate to solve for {input.mode}.
            </p>
          )}
        </div>
      </div>

      {result && result.chartPoints.length > 1 ? (
        <FinanceValueChart points={result.chartPoints} currency={result.currency} />
      ) : null}

      {result && result.schedule.length > 0 ? (
        <div className="rounded-xl border border-border bg-white p-3 sm:p-4">
          <h3 className="mb-2 text-sm font-semibold text-accent">Schedule</h3>
          <div className="max-h-[360px] overflow-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-xs sm:text-sm">
              <thead className="sticky top-0 bg-muted/90 text-accent">
                <tr>
                  <th className="border-b border-border px-2 py-2 font-semibold">Period</th>
                  <th className="border-b border-border px-2 py-2 font-semibold">PV</th>
                  <th className="border-b border-border px-2 py-2 font-semibold">PMT</th>
                  <th className="border-b border-border px-2 py-2 font-semibold">Interest</th>
                  <th className="border-b border-border px-2 py-2 font-semibold">FV</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.period} className="odd:bg-muted/20">
                    <td className="border-b border-border/60 px-2 py-1.5 tabular-nums">
                      {row.period}
                    </td>
                    <td className="border-b border-border/60 px-2 py-1.5 tabular-nums">
                      {money(row.openingBalance)}
                    </td>
                    <td className="border-b border-border/60 px-2 py-1.5 tabular-nums">
                      {money(row.payment)}
                    </td>
                    <td className="border-b border-border/60 px-2 py-1.5 tabular-nums">
                      {money(row.interest)}
                    </td>
                    <td className="border-b border-border/60 px-2 py-1.5 tabular-nums">
                      {money(row.endingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.n > result.schedule.length ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing the first {result.schedule.length} of{' '}
              {formatFinancePeriods(Math.ceil(result.n))} periods.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
