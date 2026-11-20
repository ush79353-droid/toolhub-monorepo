'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SemiMonthlyPayFieldErrors,
  SemiMonthlyPayInput,
  SemiMonthlyPayResult,
  SemiMonthlyPaySourceField,
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

function displayWage(
  field: SemiMonthlyPaySourceField,
  input: SemiMonthlyPayInput,
  result: SemiMonthlyPayResult | null,
): string {
  if (input.sourceField === field) {
    switch (field) {
      case 'hourly':
        return input.hourlyWage;
      case 'daily':
        return input.dailyWage;
      case 'weekly':
        return input.weeklyWage;
      case 'monthly':
        return input.monthlyWage;
      case 'yearly':
        return input.yearlyWage;
    }
  }
  if (!result) {
    switch (field) {
      case 'hourly':
        return input.hourlyWage;
      case 'daily':
        return input.dailyWage;
      case 'weekly':
        return input.weeklyWage;
      case 'monthly':
        return input.monthlyWage;
      case 'yearly':
        return input.yearlyWage;
    }
  }
  switch (field) {
    case 'hourly':
      return result.formattedHourly;
    case 'daily':
      return result.formattedDaily;
    case 'weekly':
      return result.formattedWeekly;
    case 'monthly':
      return result.formattedMonthly;
    case 'yearly':
      return result.formattedYearly;
  }
}

interface MoneyRowProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  onValueChange: (raw: string) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onFocusSource: () => void;
}

