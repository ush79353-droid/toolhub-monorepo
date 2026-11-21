'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatLtcMoney,
  formatLtcPercent,
  formatPresentYearFromCare,
  parseOptionalNumber,
} from './calculation';
import type {
  CareCostFrequency,
  LongTermCareFieldErrors,
  LongTermCareInput,
  LongTermCareResult,
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

interface LongTermCareFormProps {
  input: LongTermCareInput;
  errors: LongTermCareFieldErrors;
  result: LongTermCareResult | null;
  onChange: (next: LongTermCareInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function LongTermCareForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: LongTermCareFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const money = (v: number) => `${symbol}${formatLtcMoney(v, input.currency)}`;

  const syncPresentYear = (
    next: LongTermCareInput,
    careRaw: string,
    frequency: CareCostFrequency,
  ): LongTermCareInput => {
    if (next.presentYearManuallySet) return next;
    const care = parseOptionalNumber(careRaw);
    if (care === null || !(care > 0)) return { ...next, presentYearCost: '' };
    return {
      ...next,
      presentYearCost: formatPresentYearFromCare(care, frequency, next.currency),
    };
  };

  const set = (patch: Partial<LongTermCareInput>) => {
    let next = { ...input, ...patch };
    if ('careCost' in patch || 'frequency' in patch || 'currency' in patch) {
      next = syncPresentYear(next, next.careCost, next.frequency);
    }
    onChange(next);
  };

  const costLabel =
    input.frequency === 'daily' ? `Cost (${symbol}/day)` : `Cost (${symbol}/month)`;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Project long-term care expenses from a daily or monthly rate, inflated each year. Present-year
          cost is the annual baseline (not added again on top of the daily/monthly rate).
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="ltc-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="ltc-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <section className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">The cost is</h3>

        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-accent">Cost frequency</legend>
          <div className="flex flex-wrap gap-4 text-sm text-accent">
            {(
              [
                { value: 'daily', label: 'Per day' },
                { value: 'monthly', label: 'Per month' },
              ] as const
            ).map((opt) => (
              <label key={opt.value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="ltc-frequency"
                  checked={input.frequency === opt.value}
                  onChange={() =>
                    set({
                      frequency: opt.value,
                      presentYearManuallySet: false,
                    })
                  }
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <div className={labelClass}>
            <label htmlFor="ltc-care-cost">{costLabel}</label>
          </div>
          <FieldShell error={errors.careCost}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="ltc-care-cost"
              className={inputClass}
              inputMode="decimal"
              value={input.careCost}
              onChange={(e) =>
                set({ careCost: e.target.value, presentYearManuallySet: false })
              }
            />
          </FieldShell>
          {errors.careCost ? (
            <p className="mt-1 text-xs text-rose-600">{errors.careCost}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="ltc-present-year">Cost of present year ({symbol})</label>
            <InfoTooltip
              label="Cost of present year"
              text="Annual care baseline used for inflation. Auto-filled from daily×365 or monthly×12. Edit to override; it is not added on top of the care-cost rate."
              align="left"
            />
          </div>
          <FieldShell error={errors.presentYearCost}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="ltc-present-year"
              className={inputClass}
              inputMode="decimal"
              value={input.presentYearCost}
              onChange={(e) =>
                set({
                  presentYearCost: e.target.value,
                  presentYearManuallySet: true,
                })
              }
            />
            <span className="pr-3 text-xs text-muted-foreground">/ year</span>
          </FieldShell>
          {errors.presentYearCost ? (
            <p className="mt-1 text-xs text-rose-600">{errors.presentYearCost}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="ltc-years">No. of years (n)</label>
          </div>
          <FieldShell error={errors.years}>
            <input
              id="ltc-years"
              className={inputClass}
              inputMode="numeric"
              value={input.years}
              onChange={(e) => set({ years: e.target.value })}
            />
          </FieldShell>
          {errors.years ? (
            <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="ltc-inflation">Rate of inflation (%)</label>
          </div>
          <FieldShell error={errors.inflationRate}>
            <input
              id="ltc-inflation"
              className={inputClass}
              inputMode="decimal"
              value={input.inflationRate}
              onChange={(e) => set({ inflationRate: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.inflationRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.inflationRate}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <span>Total estimated cost over the specified period</span>
          </div>
          <div className="flex h-11 items-center rounded-lg border border-border bg-white px-3 text-sm font-semibold tabular-nums text-primary">
            {result ? money(result.totalEstimatedCost) : '—'}
          </div>
        </div>
      </section>

      {errors.form ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          <h3 className="text-sm font-semibold text-accent">Total estimated cost</h3>
          <p className="text-2xl font-semibold tabular-nums text-primary">
            {money(result.totalEstimatedCost)}
          </p>
          <p className="text-sm text-muted-foreground">{result.summaryText}</p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Cost frequency</dt>
              <dd className="tabular-nums">
                {result.frequency === 'daily' ? 'Per day' : 'Per month'}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Current care cost</dt>
              <dd className="tabular-nums">{money(result.careCost)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Current annual cost</dt>
              <dd className="tabular-nums">{money(result.annualCareCost)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Inflation rate</dt>
              <dd className="tabular-nums">
                {formatLtcPercent(result.inflationRatePercent)}%
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Projection period</dt>
              <dd className="tabular-nums">{result.projectionYears} years</dd>
            </div>
            <div className="flex justify-between gap-2 py-1.5">
              <dt className="text-muted-foreground">Final-year cost</dt>
              <dd className="tabular-nums">{money(result.finalYearCost)}</dd>
            </div>
          </dl>

          <details className="rounded-lg border border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-accent">
              <span>Annual cost projection</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            </summary>
            <div className="max-h-[320px] overflow-auto border-t border-border">
              <table className="w-full min-w-[420px] border-collapse text-left text-xs sm:text-sm">
                <thead className="sticky top-0 bg-muted/90 text-accent">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Year</th>
                    <th className="px-3 py-2 font-semibold">Annual care cost</th>
                    <th className="px-3 py-2 font-semibold">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {result.projection.map((row) => (
                    <tr key={row.year} className="odd:bg-muted/20">
                      <td className="border-t border-border/60 px-3 py-1.5 tabular-nums">
                        {row.year}
                      </td>
                      <td className="border-t border-border/60 px-3 py-1.5 tabular-nums">
                        {money(row.annualCost)}
                      </td>
                      <td className="border-t border-border/60 px-3 py-1.5 tabular-nums">
                        {money(row.cumulativeCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      ) : null}
    </form>
  );
}
