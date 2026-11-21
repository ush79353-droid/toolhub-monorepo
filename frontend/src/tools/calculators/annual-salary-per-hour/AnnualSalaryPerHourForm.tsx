'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AnnualSalaryPerHourFieldErrors,
  AnnualSalaryPerHourInput,
  AnnualSalaryPerHourResult,
  WageSourceField,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface WageRowProps {
  id: string;
  label: string;
  tooltip: string;
  field: WageSourceField;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  onAmountChange: (field: WageSourceField, value: string) => void;
  onCurrencyChange: (field: WageSourceField, next: SupportedCurrency) => void;
}

function WageRow({
  id,
  label,
  tooltip,
  field,
  value,
  currency,
  error,
  onAmountChange,
  onCurrencyChange,
}: WageRowProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(e) => onAmountChange(field, e.target.value)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={(next) => onCurrencyChange(field, next)}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface AnnualSalaryPerHourFormProps {
  input: AnnualSalaryPerHourInput;
  errors: AnnualSalaryPerHourFieldErrors;
  result: AnnualSalaryPerHourResult | null;
  onChange: (input: AnnualSalaryPerHourInput) => void;
  onWageCurrencyChange: (
    field: WageSourceField,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

function displayWage(
  field: WageSourceField,
  input: AnnualSalaryPerHourInput,
  result: AnnualSalaryPerHourResult | null
): string {
  if (input.sourceField === field) {
    return input[field];
  }
  if (!result) return input[field];
  switch (field) {
    case 'hourly':
      return result.formattedHourly;
    case 'daily':
      return result.formattedDaily;
    case 'weekly':
      return result.formattedWeekly;
    case 'monthly':
      return result.formattedMonthly;
    case 'annual':
      return result.formattedAnnual;
  }
}

export function AnnualSalaryPerHourForm({
  input,
  errors,
  result,
  onChange,
  onWageCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: AnnualSalaryPerHourFormProps) {
  const set = (patch: Partial<AnnualSalaryPerHourInput>) => {
    onChange({ ...input, ...patch });
  };

  const onAmountChange = (field: WageSourceField, value: string) => {
    set({ sourceField: field, [field]: value });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="asph-hours">
            <span>Hours per week</span>
            <InfoTooltip
              label="Hours per week"
              text="Used with 52 weeks to get annual hours. Never FX-converted. Must be positive."
            />
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="asph-hours"
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
              Annual hours = hours/week × 52. Daily wage assumes a five-day week
              (weekly ÷ 5).
            </p>
          )}
        </div>
      </div>

      <div className={sectionClass}>
        <p className="text-[13px] font-medium text-accent">
          Put in one of the wages to see the rest!
        </p>

        <WageRow
          id="asph-hourly"
          label="Hourly wage"
          tooltip="Pay per hour. Editing this field makes it the authoritative wage."
          field="hourly"
          value={displayWage('hourly', input, result)}
          currency={input.hourlyCurrency}
          error={errors.hourly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="asph-daily"
          label="Daily wage"
          tooltip="Weekly wage ÷ 5 (five-day week). Editing this field makes it authoritative."
          field="daily"
          value={displayWage('daily', input, result)}
          currency={input.dailyCurrency}
          error={errors.daily}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="asph-weekly"
          label="Weekly wage"
          tooltip="Annual salary ÷ 52. Editing this field makes it authoritative."
          field="weekly"
          value={displayWage('weekly', input, result)}
          currency={input.weeklyCurrency}
          error={errors.weekly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="asph-monthly"
          label="Monthly wage"
          tooltip="Annual salary ÷ 12. Editing this field makes it authoritative."
          field="monthly"
          value={displayWage('monthly', input, result)}
          currency={input.monthlyCurrency}
          error={errors.monthly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="asph-annual"
          label="Annual salary"
          tooltip="Hourly × hours/week × 52 when derived from hourly. Editing this field makes it authoritative."
          field="annual"
          value={displayWage('annual', input, result)}
          currency={input.annualCurrency}
          error={errors.annual}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.otherPeriodsOpen}
        onToggle={(event) =>
          set({ otherPeriodsOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.otherPeriodsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Other periods</span>
        </summary>
        <div className="border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            No additional verified period fields for this calculator.
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
