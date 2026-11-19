'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AnnualIncomeFieldErrors,
  AnnualIncomeInput,
  AnnualIncomeResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface AnnualIncomeFormProps {
  input: AnnualIncomeInput;
  errors: AnnualIncomeFieldErrors;
  result: AnnualIncomeResult | null;
  onChange: (input: AnnualIncomeInput) => void;
  onHourlyWageCurrencyChange: (next: SupportedCurrency) => void;
  onAnnualIncomeCurrencyChange: (next: SupportedCurrency) => void;
  onNetHourlyCurrencyChange: (next: SupportedCurrency) => void;
  onNetAnnualCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function AnnualIncomeForm({
  input,
  errors,
  result,
  onChange,
  onHourlyWageCurrencyChange,
  onAnnualIncomeCurrencyChange,
  onNetHourlyCurrencyChange,
  onNetAnnualCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: AnnualIncomeFormProps) {
  const wageSymbol = getCurrencySymbol(input.hourlyWageCurrency);
  const annualSymbol = getCurrencySymbol(input.annualIncomeCurrency);
  const netHourlySymbol = getCurrencySymbol(input.netHourlyCurrency);
  const netAnnualSymbol = getCurrencySymbol(input.netAnnualCurrency);

  const set = (patch: Partial<AnnualIncomeInput>) => {
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
        <div>
          <label className={labelClass} htmlFor="ai-hours">
            <span>Working hours per week</span>
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="ai-hours"
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

        <div>
          <label className={labelClass} htmlFor="ai-weeks">
            <span>Working weeks per year</span>
          </label>
          <FieldShell error={errors.weeksPerYear}>
            <input
              id="ai-weeks"
              className={inputClass}
              inputMode="decimal"
              value={input.weeksPerYear}
              aria-invalid={Boolean(errors.weeksPerYear)}
              onChange={(e) => set({ weeksPerYear: e.target.value })}
            />
          </FieldShell>
          {errors.weeksPerYear ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weeksPerYear}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ai-hourly-wage">
            <span>Hourly wage</span>
            <InfoTooltip
              label="Hourly wage"
              text="Gross pay per hour before the flat tax. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.hourlyWage}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {wageSymbol}
              </span>
              <input
                id="ai-hourly-wage"
                className={inputClass}
                inputMode="decimal"
                value={input.hourlyWage}
                aria-invalid={Boolean(errors.hourlyWage)}
                onChange={(e) => set({ hourlyWage: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ai-hourly-wage-currency"
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
          <label className={labelClass} htmlFor="ai-annual-income">
            <span>Annual income</span>
            <InfoTooltip
              label="Annual income"
              text="Hourly wage × hours per week × weeks per year, shown in the currency you select."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {annualSymbol}
              </span>
              <input
                id="ai-annual-income"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedAnnualIncome ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ai-annual-income-currency"
                value={input.annualIncomeCurrency}
                onChange={onAnnualIncomeCurrencyChange}
                aria-label="Annual income currency"
              />
            </div>
          </div>
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.netOpen}
        onToggle={(event) => set({ netOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.netOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Net salary</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="ai-tax">
              <span>Tax</span>
              <InfoTooltip
                label="Tax"
                text="Simplified flat-rate deduction (0–100%). Not a country-specific payroll or progressive tax calculation. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.taxPercent}>
              <input
                id="ai-tax"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.taxPercent}
                aria-invalid={Boolean(errors.taxPercent)}
                onChange={(e) => set({ taxPercent: e.target.value })}
              />
              <span
                className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                %
              </span>
            </FieldShell>
            {errors.taxPercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.taxPercent}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Flat-rate estimate only — not jurisdiction-specific payroll tax.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="ai-net-hourly">
              <span>Net hourly wage</span>
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {netHourlySymbol}
                </span>
                <input
                  id="ai-net-hourly"
                  className={`${inputClass} text-accent`}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedNetHourly ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ai-net-hourly-currency"
                  value={input.netHourlyCurrency}
                  onChange={onNetHourlyCurrencyChange}
                  aria-label="Net hourly wage currency"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="ai-net-annual">
              <span>Net annual income</span>
              <InfoTooltip
                label="Net annual income"
                text="Annual income × (1 − tax ÷ 100), shown in the currency you select."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {netAnnualSymbol}
                </span>
                <input
                  id="ai-net-annual"
                  className={`${inputClass} text-accent`}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedNetAnnual ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ai-net-annual-currency"
                  value={input.netAnnualCurrency}
                  onChange={onNetAnnualCurrencyChange}
                  aria-label="Net annual income currency"
                />
              </div>
            </div>
          </div>
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
