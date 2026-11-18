'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HourlyToAnnualSalaryFieldErrors,
  HourlyToAnnualSalaryInput,
  HourlyToAnnualSalaryResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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
  | 'annualCurrency'
  | 'monthlyCurrency'
  | 'weeklyCurrency'
  | 'dailyCurrency';

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

interface HourlyToAnnualSalaryFormProps {
  input: HourlyToAnnualSalaryInput;
  errors: HourlyToAnnualSalaryFieldErrors;
  result: HourlyToAnnualSalaryResult | null;
  onChange: (input: HourlyToAnnualSalaryInput) => void;
  onHourlyWageCurrencyChange: (next: SupportedCurrency) => void;
  onOutputCurrencyChange: (
    key: OutputCurrencyKey,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function HourlyToAnnualSalaryForm({
  input,
  errors,
  result,
  onChange,
  onHourlyWageCurrencyChange,
  onOutputCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: HourlyToAnnualSalaryFormProps) {
  const hourlySymbol = getCurrencySymbol(input.hourlyWageCurrency);

  const set = (patch: Partial<HourlyToAnnualSalaryInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.dataOpen}
        onToggle={(event) => set({ dataOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.dataOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Data</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="htas-hourly">
              <span>Hourly wage</span>
              <InfoTooltip
                label="Hourly wage"
                text="Gross pay per hour. Changing currency converts this amount with stored FX rates."
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
                  id="htas-hourly"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.hourlyWage}
                  aria-invalid={Boolean(errors.hourlyWage)}
                  onChange={(e) => set({ hourlyWage: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="htas-hourly-currency"
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
            <label className={labelClass} htmlFor="htas-hours">
              <span>Hours per week</span>
              <InfoTooltip
                label="Hours per week"
                text="Used with hourly wage for weekly and annual pay. Never FX-converted. Must be positive."
              />
            </label>
            <FieldShell error={errors.hoursPerWeek}>
              <input
                id="htas-hours"
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
                Assumes 52 paid weeks per year. Weekly = hourly × hours/week;
                annual = weekly × 52.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="htas-days">
              <span>Days per week</span>
              <InfoTooltip
                label="Days per week"
                text="Used only for daily pay (weekly ÷ days). Default 5. Never FX-converted. Must be positive."
              />
            </label>
            <FieldShell error={errors.daysPerWeek}>
              <input
                id="htas-days"
                className={inputClass}
                inputMode="decimal"
                value={input.daysPerWeek}
                aria-invalid={Boolean(errors.daysPerWeek)}
                onChange={(e) => set({ daysPerWeek: e.target.value })}
              />
            </FieldShell>
            {errors.daysPerWeek ? (
              <p className="mt-1 text-xs text-rose-600">{errors.daysPerWeek}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Per day = weekly pay ÷ days per week.
              </p>
            )}
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
          <span>Results</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <OutputRow
            id="htas-annual"
            label="Annual salary"
            tooltip="Weekly pay × 52, shown in the currency you select."
            value={result?.formattedAnnual ?? ''}
            currency={input.annualCurrency}
            currencyKey="annualCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="htas-monthly"
            label="Monthly pay"
            tooltip="Annual salary ÷ 12, shown in the currency you select."
            value={result?.formattedMonthly ?? ''}
            currency={input.monthlyCurrency}
            currencyKey="monthlyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="htas-weekly"
            label="Per week"
            tooltip="Hourly wage × hours per week, shown in the currency you select."
            value={result?.formattedWeekly ?? ''}
            currency={input.weeklyCurrency}
            currencyKey="weeklyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="htas-daily"
            label="Per day"
            tooltip="Weekly pay ÷ days per week, shown in the currency you select."
            value={result?.formattedDaily ?? ''}
            currency={input.dailyCurrency}
            currencyKey="dailyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
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
