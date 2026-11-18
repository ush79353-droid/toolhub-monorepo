'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AnnualToMonthlySalaryFieldErrors,
  AnnualToMonthlySalaryInput,
  AnnualToMonthlySalaryResult,
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
  | 'monthlyCurrency'
  | 'weeklyCurrency'
  | 'dailyCurrency'
  | 'hourlyCurrency';

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

interface AnnualToMonthlySalaryFormProps {
  input: AnnualToMonthlySalaryInput;
  errors: AnnualToMonthlySalaryFieldErrors;
  result: AnnualToMonthlySalaryResult | null;
  onChange: (input: AnnualToMonthlySalaryInput) => void;
  onAnnualSalaryCurrencyChange: (next: SupportedCurrency) => void;
  onOutputCurrencyChange: (
    key: OutputCurrencyKey,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function AnnualToMonthlySalaryForm({
  input,
  errors,
  result,
  onChange,
  onAnnualSalaryCurrencyChange,
  onOutputCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: AnnualToMonthlySalaryFormProps) {
  const annualSymbol = getCurrencySymbol(input.annualSalaryCurrency);

  const set = (patch: Partial<AnnualToMonthlySalaryInput>) => {
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
        open={input.yourSalaryOpen}
        onToggle={(event) =>
          set({ yourSalaryOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.yourSalaryOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Your salary</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="atms-annual">
              <span>Annual salary</span>
              <InfoTooltip
                label="Annual salary"
                text="Gross pay for the year. Changing currency converts this amount with stored FX rates."
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
                  id="atms-annual"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annualSalary}
                  aria-invalid={Boolean(errors.annualSalary)}
                  onChange={(e) => set({ annualSalary: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="atms-annual-currency"
                  value={input.annualSalaryCurrency}
                  onChange={onAnnualSalaryCurrencyChange}
                  aria-label="Annual salary currency"
                />
              </div>
            </div>
            {errors.annualSalary ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annualSalary}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="atms-hours">
              <span>Hours per week</span>
              <InfoTooltip
                label="Hours per week"
                text="Used with 52 weeks for hourly wage. Never FX-converted. Must be positive."
              />
            </label>
            <FieldShell error={errors.hoursPerWeek}>
              <input
                id="atms-hours"
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
                Assumes 52 paid weeks per year and a five-day working week for
                daily pay (annual ÷ 260). Hourly = annual ÷ (52 × hours/week).
              </p>
            )}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.otherWageOpen}
        onToggle={(event) =>
          set({ otherWageOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.otherWageOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Other wage measures</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <OutputRow
            id="atms-monthly"
            label="Monthly salary"
            tooltip="Annual salary ÷ 12, shown in the currency you select."
            value={result?.formattedMonthly ?? ''}
            currency={input.monthlyCurrency}
            currencyKey="monthlyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="atms-weekly"
            label="Weekly salary"
            tooltip="Annual salary ÷ 52, shown in the currency you select."
            value={result?.formattedWeekly ?? ''}
            currency={input.weeklyCurrency}
            currencyKey="weeklyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="atms-daily"
            label="Daily salary"
            tooltip="Annual salary ÷ (52 × 5), five-day week. Shown in the currency you select."
            value={result?.formattedDaily ?? ''}
            currency={input.dailyCurrency}
            currencyKey="dailyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
          <OutputRow
            id="atms-hourly"
            label="Hourly salary"
            tooltip="Annual salary ÷ (52 × hours per week). Shown in the currency you select."
            value={result?.formattedHourly ?? ''}
            currency={input.hourlyCurrency}
            currencyKey="hourlyCurrency"
            onCurrencyChange={onOutputCurrencyChange}
          />
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.moreWageOpen}
        onToggle={(event) =>
          set({ moreWageOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.moreWageOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>More wage measures</span>
        </summary>
        <div className="border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            No additional verified wage fields for this calculator.
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
