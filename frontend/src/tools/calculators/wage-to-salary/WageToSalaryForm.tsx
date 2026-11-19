'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  WageSourceField,
  WageToSalaryFieldErrors,
  WageToSalaryInput,
  WageToSalaryResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitClass =
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

export type OutputCurrencyKey = 'monthlyCurrency' | 'yearlyCurrency';

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

function displayWage(
  field: WageSourceField,
  input: WageToSalaryInput,
  result: WageToSalaryResult | null
): string {
  if (input.sourceField === field) {
    if (field === 'hourly') return input.hourlyWage;
    if (field === 'daily') return input.dailyWage;
    return input.weeklyWage;
  }
  if (!result) {
    if (field === 'hourly') return input.hourlyWage;
    if (field === 'daily') return input.dailyWage;
    return input.weeklyWage;
  }
  if (field === 'hourly') return result.formattedHourly;
  if (field === 'daily') return result.formattedDaily;
  return result.formattedWeekly;
}

interface WageToSalaryFormProps {
  input: WageToSalaryInput;
  errors: WageToSalaryFieldErrors;
  result: WageToSalaryResult | null;
  onChange: (input: WageToSalaryInput) => void;
  onWageCurrencyChange: (
    field: WageSourceField,
    next: SupportedCurrency
  ) => void;
  onOutputCurrencyChange: (
    key: OutputCurrencyKey,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function WageToSalaryForm({
  input,
  errors,
  result,
  onChange,
  onWageCurrencyChange,
  onOutputCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: WageToSalaryFormProps) {
  const set = (patch: Partial<WageToSalaryInput>) => {
    onChange({ ...input, ...patch });
  };

  const hourlyDisplay = displayWage('hourly', input, result);
  const dailyDisplay = displayWage('daily', input, result);
  const weeklyDisplay = displayWage('weekly', input, result);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.wageInfoOpen}
        onToggle={(event) => set({ wageInfoOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.wageInfoOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Wage Information</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="wts-hourly">
              <span>Hourly wage</span>
              <InfoTooltip
                label="Hourly wage"
                text="Gross pay per hour. Editing makes this field authoritative. Weekly = hourly × hours/week."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.hourlyWage}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {getCurrencySymbol(input.hourlyWageCurrency)}
                </span>
                <input
                  id="wts-hourly"
                  className={inputClass}
                  inputMode="decimal"
                  value={hourlyDisplay}
                  aria-invalid={Boolean(errors.hourlyWage)}
                  onChange={(e) =>
                    set({ sourceField: 'hourly', hourlyWage: e.target.value })
                  }
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="wts-hourly-currency"
                  value={input.hourlyWageCurrency}
                  onChange={(next) => onWageCurrencyChange('hourly', next)}
                  aria-label="Hourly wage currency"
                />
              </div>
            </div>
            {errors.hourlyWage ? (
              <p className="mt-1 text-xs text-rose-600">{errors.hourlyWage}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="wts-daily">
              <span>Daily wage</span>
              <InfoTooltip
                label="Daily wage"
                text="Gross pay per workday. Editing makes this field authoritative. Weekly = daily × days/week."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.dailyWage}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {getCurrencySymbol(input.dailyWageCurrency)}
                </span>
                <input
                  id="wts-daily"
                  className={inputClass}
                  inputMode="decimal"
                  value={dailyDisplay}
                  aria-invalid={Boolean(errors.dailyWage)}
                  onChange={(e) =>
                    set({ sourceField: 'daily', dailyWage: e.target.value })
                  }
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="wts-daily-currency"
                  value={input.dailyWageCurrency}
                  onChange={(next) => onWageCurrencyChange('daily', next)}
                  aria-label="Daily wage currency"
                />
              </div>
            </div>
            {errors.dailyWage ? (
              <p className="mt-1 text-xs text-rose-600">{errors.dailyWage}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="wts-weekly">
              <span>Weekly wage</span>
              <InfoTooltip
                label="Weekly wage"
                text="Gross pay per week. Editing makes this field authoritative."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.weeklyWage}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {getCurrencySymbol(input.weeklyWageCurrency)}
                </span>
                <input
                  id="wts-weekly"
                  className={inputClass}
                  inputMode="decimal"
                  value={weeklyDisplay}
                  aria-invalid={Boolean(errors.weeklyWage)}
                  onChange={(e) =>
                    set({ sourceField: 'weekly', weeklyWage: e.target.value })
                  }
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="wts-weekly-currency"
                  value={input.weeklyWageCurrency}
                  onChange={(next) => onWageCurrencyChange('weekly', next)}
                  aria-label="Weekly wage currency"
                />
              </div>
            </div>
            {errors.weeklyWage ? (
              <p className="mt-1 text-xs text-rose-600">{errors.weeklyWage}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.workingDaysOpen}
        onToggle={(event) => set({ workingDaysOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.workingDaysOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Working Days</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="wts-hours">
              <span>Hours per week</span>
              <InfoTooltip
                label="Hours per week"
                text="Used when hourly wage is authoritative. Never FX-converted. Must be positive."
              />
            </label>
            <FieldShell error={errors.hoursPerWeek}>
              <input
                id="wts-hours"
                className={inputClass}
                inputMode="decimal"
                value={input.hoursPerWeek}
                aria-invalid={Boolean(errors.hoursPerWeek)}
                onChange={(e) => set({ hoursPerWeek: e.target.value })}
              />
              <span className={unitClass}>hours / week</span>
            </FieldShell>
            {errors.hoursPerWeek ? (
              <p className="mt-1 text-xs text-rose-600">{errors.hoursPerWeek}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="wts-days">
              <span>Days per week</span>
              <InfoTooltip
                label="Days per week"
                text="Used when daily wage is authoritative. Never FX-converted. Must be positive."
              />
            </label>
            <FieldShell error={errors.daysPerWeek}>
              <input
                id="wts-days"
                className={inputClass}
                inputMode="decimal"
                value={input.daysPerWeek}
                aria-invalid={Boolean(errors.daysPerWeek)}
                onChange={(e) => set({ daysPerWeek: e.target.value })}
              />
              <span className={unitClass}>days / week</span>
            </FieldShell>
            {errors.daysPerWeek ? (
              <p className="mt-1 text-xs text-rose-600">{errors.daysPerWeek}</p>
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
          <span>Result</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <OutputRow
            id="wts-monthly"
            label="Monthly salary"
            tooltip="Weekly × 52 ÷ 12 in the selected display currency."
            value={result?.formattedMonthly ?? ''}
            currency={input.monthlyCurrency}
            currencyKey="monthlyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="wts-yearly"
            label="Yearly salary"
            tooltip="Weekly × 52 in the selected display currency."
            value={result?.formattedYearly ?? ''}
            currency={input.yearlyCurrency}
            currencyKey="yearlyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <p className="text-xs text-muted-foreground">
            Annualization assumes 52 paid weeks. No taxes, overtime, or bonuses.
          </p>
        </div>
      </details>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
