'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RateOfPayFieldErrors,
  RateOfPayInput,
  RateOfPayResult,
  RateOfPaySourceField,
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
  field: RateOfPaySourceField;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  onAmountChange: (field: RateOfPaySourceField, value: string) => void;
  onCurrencyChange: (
    field: RateOfPaySourceField,
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

interface RateOfPayFormProps {
  input: RateOfPayInput;
  errors: RateOfPayFieldErrors;
  result: RateOfPayResult | null;
  onChange: (input: RateOfPayInput) => void;
  onWageCurrencyChange: (
    field: RateOfPaySourceField,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

function displayWage(
  field: RateOfPaySourceField,
  input: RateOfPayInput,
  result: RateOfPayResult | null
): string {
  if (input.sourceField === field) return input[field];
  if (!result) return input[field];
  switch (field) {
    case 'hourly':
      return result.formattedHourly;
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

export function RateOfPayForm({
  input,
  errors,
  result,
  onChange,
  onWageCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: RateOfPayFormProps) {
  const set = (patch: Partial<RateOfPayInput>) => {
    onChange({ ...input, ...patch });
  };

  const onAmountChange = (field: RateOfPaySourceField, value: string) => {
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
          <label className={labelClass} htmlFor="rop-hours">
            <span>Hours per week</span>
            <InfoTooltip
              label="Hours per week"
              text="Used with 52 paid weeks for annual hours. Never FX-converted. Must be positive when converting wages."
            />
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="rop-hours"
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
          Put in one of the wages to see the rest!
        </p>

        <WageRow
          id="rop-hourly"
          label="Hourly wage"
          tooltip="Pay per hour. Editing this field makes it authoritative."
          field="hourly"
          value={displayWage('hourly', input, result)}
          currency={input.hourlyCurrency}
          error={errors.hourly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="rop-daily"
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
          id="rop-weekly"
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
          id="rop-biweekly"
          label="Biweekly wage"
          tooltip="Weekly × 2 (26 periods/year). Not semi-monthly. Editing this field makes it authoritative."
          field="biweekly"
          value={displayWage('biweekly', input, result)}
          currency={input.biweeklyCurrency}
          error={errors.biweekly}
          onAmountChange={onAmountChange}
          onCurrencyChange={onWageCurrencyChange}
        />
        <WageRow
          id="rop-monthly"
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
          id="rop-annual"
          label="Annual salary"
          tooltip="Gross pay for 52 paid weeks. Editing this field makes it authoritative."
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
