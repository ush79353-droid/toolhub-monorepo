'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MoneyPerHourFieldErrors,
  MoneyPerHourInput,
  MoneyPerHourResult,
  MoneyPerHourSourceField,
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

interface WageRowProps {
  id: string;
  label: string;
  tooltip: string;
  field: MoneyPerHourSourceField;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  onAmountChange: (field: MoneyPerHourSourceField, value: string) => void;
  onCurrencyChange: (
    field: MoneyPerHourSourceField,
    next: SupportedCurrency
  ) => void;
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

interface MoneyPerHourFormProps {
  input: MoneyPerHourInput;
  errors: MoneyPerHourFieldErrors;
  result: MoneyPerHourResult | null;
  onChange: (input: MoneyPerHourInput) => void;
  onWageCurrencyChange: (
    field: MoneyPerHourSourceField,
    next: SupportedCurrency
  ) => void;
  onHourlyCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

function displayWage(
  field: MoneyPerHourSourceField,
  input: MoneyPerHourInput,
  result: MoneyPerHourResult | null
): string {
  if (input.sourceField === field) return input[field];
  if (!result) return input[field];
  switch (field) {
    case 'annual':
      return result.formattedAnnual;
    case 'monthly':
      return result.formattedMonthly;
    case 'biweekly':
      return result.formattedBiweekly;
    case 'weekly':
      return result.formattedWeekly;
    case 'daily':
      return result.formattedDaily;
  }
}

export function MoneyPerHourForm({
  input,
  errors,
  result,
  onChange,
  onWageCurrencyChange,
  onHourlyCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: MoneyPerHourFormProps) {
  const set = (patch: Partial<MoneyPerHourInput>) => {
    onChange({ ...input, ...patch });
  };

  const onAmountChange = (field: MoneyPerHourSourceField, value: string) => {
    set({ sourceField: field, [field]: value });
  };

  const hourlySymbol = getCurrencySymbol(input.hourlyCurrency);
  const hourlyDisplay = result ? result.formattedHourly : '';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <p className="text-[13px] font-semibold text-accent">
          Input any of the following:
        </p>

        <WageRow
          id="mph-annual"
          label="Annual salary"
          tooltip="Gross pay for 52 paid weeks. Editing this field makes it authoritative."
          field="annual"
          value={displayWage('annual', input, result)}
          currency={input.annualCurrency}
          error={errors.annual}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="mph-monthly"
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
          id="mph-biweekly"
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
          id="mph-weekly"
          label="Weekly wage"
          tooltip="Hourly × hours per week. Editing this field makes it authoritative."
          field="weekly"
          value={displayWage('weekly', input, result)}
          currency={input.weeklyCurrency}
          error={errors.weekly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="mph-daily"
          label="Daily wage"
          tooltip="Weekly ÷ 5 (five-day week). Editing this field makes it authoritative."
          field="daily"
          value={displayWage('daily', input, result)}
          currency={input.dailyCurrency}
          error={errors.daily}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />

        <div>
          <label className={labelClass} htmlFor="mph-hours">
            <span>Hours per week</span>
            <InfoTooltip
              label="Hours per week"
              text="Used with 52 paid weeks for annual hours. Never FX-converted. Must be positive."
            />
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="mph-hours"
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
              Money per hour uses annual hours = hours/week × 52. Daily = weekly ÷
              5 (five-day week).
            </p>
          )}
        </div>
      </div>

      <div className={sectionClass}>
        <p className="text-[13px] font-semibold text-accent">Answer:</p>
        <div>
          <label className={labelClass} htmlFor="mph-hourly">
            <span>Money per hour</span>
            <InfoTooltip
              label="Money per hour"
              text="Equivalent hourly rate from the authoritative period wage and hours per week. Display currency is independent."
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {hourlySymbol}
              </span>
              <input
                id="mph-hourly"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={hourlyDisplay}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mph-hourly-currency"
                value={input.hourlyCurrency}
                onChange={onHourlyCurrencyChange}
                aria-label="Money per hour currency"
              />
            </div>
            <span className="text-sm text-muted-foreground">per hour</span>
          </div>
        </div>
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
