'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatDesiredDuration,
  formatDurationMonths,
  formatMoney,
  suggestedMonthlySavingsString,
} from './calculation';
import type {
  SabbaticalDurationUnit,
  SabbaticalFieldErrors,
  SabbaticalInput,
  SabbaticalResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-muted/30 px-2 text-xs font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface SabbaticalFormProps {
  input: SabbaticalInput;
  errors: SabbaticalFieldErrors;
  result: SabbaticalResult | null;
  onChange: (next: SabbaticalInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
}

export function SabbaticalForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
}: SabbaticalFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<SabbaticalInput>) => {
    let next: SabbaticalInput = { ...input, ...patch };

    const incomeOrPctChanged =
      patch.monthlyIncome !== undefined || patch.savingsPercentage !== undefined;
    if (
      incomeOrPctChanged &&
      (patch.monthlySavingsMode ?? next.monthlySavingsMode) === 'auto'
    ) {
      const suggested = suggestedMonthlySavingsString(
        next.monthlyIncome,
        next.savingsPercentage,
      );
      if (suggested !== null) {
        next = { ...next, monthlySavings: suggested, monthlySavingsMode: 'auto' };
      }
    }

    onChange(next);
  };

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
      <p className="text-xs text-muted-foreground">
        Plan savings before leave and estimate how long your sabbatical fund can
        last, including an optional emergency buffer.
      </p>

      <div>
        <label className={labelClass} htmlFor="sab-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="sab-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Save</legend>

        <div>
          <div className={labelClass}>
            <label htmlFor="sab-savings-pct">Desired savings percentage</label>
            <InfoTooltip
              label="Desired savings percentage"
              text="Share of monthly income you plan to set aside while preparing for leave."
              align="left"
            />
          </div>
          <FieldShell error={errors.savingsPercentage}>
            <input
              id="sab-savings-pct"
              className={inputClass}
              inputMode="decimal"
              value={input.savingsPercentage}
              aria-invalid={Boolean(errors.savingsPercentage)}
              onChange={(event) => set({ savingsPercentage: event.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground">% of your income</span>
          </FieldShell>
          {errors.savingsPercentage ? (
            <p className="mt-1 text-xs text-rose-600">{errors.savingsPercentage}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="sab-years-save">Years to save</label>
            <InfoTooltip
              label="Years to save"
              text="How long you will save at the monthly contribution before starting the sabbatical."
              align="left"
            />
          </div>
          <FieldShell error={errors.yearsToSave}>
            <input
              id="sab-years-save"
              className={inputClass}
              inputMode="decimal"
              value={input.yearsToSave}
              aria-invalid={Boolean(errors.yearsToSave)}
              onChange={(event) => set({ yearsToSave: event.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground">yrs</span>
          </FieldShell>
          {errors.yearsToSave ? (
            <p className="mt-1 text-xs text-rose-600">{errors.yearsToSave}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="sab-desired-duration">Desired sabbatical duration</label>
            <InfoTooltip
              label="Desired sabbatical duration"
              text="How long you want to take off. Choose years, months, or weeks."
              align="left"
            />
          </div>
          <FieldShell error={errors.desiredDuration}>
            <input
              id="sab-desired-duration"
              className={inputClass}
              inputMode="decimal"
              value={input.desiredDuration}
              aria-invalid={Boolean(errors.desiredDuration)}
              onChange={(event) => set({ desiredDuration: event.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Duration unit"
              value={input.durationUnit}
              onChange={(event) =>
                set({
                  durationUnit: event.target.value as SabbaticalDurationUnit,
                })
              }
            >
              <option value="years">yrs</option>
              <option value="months">mos</option>
              <option value="weeks">weeks</option>
            </select>
          </FieldShell>
          {errors.desiredDuration ? (
            <p className="mt-1 text-xs text-rose-600">{errors.desiredDuration}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Financial Details
        </legend>

        <div>
          <div className={labelClass}>
            <label htmlFor="sab-monthly-income">Current monthly income</label>
          </div>
          <FieldShell error={errors.monthlyIncome}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="sab-monthly-income"
              className={inputClass}
              inputMode="decimal"
              value={input.monthlyIncome}
              aria-invalid={Boolean(errors.monthlyIncome)}
              onChange={(event) => set({ monthlyIncome: event.target.value })}
            />
          </FieldShell>
          {errors.monthlyIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyIncome}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="sab-monthly-savings">Monthly savings</label>
            <InfoTooltip
              label="Monthly savings"
              text="Defaults to income × savings %. Edit to override; change income or % again to return to auto."
              align="left"
            />
          </div>
          <FieldShell error={errors.monthlySavings}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="sab-monthly-savings"
              className={inputClass}
              inputMode="decimal"
              value={input.monthlySavings}
              aria-invalid={Boolean(errors.monthlySavings)}
              onChange={(event) =>
                set({
                  monthlySavings: event.target.value,
                  monthlySavingsMode: 'manual',
                })
              }
            />
          </FieldShell>
          <p className="mt-1 text-xs text-muted-foreground">
            {input.monthlySavingsMode === 'auto'
              ? 'Auto from income × savings %.'
              : 'Manual override; change income or savings % to recalculate automatically.'}
          </p>
          {errors.monthlySavings ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlySavings}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="sab-current-savings">Current savings</label>
          </div>
          <FieldShell error={errors.currentSavings}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="sab-current-savings"
              className={inputClass}
              inputMode="decimal"
              value={input.currentSavings}
              aria-invalid={Boolean(errors.currentSavings)}
              onChange={(event) => set({ currentSavings: event.target.value })}
            />
          </FieldShell>
          {errors.currentSavings ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentSavings}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="sab-expenses">Expected monthly sabbatical expenses</label>
          </div>
          <FieldShell error={errors.monthlyExpenses}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="sab-expenses"
              className={inputClass}
              inputMode="decimal"
              value={input.monthlyExpenses}
              aria-invalid={Boolean(errors.monthlyExpenses)}
              onChange={(event) => set({ monthlyExpenses: event.target.value })}
            />
          </FieldShell>
          {errors.monthlyExpenses ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyExpenses}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="sab-buffer">Additional financial buffer</label>
            <InfoTooltip
              label="Additional financial buffer"
              text="Extra percentage reserved for unexpected costs during the sabbatical."
              align="left"
            />
          </div>
          <FieldShell error={errors.bufferPercentage}>
            <input
              id="sab-buffer"
              className={inputClass}
              inputMode="decimal"
              value={input.bufferPercentage}
              aria-invalid={Boolean(errors.bufferPercentage)}
              onChange={(event) => set({ bufferPercentage: event.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
          {errors.bufferPercentage ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bufferPercentage}</p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section
          aria-labelledby="sab-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="sab-results-heading" className="text-sm font-semibold text-accent">
            Your Sabbatical Plan
          </h3>

          <div
            className={`rounded-lg border px-3 py-2.5 text-sm ${
              result.isAffordable
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'border-rose-200 bg-rose-50 text-rose-950'
            }`}
            role="status"
            aria-live="polite"
          >
            <p className="font-semibold">{result.statusMessage}</p>
            {!result.isAffordable ? (
              <p className="mt-1 text-xs opacity-90">
                Additional savings needed:{' '}
                {formatMoney(Math.abs(result.savingsSurplus), result.currency)}
              </p>
            ) : result.savingsSurplus > 0 ? (
              <p className="mt-1 text-xs opacity-90">
                Surplus {formatMoney(result.savingsSurplus, result.currency)}
                {result.affordableMonths !== null
                  ? ` · affordable runway ≈ ${formatDurationMonths(result.affordableMonths)}`
                  : ''}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90 sm:text-sm">
            {result.explanation}
          </div>

          <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Total savings available</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatMoney(result.totalAvailableFund, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total savings required</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalRequired, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Affordable time away</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.affordableMonths === null
                  ? '—'
                  : formatDurationMonths(result.affordableMonths)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Desired sabbatical duration</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatDesiredDuration(
                  result.desiredDurationValue,
                  result.durationUnit,
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Savings surplus / shortfall</dt>
              <dd
                className={`font-medium tabular-nums ${
                  result.savingsSurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {formatMoney(result.savingsSurplus, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                Estimated monthly savings contribution
              </dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.monthlySavings, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Savings accumulated while preparing</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.accumulatedSavings, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Emergency buffer amount</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.emergencyBuffer, result.currency)}
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter your savings plan and financial details, then calculate your
          sabbatical readiness.
        </p>
      )}
    </form>
  );
}
