'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  SALARY_PAY_FREQUENCY_OPTIONS,
  payAmountLabel,
  type SalaryFieldErrors,
  type SalaryInput,
  type SalaryPayFrequency,
  type SalaryResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-9 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const suffixClass =
  'shrink-0 pr-3 text-xs text-muted-foreground whitespace-nowrap';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

type OutputCurrencyKey =
  | 'hourlyCurrency'
  | 'dailyCurrency'
  | 'weeklyCurrency'
  | 'monthlyCurrency'
  | 'annualCurrency';

interface OutputRowProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  currencyKey: OutputCurrencyKey;
  onCurrencyChange: (key: OutputCurrencyKey, next: SupportedCurrency) => void;
}

function OutputRow({
  id,
  label,
  tooltip,
  value,
  currency,
  currencyKey,
  onCurrencyChange,
}: OutputRowProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell muted>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} text-accent`}
            readOnly
            tabIndex={-1}
            value={value}
            aria-live="polite"
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={(next) => onCurrencyChange(currencyKey, next)}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );
}

interface SalaryCalculatorFormProps {
  input: SalaryInput;
  errors: SalaryFieldErrors;
  result: SalaryResult | null;
  onChange: (input: SalaryInput) => void;
  onPayCurrencyChange: (next: SupportedCurrency) => void;
  onOutputCurrencyChange: (
    key: OutputCurrencyKey,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function SalaryCalculatorForm({
  input,
  errors,
  result,
  onChange,
  onPayCurrencyChange,
  onOutputCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: SalaryCalculatorFormProps) {
  const paySymbol = getCurrencySymbol(input.payCurrency);
  const amountLabel = payAmountLabel(input.payFrequency);

  const set = (patch: Partial<SalaryInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.scheduleOpen}
        onToggle={(event) => set({ scheduleOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.scheduleOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Your pay &amp; schedule</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="salary-pay-frequency">
              <span>I get paid</span>
              <InfoTooltip
                label="I get paid"
                text="Only Per hour is verified for this calculator. Other pay periods are not offered yet."
              />
            </label>
            <div className="relative">
              <select
                id="salary-pay-frequency"
                className={selectClass}
                value={input.payFrequency}
                onChange={(e) =>
                  set({ payFrequency: e.target.value as SalaryPayFrequency })
                }
              >
                {SALARY_PAY_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="salary-pay-amount">
              <span>{amountLabel}</span>
              <InfoTooltip
                label={amountLabel}
                text="Gross pay for the selected period. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.payAmount}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {paySymbol}
                </span>
                <input
                  id="salary-pay-amount"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.payAmount}
                  aria-invalid={Boolean(errors.payAmount)}
                  onChange={(e) => set({ payAmount: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="salary-pay-currency"
                  value={input.payCurrency}
                  onChange={onPayCurrencyChange}
                  aria-label={`${amountLabel} currency`}
                />
              </div>
            </div>
            {errors.payAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.payAmount}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="salary-hours-day">
              <span>I work</span>
              <InfoTooltip
                label="Hours per day"
                text="Hours worked each workday. Default 8. Never FX-converted. Must be positive."
              />
            </label>
            <FieldShell error={errors.hoursPerDay}>
              <input
                id="salary-hours-day"
                className={inputClass}
                inputMode="decimal"
                value={input.hoursPerDay}
                aria-invalid={Boolean(errors.hoursPerDay)}
                onChange={(e) => set({ hoursPerDay: e.target.value })}
              />
              <span className={suffixClass}>hours per day</span>
            </FieldShell>
            {errors.hoursPerDay ? (
              <p className="mt-1 text-xs text-rose-600">{errors.hoursPerDay}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="salary-days-week">
              <span>I work</span>
              <InfoTooltip
                label="Days per week"
                text="Workdays each week. Default 5. Used for weekly hours and the 52-week annual schedule. Never FX-converted. Must be positive."
              />
            </label>
            <FieldShell error={errors.daysPerWeek}>
              <input
                id="salary-days-week"
                className={inputClass}
                inputMode="decimal"
                value={input.daysPerWeek}
                aria-invalid={Boolean(errors.daysPerWeek)}
                onChange={(e) => set({ daysPerWeek: e.target.value })}
              />
              <span className={suffixClass}>days per week</span>
            </FieldShell>
            {errors.daysPerWeek ? (
              <p className="mt-1 text-xs text-rose-600">{errors.daysPerWeek}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Annual scheduled days = days/week × 52 (52-week convention).
                Holidays and paid vacation are not subtracted from annual pay.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="salary-holidays">
              <span>Holidays per year</span>
              <InfoTooltip
                label="Holidays per year"
                text="Public holidays (default 8). Shown for schedule context; not deducted from annual paid salary. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.holidaysPerYear}>
              <input
                id="salary-holidays"
                className={inputClass}
                inputMode="decimal"
                value={input.holidaysPerYear}
                aria-invalid={Boolean(errors.holidaysPerYear)}
                onChange={(e) => set({ holidaysPerYear: e.target.value })}
              />
              <span className={suffixClass}>days</span>
            </FieldShell>
            {errors.holidaysPerYear ? (
              <p className="mt-1 text-xs text-rose-600">{errors.holidaysPerYear}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="salary-vacation">
              <span>Paid vacation per year</span>
              <InfoTooltip
                label="Paid vacation per year"
                text="Paid vacation days (default 15). Shown for schedule context; not deducted from annual paid salary. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.paidVacationPerYear}>
              <input
                id="salary-vacation"
                className={inputClass}
                inputMode="decimal"
                value={input.paidVacationPerYear}
                aria-invalid={Boolean(errors.paidVacationPerYear)}
                onChange={(e) => set({ paidVacationPerYear: e.target.value })}
              />
              <span className={suffixClass}>days</span>
            </FieldShell>
            {errors.paidVacationPerYear ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.paidVacationPerYear}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.resultsOpen}
        onToggle={(event) => set({ resultsOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.resultsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Salary equivalents</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <OutputRow
            id="salary-hourly"
            label="Hourly"
            tooltip="Your pay per hour in the currency you select."
            value={result?.formattedHourly ?? ''}
            currency={input.hourlyCurrency}
            currencyKey="hourlyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="salary-daily"
            label="Daily"
            tooltip="Hourly × hours per day, shown in the currency you select."
            value={result?.formattedDaily ?? ''}
            currency={input.dailyCurrency}
            currencyKey="dailyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="salary-weekly"
            label="Weekly"
            tooltip="Hourly × hours/day × days/week, shown in the currency you select."
            value={result?.formattedWeekly ?? ''}
            currency={input.weeklyCurrency}
            currencyKey="weeklyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="salary-monthly"
            label="Monthly"
            tooltip="Annual ÷ 12, shown in the currency you select."
            value={result?.formattedMonthly ?? ''}
            currency={input.monthlyCurrency}
            currencyKey="monthlyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="salary-annual"
            label="Annual"
            tooltip="Hourly × hours/day × (days/week × 52). Holidays and paid vacation are not subtracted."
            value={result?.formattedAnnual ?? ''}
            currency={input.annualCurrency}
            currencyKey="annualCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
        </div>
      </details>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}

export type { OutputCurrencyKey };
