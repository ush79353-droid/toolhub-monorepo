'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MonthlyIncomeHourlyFieldErrors,
  MonthlyIncomeHourlyInput,
  MonthlyIncomeHourlyResult,
  MonthlyIncomeHourlySourceField,
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

interface MonthlyIncomeHourlyFormProps {
  input: MonthlyIncomeHourlyInput;
  errors: MonthlyIncomeHourlyFieldErrors;
  result: MonthlyIncomeHourlyResult | null;
  onChange: (input: MonthlyIncomeHourlyInput) => void;
  onIncomeCurrencyChange: (
    field: MonthlyIncomeHourlySourceField,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

function displayIncome(
  field: MonthlyIncomeHourlySourceField,
  input: MonthlyIncomeHourlyInput,
  result: MonthlyIncomeHourlyResult | null
): string {
  if (input.sourceField === field) return input[field];
  if (!result) return input[field];
  return field === 'monthly' ? result.formattedMonthly : result.formattedHourly;
}

export function MonthlyIncomeHourlyForm({
  input,
  errors,
  result,
  onChange,
  onIncomeCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: MonthlyIncomeHourlyFormProps) {
  const set = (patch: Partial<MonthlyIncomeHourlyInput>) => {
    onChange({ ...input, ...patch });
  };

  const monthlySymbol = getCurrencySymbol(input.monthlyCurrency);
  const hourlySymbol = getCurrencySymbol(input.hourlyCurrency);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <p className="text-[13px] font-semibold text-accent">Your income</p>

        <div>
          <label className={labelClass} htmlFor="mih-monthly">
            <span>Monthly income</span>
            <InfoTooltip
              label="Monthly income"
              text="Gross monthly pay. Editing makes this field authoritative. Hourly = (Monthly × 12) ÷ (Hours × 52)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.monthly}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {monthlySymbol}
              </span>
              <input
                id="mih-monthly"
                className={inputClass}
                inputMode="decimal"
                value={displayIncome('monthly', input, result)}
                aria-invalid={Boolean(errors.monthly)}
                onChange={(e) =>
                  set({ sourceField: 'monthly', monthly: e.target.value })
                }
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mih-monthly-currency"
                value={input.monthlyCurrency}
                onChange={(next) => onIncomeCurrencyChange('monthly', next)}
                aria-label="Monthly income currency"
              />
            </div>
          </div>
          {errors.monthly ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthly}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mih-hours">
            <span>Hours per week</span>
            <InfoTooltip
              label="Hours per week"
              text="Used with 52 paid weeks for annual hours. Never FX-converted. Must be positive."
            />
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="mih-hours"
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
 Uses 52 weeks/year and 12 months; not four weeks per month.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="mih-hourly">
            <span>Hourly income</span>
            <InfoTooltip
              label="Hourly income"
              text="Equivalent hourly rate. Editing makes this field authoritative and reverse-fills monthly."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.hourly}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {hourlySymbol}
              </span>
              <input
                id="mih-hourly"
                className={inputClass}
                inputMode="decimal"
                value={displayIncome('hourly', input, result)}
                aria-invalid={Boolean(errors.hourly)}
                onChange={(e) =>
                  set({ sourceField: 'hourly', hourly: e.target.value })
                }
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mih-hourly-currency"
                value={input.hourlyCurrency}
                onChange={(next) => onIncomeCurrencyChange('hourly', next)}
                aria-label="Hourly income currency"
              />
            </div>
          </div>
          {errors.hourly ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hourly}</p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() =>
            set({ otherMeasuresOpen: !input.otherMeasuresOpen })
          }
          aria-expanded={input.otherMeasuresOpen}
        >
          <span className="text-[13px] font-semibold text-accent">
            Other income measures
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.otherMeasuresOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.otherMeasuresOpen ? (
          <p className="pt-2 text-xs text-muted-foreground">
            No additional measures are shown in the reference screenshot.
            Monthly ↔ hourly conversion above is the full authorized scope.
          </p>
        ) : null}
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
