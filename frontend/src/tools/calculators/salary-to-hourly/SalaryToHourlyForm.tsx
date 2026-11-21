'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SalaryToHourlyFieldErrors,
  SalaryToHourlyInput,
  SalaryToHourlyResult,
  WageSourceField,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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
  | 'dailyCurrency'
  | 'monthlyCurrency'
  | 'weeklyCurrency'
  | 'biweeklyCurrency';

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

interface SalaryToHourlyFormProps {
  input: SalaryToHourlyInput;
  errors: SalaryToHourlyFieldErrors;
  result: SalaryToHourlyResult | null;
  onChange: (input: SalaryToHourlyInput) => void;
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

function displayPrimaryWage(
  field: WageSourceField,
  input: SalaryToHourlyInput,
  result: SalaryToHourlyResult | null
): string {
  if (input.sourceField === field) {
    return field === 'hourly' ? input.hourlyWage : input.annualSalary;
  }
  if (!result) {
    return field === 'hourly' ? input.hourlyWage : input.annualSalary;
  }
  return field === 'hourly' ? result.formattedHourly : result.formattedAnnual;
}

export function SalaryToHourlyForm({
  input,
  errors,
  result,
  onChange,
  onWageCurrencyChange,
  onOutputCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: SalaryToHourlyFormProps) {
  const set = (patch: Partial<SalaryToHourlyInput>) => {
    onChange({ ...input, ...patch });
  };

  const hourlyDisplay = displayPrimaryWage('hourly', input, result);
  const annualDisplay = displayPrimaryWage('annual', input, result);
  const hourlySymbol = getCurrencySymbol(input.hourlyWageCurrency);
  const annualSymbol = getCurrencySymbol(input.annualSalaryCurrency);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="sth-hourly">
            <span>Hourly wage</span>
            <InfoTooltip
              label="Hourly wage"
              text="Gross pay per hour. Editing this field makes it authoritative. Changing currency converts the typed amount when it is authoritative."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.hourlyWage}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {hourlySymbol}
              </span>
              <input
                id="sth-hourly"
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
                id="sth-hourly-currency"
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
          <label className={labelClass} htmlFor="sth-hours">
            <span>Hours per week</span>
            <InfoTooltip
              label="Hours per week"
              text="Used with 52 weeks for annual hours. Never FX-converted. Must be positive."
            />
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="sth-hours"
              className={inputClass}
              inputMode="decimal"
              value={input.hoursPerWeek}
              aria-invalid={Boolean(errors.hoursPerWeek)}
              onChange={(e) => set({ hoursPerWeek: e.target.value })}
            />
          </FieldShell>
          {errors.hoursPerWeek ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hoursPerWeek}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Annual hours = hours/week × 52. Hourly = annual ÷ annual hours.
              Daily wage assumes a five-day week (weekly ÷ 5).
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="sth-annual">
            <span>Annual salary</span>
            <InfoTooltip
              label="Annual salary"
              text="Gross pay for the year. Editing this field makes it authoritative. Changing currency converts the typed amount when it is authoritative."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.annualSalary}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {annualSymbol}
              </span>
              <input
                id="sth-annual"
                className={inputClass}
                inputMode="decimal"
                value={annualDisplay}
                aria-invalid={Boolean(errors.annualSalary)}
                onChange={(e) =>
                  set({ sourceField: 'annual', annualSalary: e.target.value })
                }
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="sth-annual-currency"
                value={input.annualSalaryCurrency}
                onChange={(next) => onWageCurrencyChange('annual', next)}
                aria-label="Annual salary currency"
              />
            </div>
          </div>
          {errors.annualSalary ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualSalary}</p>
          ) : null}
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.wageAsOpen}
        onToggle={(event) => set({ wageAsOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.wageAsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Your wage as:</span>
        </summary>
        <div className="grid gap-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:grid-cols-2 sm:px-4 sm:pb-4">
          <OutputRow
            id="sth-daily"
            label="Daily"
            tooltip="Weekly wage ÷ 5 (five-day week), shown in the currency you select."
            value={result?.formattedDaily ?? ''}
            currency={input.dailyCurrency}
            currencyKey="dailyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="sth-monthly"
            label="Monthly"
            tooltip="Annual salary ÷ 12, shown in the currency you select."
            value={result?.formattedMonthly ?? ''}
            currency={input.monthlyCurrency}
            currencyKey="monthlyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="sth-weekly"
            label="Weekly"
            tooltip="Hourly × hours per week (or annual ÷ 52), shown in the currency you select."
            value={result?.formattedWeekly ?? ''}
            currency={input.weeklyCurrency}
            currencyKey="weeklyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="sth-biweekly"
            label="Biweekly"
            tooltip="Weekly wage × 2 (or annual ÷ 26), shown in the currency you select."
            value={result?.formattedBiweekly ?? ''}
            currency={input.biweeklyCurrency}
            currencyKey="biweeklyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.otherIntervalsOpen}
        onToggle={(event) =>
          set({ otherIntervalsOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.otherIntervalsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Other time intervals</span>
        </summary>
        <div className="border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            No additional verified time-interval fields for this calculator.
          </p>
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
