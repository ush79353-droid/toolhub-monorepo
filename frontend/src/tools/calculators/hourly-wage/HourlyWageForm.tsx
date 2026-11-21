'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HourlyWageFieldErrors,
  HourlyWageInput,
  HourlyWageResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';

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

interface MoneyOutProps {
  id: string;
  label: string;
  tip: string;
  symbol: string;
  value: string;
  currency: SupportedCurrency;
  onCurrencyChange: (next: SupportedCurrency) => void;
  currencyLabel: string;
}

function MoneyOutField({
  id,
  label,
  tip,
  symbol,
  value,
  currency,
  onCurrencyChange,
  currencyLabel,
}: MoneyOutProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
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
            onChange={onCurrencyChange}
            aria-label={currencyLabel}
          />
        </div>
      </div>
    </div>
  );
}

interface HourlyWageFormProps {
  input: HourlyWageInput;
  errors: HourlyWageFieldErrors;
  result: HourlyWageResult | null;
  onChange: (input: HourlyWageInput) => void;
  onHourlyWageCurrencyChange: (next: SupportedCurrency) => void;
  onPerSecondCurrencyChange: (next: SupportedCurrency) => void;
  onPerMinuteCurrencyChange: (next: SupportedCurrency) => void;
  onDailyCurrencyChange: (next: SupportedCurrency) => void;
  onWeeklyCurrencyChange: (next: SupportedCurrency) => void;
  onBiweeklyCurrencyChange: (next: SupportedCurrency) => void;
  onMonthlyCurrencyChange: (next: SupportedCurrency) => void;
  onAnnualCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function HourlyWageForm({
  input,
  errors,
  result,
  onChange,
  onHourlyWageCurrencyChange,
  onPerSecondCurrencyChange,
  onPerMinuteCurrencyChange,
  onDailyCurrencyChange,
  onWeeklyCurrencyChange,
  onBiweeklyCurrencyChange,
  onMonthlyCurrencyChange,
  onAnnualCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: HourlyWageFormProps) {
  const hourlySymbol = getCurrencySymbol(input.hourlyWageCurrency);
  const perSecondSymbol = getCurrencySymbol(
    result?.perSecondCurrency ?? input.perSecondCurrency
  );
  const perMinuteSymbol = getCurrencySymbol(
    result?.perMinuteCurrency ?? input.perMinuteCurrency
  );
  const dailySymbol = getCurrencySymbol(
    result?.dailyCurrency ?? input.dailyCurrency
  );
  const weeklySymbol = getCurrencySymbol(
    result?.weeklyCurrency ?? input.weeklyCurrency
  );
  const biweeklySymbol = getCurrencySymbol(
    result?.biweeklyCurrency ?? input.biweeklyCurrency
  );
  const monthlySymbol = getCurrencySymbol(
    result?.monthlyCurrency ?? input.monthlyCurrency
  );
  const annualSymbol = getCurrencySymbol(
    result?.annualCurrency ?? input.annualCurrency
  );

  const set = (patch: Partial<HourlyWageInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Hourly wage</h3>

        <div>
          <label className={labelClass} htmlFor="hw-hourly-wage">
            <span>Hourly wage</span>
            <InfoTooltip
              label="Hourly wage"
              text="Pay per hour. Changing currency converts this amount with stored FX rates. Zero is allowed."
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
                id="hw-hourly-wage"
                className={inputClass}
                inputMode="decimal"
                value={input.hourlyWage}
                aria-invalid={Boolean(errors.hourlyWage)}
                onChange={(e) => set({ hourlyWage: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="hw-hourly-wage-currency"
                value={input.hourlyWageCurrency}
                onChange={onHourlyWageCurrencyChange}
                aria-label="Hourly wage currency"
              />
            </div>
          </div>
          {errors.hourlyWage ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hourlyWage}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hw-hours-per-week">
            <span>Hours per week</span>
            <InfoTooltip
              label="Hours per week"
              text="Working hours in a week (default 40). Must be greater than zero. Never currency-converted."
            />
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="hw-hours-per-week"
              className={inputClass}
              inputMode="decimal"
              value={input.hoursPerWeek}
              aria-invalid={Boolean(errors.hoursPerWeek)}
              onChange={(e) => set({ hoursPerWeek: e.target.value })}
            />
          </FieldShell>
          {errors.hoursPerWeek ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hoursPerWeek}</p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Salary for time frames</h3>
        <p className="text-xs text-muted-foreground">
          Assumes 5 working days per week and 52 paid weeks per year.
        </p>

        <MoneyOutField
          id="hw-per-second"
          label="Per second"
          tip="Hourly wage ÷ 3600. Independent of hours per week."
          symbol={perSecondSymbol}
          value={result?.formattedPerSecond ?? ''}
          currency={input.perSecondCurrency}
          onCurrencyChange={onPerSecondCurrencyChange}
          currencyLabel="Per second currency"
        />
        <MoneyOutField
          id="hw-per-minute"
          label="Per minute"
          tip="Hourly wage ÷ 60. Independent of hours per week."
          symbol={perMinuteSymbol}
          value={result?.formattedPerMinute ?? ''}
          currency={input.perMinuteCurrency}
          onCurrencyChange={onPerMinuteCurrencyChange}
          currencyLabel="Per minute currency"
        />
        <MoneyOutField
          id="hw-daily"
          label="Daily wage"
          tip="Weekly wage ÷ 5 (five working days per week)."
          symbol={dailySymbol}
          value={result?.formattedDaily ?? ''}
          currency={input.dailyCurrency}
          onCurrencyChange={onDailyCurrencyChange}
          currencyLabel="Daily wage currency"
        />
        <MoneyOutField
          id="hw-weekly"
          label="Weekly wage"
          tip="Hourly wage × hours per week."
          symbol={weeklySymbol}
          value={result?.formattedWeekly ?? ''}
          currency={input.weeklyCurrency}
          onCurrencyChange={onWeeklyCurrencyChange}
          currencyLabel="Weekly wage currency"
        />
        <MoneyOutField
          id="hw-biweekly"
          label="Biweekly wage"
          tip="Weekly wage × 2."
          symbol={biweeklySymbol}
          value={result?.formattedBiweekly ?? ''}
          currency={input.biweeklyCurrency}
          onCurrencyChange={onBiweeklyCurrencyChange}
          currencyLabel="Biweekly wage currency"
        />
        <MoneyOutField
          id="hw-monthly"
          label="Monthly wage"
          tip="Weekly wage × 52 ÷ 12 (52 paid weeks per year)."
          symbol={monthlySymbol}
          value={result?.formattedMonthly ?? ''}
          currency={input.monthlyCurrency}
          onCurrencyChange={onMonthlyCurrencyChange}
          currencyLabel="Monthly wage currency"
        />
        <MoneyOutField
          id="hw-annual"
          label="Annual salary"
          tip="Weekly wage × 52."
          symbol={annualSymbol}
          value={result?.formattedAnnual ?? ''}
          currency={input.annualCurrency}
          onCurrencyChange={onAnnualCurrencyChange}
          currencyLabel="Annual salary currency"
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
