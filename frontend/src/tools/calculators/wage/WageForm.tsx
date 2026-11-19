'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  WageCalculatorFieldErrors,
  WageCalculatorInput,
  WageCalculatorResult,
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

interface WageFormProps {
  input: WageCalculatorInput;
  errors: WageCalculatorFieldErrors;
  result: WageCalculatorResult | null;
  onChange: (input: WageCalculatorInput) => void;
  onWageCurrencyChange: (
    field: WageSourceField,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

function displayWage(
  field: WageSourceField,
  input: WageCalculatorInput,
  result: WageCalculatorResult | null
): string {
  if (input.sourceField === field) return input[field];
  if (!result) return input[field];
  switch (field) {
    case 'hourly':
      return result.formattedHourly;
    case 'perSecond':
      return result.formattedPerSecond;
    case 'perMinute':
      return result.formattedPerMinute;
    case 'daily':
      return result.formattedDaily;
    case 'weekly':
      return result.formattedWeekly;
    case 'biweekly':
      return result.formattedBiweekly;
    case 'monthly':
      return result.formattedMonthly;
    case 'annual':
      return result.formattedAnnual;
  }
}

export function WageForm({
  input,
  errors,
  result,
  onChange,
  onWageCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: WageFormProps) {
  const set = (patch: Partial<WageCalculatorInput>) => {
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
        <p className="text-[13px] font-semibold text-accent">Hourly wage</p>

        <WageRow
          id="wage-hourly"
          label="Hourly wage"
          tooltip="Pay per hour. Editing this field makes it the authoritative wage."
          field="hourly"
          value={displayWage('hourly', input, result)}
          currency={input.hourlyCurrency}
          error={errors.hourly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />

        <div>
          <label className={labelClass} htmlFor="wage-hours">
            <span>Hours per week</span>
            <InfoTooltip
              label="Hours per week"
              text="Used with 52 paid weeks for annual hours. Never FX-converted. Must be positive."
            />
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="wage-hours"
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
              Weekly = hourly × hours/week. Annual = weekly × 52. Daily = weekly ÷
              5 (five-day week).
            </p>
          )}
        </div>
      </div>

      <div className={sectionClass}>
        <p className="text-[13px] font-semibold text-accent">
          Salary for time frames
        </p>

        <WageRow
          id="wage-per-second"
          label="Per second"
          tooltip="Hourly ÷ 3600. Editing this field makes it authoritative."
          field="perSecond"
          value={displayWage('perSecond', input, result)}
          currency={input.perSecondCurrency}
          error={errors.perSecond}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="wage-per-minute"
          label="Per minute"
          tooltip="Hourly ÷ 60. Editing this field makes it authoritative."
          field="perMinute"
          value={displayWage('perMinute', input, result)}
          currency={input.perMinuteCurrency}
          error={errors.perMinute}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="wage-daily"
          label="Daily wage"
          tooltip="Weekly ÷ 5 (five-day week). Editing this field makes it authoritative."
          field="daily"
          value={displayWage('daily', input, result)}
          currency={input.dailyCurrency}
          error={errors.daily}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="wage-weekly"
          label="Weekly wage"
          tooltip="Hourly × hours per week (or annual ÷ 52). Editing this field makes it authoritative."
          field="weekly"
          value={displayWage('weekly', input, result)}
          currency={input.weeklyCurrency}
          error={errors.weekly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="wage-biweekly"
          label="Biweekly wage"
          tooltip="Weekly × 2 (or annual ÷ 26). Editing this field makes it authoritative."
          field="biweekly"
          value={displayWage('biweekly', input, result)}
          currency={input.biweeklyCurrency}
          error={errors.biweekly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="wage-monthly"
          label="Monthly wage"
          tooltip="Annual ÷ 12. Editing this field makes it authoritative."
          field="monthly"
          value={displayWage('monthly', input, result)}
          currency={input.monthlyCurrency}
          error={errors.monthly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="wage-annual"
          label="Annual salary"
          tooltip="Weekly × 52 paid weeks. Editing this field makes it authoritative."
          field="annual"
          value={displayWage('annual', input, result)}
          currency={input.annualCurrency}
          error={errors.annual}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
      </div>

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