function MoneyRow({
  id,
  label,
  tooltip,
  value,
  currency,
  error,
  onValueChange,
  onCurrencyChange,
  onFocusSource,
}: MoneyRowProps) {
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
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={onFocusSource}
            aria-invalid={Boolean(error)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface SemiMonthlyPayFormProps {
  input: SemiMonthlyPayInput;
  errors: SemiMonthlyPayFieldErrors;
  result: SemiMonthlyPayResult | null;
  onChange: (next: SemiMonthlyPayInput) => void;
  onWageCurrencyChange: (
    field: SemiMonthlyPaySourceField,
    next: SupportedCurrency,
  ) => void;
  onSemiMonthlyCurrencyChange: (next: SupportedCurrency) => void;
  conversionError: string | null;
  ratesWarning: string | null;
}

export function SemiMonthlyPayForm({
  input,
  errors,
  result,
  onChange,
  onWageCurrencyChange,
  onSemiMonthlyCurrencyChange,
  conversionError,
  ratesWarning,
}: SemiMonthlyPayFormProps) {
  const setSource = (field: SemiMonthlyPaySourceField) => {
    if (input.sourceField === field) return;
    onChange({ ...input, sourceField: field });
  };

  const patch = (partial: Partial<SemiMonthlyPayInput>) => {
    onChange({ ...input, ...partial });
  };

  const semiSymbol = getCurrencySymbol(input.semiMonthlyCurrency);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 bg-muted/30 px-4 py-3 text-left"
          onClick={() => patch({ wagesOpen: !input.wagesOpen })}
          aria-expanded={input.wagesOpen}
        >
          <span className="text-sm font-semibold text-accent">
            Input any of the wages below to obtain the answer
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              input.wagesOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.wagesOpen ? (
          <div className="space-y-3 border-t border-border px-4 py-4">
            <MoneyRow
              id="semi-hourly"
              label="Hourly wage"
              tooltip="Pay per hour. Weekly = hourly × hours/week; semi-monthly = yearly ÷ 24."
              value={displayWage('hourly', input, result)}
              currency={input.hourlyWageCurrency}
              error={errors.hourlyWage}
              onValueChange={(raw) =>
                onChange({ ...input, sourceField: 'hourly', hourlyWage: raw })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('hourly', next)}
              onFocusSource={() => setSource('hourly')}
            />
            <MoneyRow
              id="semi-daily"
              label="Daily wage"
              tooltip="Pay per day. Weekly = daily × days/week; semi-monthly = yearly ÷ 24."
              value={displayWage('daily', input, result)}
              currency={input.dailyWageCurrency}
              error={errors.dailyWage}
              onValueChange={(raw) =>
                onChange({ ...input, sourceField: 'daily', dailyWage: raw })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('daily', next)}
              onFocusSource={() => setSource('daily')}
            />
            <MoneyRow
              id="semi-weekly"
              label="Weekly wage"
              tooltip="Pay per week. Yearly = weekly × 52; semi-monthly = yearly ÷ 24."
              value={displayWage('weekly', input, result)}
              currency={input.weeklyWageCurrency}
              error={errors.weeklyWage}
              onValueChange={(raw) =>
                onChange({ ...input, sourceField: 'weekly', weeklyWage: raw })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('weekly', next)}
              onFocusSource={() => setSource('weekly')}
            />
            <MoneyRow
              id="semi-monthly-wage"
              label="Monthly wage"
              tooltip="Pay per month. Semi-monthly = monthly ÷ 2 (same as yearly ÷ 24)."
              value={displayWage('monthly', input, result)}
              currency={input.monthlyWageCurrency}
              error={errors.monthlyWage}
              onValueChange={(raw) =>
                onChange({ ...input, sourceField: 'monthly', monthlyWage: raw })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('monthly', next)}
              onFocusSource={() => setSource('monthly')}
            />
            <MoneyRow
              id="semi-yearly"
              label="Yearly wage"
              tooltip="Annual pay. Semi-monthly = yearly ÷ 24 (twice per month, not biweekly)."
              value={displayWage('yearly', input, result)}
              currency={input.yearlyWageCurrency}
              error={errors.yearlyWage}
              onValueChange={(raw) =>
                onChange({ ...input, sourceField: 'yearly', yearlyWage: raw })
              }
              onCurrencyChange={(next) => onWageCurrencyChange('yearly', next)}
              onFocusSource={() => setSource('yearly')}
            />

            <div>
              <label className={labelClass} htmlFor="semi-hours">
                <span>Hours per week</span>
                <InfoTooltip
                  label="Hours per week"
                  text="Used to relate hourly and weekly wages. Never FX-converted. Default 40."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.hoursPerWeek}>
                  <input
                    id="semi-hours"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.hoursPerWeek}
                    onChange={(e) => patch({ hoursPerWeek: e.target.value })}
                    aria-invalid={Boolean(errors.hoursPerWeek)}
                  />
                  <span className={unitClass}>hrs</span>
                </FieldShell>
              </div>
              {errors.hoursPerWeek ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.hoursPerWeek}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="semi-days">
                <span>Days per week</span>
                <InfoTooltip
                  label="Days per week"
                  text="Used to relate daily and weekly wages. Must be greater than 0 and at most 7. Never FX-converted. Default 5."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.daysPerWeek}>
                  <input
                    id="semi-days"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.daysPerWeek}
                    onChange={(e) => patch({ daysPerWeek: e.target.value })}
                    aria-invalid={Boolean(errors.daysPerWeek)}
                  />
                  <span className={unitClass}>days</span>
                </FieldShell>
              </div>
              {errors.daysPerWeek ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.daysPerWeek}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 bg-muted/30 px-4 py-3 text-left"
          onClick={() => patch({ resultsOpen: !input.resultsOpen })}
          aria-expanded={input.resultsOpen}
        >
          <span className="text-sm font-semibold text-accent">Answer</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              input.resultsOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.resultsOpen ? (
          <div className="space-y-3 border-t border-border px-4 py-4">
            <div>
              <label className={labelClass} htmlFor="semi-result">
                <span>Semi-monthly wage</span>
                <InfoTooltip
                  label="Semi-monthly wage"
                  text="Twice per month — 24 periods/year (yearly ÷ 24). Not biweekly (26). Math runs in the last-edited wage currency, then converts for display."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {semiSymbol}
                  </span>
                  <input
                    id="semi-result"
                    className={`${inputClass} text-accent`}
                    readOnly
                    tabIndex={-1}
                    value={result?.formattedSemiMonthly ?? ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="semi-result-currency"
                    value={input.semiMonthlyCurrency}
                    onChange={onSemiMonthlyCurrencyChange}
                    aria-label="Semi-monthly wage currency"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {conversionError ? (
        <p className="text-xs text-amber-700" role="status">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
    </div>
  );
}
