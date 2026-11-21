'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HoursPayFieldErrors,
  HoursPayInput,
  HoursPayResult,
  HoursPaySourceField,
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

function displayPay(
  field: HoursPaySourceField,
  input: HoursPayInput,
  result: HoursPayResult | null
): string {
  if (input.sourceField === field) {
    if (field === 'daily') return input.dailyPay;
    if (field === 'weekly') return input.weeklyPay;
    if (field === 'monthly') return input.monthlyPay;
    return input.annualPay;
  }
  if (!result) {
    if (field === 'daily') return input.dailyPay;
    if (field === 'weekly') return input.weeklyPay;
    if (field === 'monthly') return input.monthlyPay;
    return input.annualPay;
  }
  if (field === 'daily') return result.formattedDaily;
  if (field === 'weekly') return result.formattedWeekly;
  if (field === 'monthly') return result.formattedMonthly;
  return result.formattedAnnual;
}

interface HoursPayFormProps {
  input: HoursPayInput;
  errors: HoursPayFieldErrors;
  result: HoursPayResult | null;
  onChange: (input: HoursPayInput) => void;
  onPayCurrencyChange: (
    field: HoursPaySourceField,
    next: SupportedCurrency
  ) => void;
  onHourlyCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function HoursPayForm({
  input,
  errors,
  result,
  onChange,
  onPayCurrencyChange,
  onHourlyCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: HoursPayFormProps) {
  const set = (patch: Partial<HoursPayInput>) => {
    onChange({ ...input, ...patch });
  };

  const dailyDisplay = displayPay('daily', input, result);
  const weeklyDisplay = displayPay('weekly', input, result);
  const monthlyDisplay = displayPay('monthly', input, result);
  const annualDisplay = displayPay('annual', input, result);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.payInfoOpen}
        onToggle={(event) => set({ payInfoOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.payInfoOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Pay information</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="hp-daily">
              <span>Daily pay</span>
              <InfoTooltip
                label="Daily pay"
                text="Gross pay per workday. Editing makes this field authoritative. Hourly = daily ÷ hours/day."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.dailyPay}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {getCurrencySymbol(input.dailyPayCurrency)}
                </span>
                <input
                  id="hp-daily"
                  className={inputClass}
                  inputMode="decimal"
                  value={dailyDisplay}
                  aria-invalid={Boolean(errors.dailyPay)}
                  onChange={(e) =>
                    set({ sourceField: 'daily', dailyPay: e.target.value })
                  }
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="hp-daily-currency"
                  value={input.dailyPayCurrency}
                  onChange={(next) => onPayCurrencyChange('daily', next)}
                  aria-label="Daily pay currency"
                />
              </div>
            </div>
            {errors.dailyPay ? (
              <p className="mt-1 text-xs text-rose-600">{errors.dailyPay}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="hp-weekly">
              <span>Weekly pay</span>
              <InfoTooltip
                label="Weekly pay"
                text="Gross pay per week. Editing makes this field authoritative."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.weeklyPay}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {getCurrencySymbol(input.weeklyPayCurrency)}
                </span>
                <input
                  id="hp-weekly"
                  className={inputClass}
                  inputMode="decimal"
                  value={weeklyDisplay}
                  aria-invalid={Boolean(errors.weeklyPay)}
                  onChange={(e) =>
                    set({ sourceField: 'weekly', weeklyPay: e.target.value })
                  }
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="hp-weekly-currency"
                  value={input.weeklyPayCurrency}
                  onChange={(next) => onPayCurrencyChange('weekly', next)}
                  aria-label="Weekly pay currency"
                />
              </div>
            </div>
            {errors.weeklyPay ? (
              <p className="mt-1 text-xs text-rose-600">{errors.weeklyPay}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="hp-monthly">
              <span>Monthly pay</span>
              <InfoTooltip
                label="Monthly pay"
                text="Gross pay per month. Editing makes this field authoritative. Annual = monthly × 12."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.monthlyPay}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {getCurrencySymbol(input.monthlyPayCurrency)}
                </span>
                <input
                  id="hp-monthly"
                  className={inputClass}
                  inputMode="decimal"
                  value={monthlyDisplay}
                  aria-invalid={Boolean(errors.monthlyPay)}
                  onChange={(e) =>
                    set({ sourceField: 'monthly', monthlyPay: e.target.value })
                  }
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="hp-monthly-currency"
                  value={input.monthlyPayCurrency}
                  onChange={(next) => onPayCurrencyChange('monthly', next)}
                  aria-label="Monthly pay currency"
                />
              </div>
            </div>
            {errors.monthlyPay ? (
              <p className="mt-1 text-xs text-rose-600">{errors.monthlyPay}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="hp-annual">
              <span>Annual pay</span>
              <InfoTooltip
                label="Annual pay"
                text="Gross pay per year. Editing makes this field authoritative."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.annualPay}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {getCurrencySymbol(input.annualPayCurrency)}
                </span>
                <input
                  id="hp-annual"
                  className={inputClass}
                  inputMode="decimal"
                  value={annualDisplay}
                  aria-invalid={Boolean(errors.annualPay)}
                  onChange={(e) =>
                    set({ sourceField: 'annual', annualPay: e.target.value })
                  }
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="hp-annual-currency"
                  value={input.annualPayCurrency}
                  onChange={(next) => onPayCurrencyChange('annual', next)}
                  aria-label="Annual pay currency"
                />
              </div>
            </div>
            {errors.annualPay ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annualPay}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.workingHoursOpen}
        onToggle={(event) =>
          set({ workingHoursOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.workingHoursOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Working hours</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            Defaults: 8 hours/day · 5 days/week · 52 weeks/year. Hours, days, and
            weeks are never FX-converted.
          </p>
          <div>
            <label className={labelClass} htmlFor="hp-hours-day">
              <span>Hours per day</span>
              <InfoTooltip
                label="Hours per day"
                text="Working hours in a day. Used for hourly wage. Must be greater than zero."
              />
            </label>
            <FieldShell error={errors.hoursPerDay}>
              <input
                id="hp-hours-day"
                className={inputClass}
                inputMode="decimal"
                value={input.hoursPerDay}
                aria-invalid={Boolean(errors.hoursPerDay)}
                onChange={(e) => set({ hoursPerDay: e.target.value })}
              />
              <span className={unitClass}>hours / day</span>
            </FieldShell>
            {errors.hoursPerDay ? (
              <p className="mt-1 text-xs text-rose-600">{errors.hoursPerDay}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="hp-days-week">
              <span>Days per week</span>
              <InfoTooltip
                label="Days per week"
                text="Working days in a week (greater than 0, at most 7). Never FX-converted."
              />
            </label>
            <FieldShell error={errors.daysPerWeek}>
              <input
                id="hp-days-week"
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

          <div>
            <label className={labelClass} htmlFor="hp-weeks-year">
              <span>Weeks per year</span>
              <InfoTooltip
                label="Weeks per year"
                text="Paid weeks per year (default 52). Must be greater than zero."
              />
            </label>
            <FieldShell error={errors.weeksPerYear}>
              <input
                id="hp-weeks-year"
                className={inputClass}
                inputMode="decimal"
                value={input.weeksPerYear}
                aria-invalid={Boolean(errors.weeksPerYear)}
                onChange={(e) => set({ weeksPerYear: e.target.value })}
              />
              <span className={unitClass}>weeks / year</span>
            </FieldShell>
            {errors.weeksPerYear ? (
              <p className="mt-1 text-xs text-rose-600">{errors.weeksPerYear}</p>
            ) : null}
          </div>
        </div>
      </details>

      <div className="rounded-xl border border-border bg-muted/15">
        <div className="px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
          Result
        </div>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="hp-hourly">
              <span>Hourly wage</span>
              <InfoTooltip
                label="Hourly wage"
                text="Derived from the last-edited pay field and working hours. Independent display currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {getCurrencySymbol(input.hourlyCurrency)}
                </span>
                <input
                  id="hp-hourly"
                  className={`${inputClass} text-accent`}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedHourly ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="hp-hourly-currency"
                  value={input.hourlyCurrency}
                  onChange={onHourlyCurrencyChange}
                  aria-label="Hourly wage currency"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Time-based conversion only — no taxes, overtime, or unpaid leave.
          </p>
        </div>
      </div>

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
