'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MonthlyIncomeFieldErrors,
  MonthlyIncomeInput,
  MonthlyIncomeResult,
  MonthlyIncomeSourceField,
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
  field: MonthlyIncomeSourceField,
  input: MonthlyIncomeInput,
  result: MonthlyIncomeResult | null
): string {
  if (input.sourceField === field) return input[field];
  if (!result) return input[field];
  if (field === 'hourly') return result.formattedHourly;
  if (field === 'daily') return result.formattedDaily;
  if (field === 'weekly') return result.formattedWeekly;
  return result.formattedYearly;
}

const currencyKey: Record<
  MonthlyIncomeSourceField,
  keyof Pick<
    MonthlyIncomeInput,
    'hourlyCurrency' | 'dailyCurrency' | 'weeklyCurrency' | 'yearlyCurrency'
  >
> = {
  hourly: 'hourlyCurrency',
  daily: 'dailyCurrency',
  weekly: 'weeklyCurrency',
  yearly: 'yearlyCurrency',
};

interface MonthlyIncomeFormProps {
  input: MonthlyIncomeInput;
  errors: MonthlyIncomeFieldErrors;
  result: MonthlyIncomeResult | null;
  onChange: (input: MonthlyIncomeInput) => void;
  onEarnCurrencyChange: (
    field: MonthlyIncomeSourceField,
    next: SupportedCurrency
  ) => void;
  onMonthlyCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function MonthlyIncomeForm({
  input,
  errors,
  result,
  onChange,
  onEarnCurrencyChange,
  onMonthlyCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: MonthlyIncomeFormProps) {
  const set = (patch: Partial<MonthlyIncomeInput>) => {
    onChange({ ...input, ...patch });
  };

  const renderEarn = (
    field: MonthlyIncomeSourceField,
    label: string,
    tooltip: string
  ) => (
    <div>
      <label className={labelClass} htmlFor={`mi-${field}`}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={errors[field]}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {getCurrencySymbol(input[currencyKey[field]])}
          </span>
          <input
            id={`mi-${field}`}
            className={inputClass}
            inputMode="decimal"
            value={displayPay(field, input, result)}
            aria-invalid={Boolean(errors[field])}
            onChange={(e) =>
              set({ sourceField: field, [field]: e.target.value })
            }
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`mi-${field}-currency`}
            value={input[currencyKey[field]]}
            onChange={(next) => onEarnCurrencyChange(field, next)}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[field] ? (
        <p className="mt-1 text-xs text-rose-600">{errors[field]}</p>
      ) : null}
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.earnOpen}
        onToggle={(event) => set({ earnOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.earnOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>How much you earn....</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          {renderEarn(
            'hourly',
            'Hourly',
            'Gross pay per hour. Editing makes this field authoritative.'
          )}
          {renderEarn(
            'daily',
            'Daily',
            'Gross pay per workday. Editing makes this field authoritative.'
          )}
          {renderEarn(
            'weekly',
            'Weekly',
            'Gross pay per week. Editing makes this field authoritative.'
          )}
          {renderEarn(
            'yearly',
            'Yearly',
            'Gross pay per year. Editing makes this field authoritative.'
          )}

          <label className="flex cursor-pointer items-start gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-primary"
              checked={input.adjustSchedule}
              onChange={(e) => set({ adjustSchedule: e.target.checked })}
            />
            <span>Adjust number of hours and days</span>
          </label>

          {!input.adjustSchedule ? (
            <p className="rounded-lg border border-border bg-brand-softTeal/40 px-3 py-2 text-xs text-muted-foreground">
              Select the checkbox to adjust the numbers of hours and days you
              work.
            </p>
          ) : (
            <div className="space-y-3.5">
              <p className="text-xs text-muted-foreground">
                Defaults when unchecked: 8 hours/day · 5 days/week · 52
                weeks/year. Schedule values never FX-convert.
              </p>
              <div>
                <label className={labelClass} htmlFor="mi-hours">
                  <span>Hours per day</span>
                </label>
                <FieldShell error={errors.hoursPerDay}>
                  <input
                    id="mi-hours"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.hoursPerDay}
                    aria-invalid={Boolean(errors.hoursPerDay)}
                    onChange={(e) => set({ hoursPerDay: e.target.value })}
                  />
                  <span className={unitClass}>hours / day</span>
                </FieldShell>
                {errors.hoursPerDay ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.hoursPerDay}
                  </p>
                ) : null}
              </div>
              <div>
                <label className={labelClass} htmlFor="mi-days">
                  <span>Days per week</span>
                </label>
                <FieldShell error={errors.daysPerWeek}>
                  <input
                    id="mi-days"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.daysPerWeek}
                    aria-invalid={Boolean(errors.daysPerWeek)}
                    onChange={(e) => set({ daysPerWeek: e.target.value })}
                  />
                  <span className={unitClass}>days / week</span>
                </FieldShell>
                {errors.daysPerWeek ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.daysPerWeek}
                  </p>
                ) : null}
              </div>
              <div>
                <label className={labelClass} htmlFor="mi-weeks">
                  <span>Weeks per year</span>
                </label>
                <FieldShell error={errors.weeksPerYear}>
                  <input
                    id="mi-weeks"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.weeksPerYear}
                    aria-invalid={Boolean(errors.weeksPerYear)}
                    onChange={(e) => set({ weeksPerYear: e.target.value })}
                  />
                  <span className={unitClass}>weeks / year</span>
                </FieldShell>
                {errors.weeksPerYear ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.weeksPerYear}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </details>

      <div className="rounded-xl border border-border bg-muted/15">
        <div className="px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
          Result
        </div>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="mi-monthly">
              <span>Monthly income</span>
              <InfoTooltip
                label="Monthly income"
                text="Yearly earnings ÷ 12 in the selected display currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {getCurrencySymbol(input.monthlyCurrency)}
                </span>
                <input
                  id="mi-monthly"
                  className={`${inputClass} text-accent`}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedMonthly ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="mi-monthly-currency"
                  value={input.monthlyCurrency}
                  onChange={onMonthlyCurrencyChange}
                  aria-label="Monthly income currency"
                />
              </div>
            </div>
          </div>
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
