'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  EXAMPLE_CAREER_GROWTH,
  EXAMPLE_INFLATION_CHECK,
  type FutureSalaryFieldErrors,
  type FutureSalaryInput,
  type FutureSalaryResult,
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

interface FutureSalaryFormProps {
  input: FutureSalaryInput;
  errors: FutureSalaryFieldErrors;
  result: FutureSalaryResult | null;
  onChange: (input: FutureSalaryInput) => void;
  onCurrentSalaryCurrencyChange: (next: SupportedCurrency) => void;
  onFutureSalaryCurrencyChange: (next: SupportedCurrency) => void;
  onRealSalaryCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function FutureSalaryForm({
  input,
  errors,
  result,
  onChange,
  onCurrentSalaryCurrencyChange,
  onFutureSalaryCurrencyChange,
  onRealSalaryCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: FutureSalaryFormProps) {
  const currentSymbol = getCurrencySymbol(input.currentSalaryCurrency);
  const futureSymbol = getCurrencySymbol(input.futureSalaryCurrency);
  const realSymbol = getCurrencySymbol(input.realSalaryCurrency);

  const set = (patch: Partial<FutureSalaryInput>) => {
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
        open={input.futureOpen}
        onToggle={(event) => set({ futureOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.futureOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Future salary</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="fs-current-salary">
              <span>Current salary</span>
              <InfoTooltip
                label="Current salary"
                text="Today’s pay before growth. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.currentSalary}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {currentSymbol}
                </span>
                <input
                  id="fs-current-salary"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.currentSalary}
                  aria-invalid={Boolean(errors.currentSalary)}
                  onChange={(e) => set({ currentSalary: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fs-current-salary-currency"
                  value={input.currentSalaryCurrency}
                  onChange={onCurrentSalaryCurrencyChange}
                  aria-label="Current salary currency"
                />
              </div>
            </div>
            {errors.currentSalary ? (
              <p className="mt-1 text-xs text-rose-600">{errors.currentSalary}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fs-growth">
              <span>Average salary change per year</span>
              <InfoTooltip
                label="Average salary change per year"
                text="Compound annual growth rate for pay. Zero leaves salary unchanged. Negative values (above −100%) are allowed. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.salaryGrowthPercent}>
              <input
                id="fs-growth"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.salaryGrowthPercent}
                aria-invalid={Boolean(errors.salaryGrowthPercent)}
                onChange={(e) => set({ salaryGrowthPercent: e.target.value })}
              />
              <span
                className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                %
              </span>
            </FieldShell>
            {errors.salaryGrowthPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.salaryGrowthPercent}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fs-years">
              <span>Number of years</span>
              <InfoTooltip
                label="Number of years"
                text="How many years of compound growth and inflation to apply. Must be zero or greater. Never FX-converted."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.years}>
                <input
                  id="fs-years"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.years}
                  aria-invalid={Boolean(errors.years)}
                  onChange={(e) => set({ years: e.target.value })}
                />
              </FieldShell>
              <div
                className="flex h-11 w-[110px] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground sm:w-[120px]"
                aria-hidden="true"
              >
                yrs
              </div>
            </div>
            {errors.years ? (
              <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fs-future-salary">
              <span>Expected future salary</span>
              <InfoTooltip
                label="Expected future salary"
                text="Nominal future pay after compound growth. Change currency to display in another denomination."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {futureSymbol}
                </span>
                <input
                  id="fs-future-salary"
                  className={`${inputClass} text-accent`}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedFutureSalary ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fs-future-salary-currency"
                  value={input.futureSalaryCurrency}
                  onChange={onFutureSalaryCurrencyChange}
                  aria-label="Expected future salary currency"
                />
              </div>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.realOpen}
        onToggle={(event) => set({ realOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.realOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Real future salary</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="fs-inflation">
              <span>Average inflation</span>
              <InfoTooltip
                label="Average inflation"
                text="Compound annual inflation rate used to express future pay in today’s purchasing power. Zero inflation makes real equal to nominal. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.inflationPercent}>
              <input
                id="fs-inflation"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.inflationPercent}
                aria-invalid={Boolean(errors.inflationPercent)}
                onChange={(e) => set({ inflationPercent: e.target.value })}
              />
              <span
                className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                %
              </span>
            </FieldShell>
            {errors.inflationPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.inflationPercent}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fs-real-salary">
              <span>Real future salary</span>
              <InfoTooltip
                label="Real future salary"
                text="Inflation-adjusted future pay in today’s purchasing power. Change currency to display in another denomination."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {realSymbol}
                </span>
                <input
                  id="fs-real-salary"
                  className={`${inputClass} text-accent`}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedRealSalary ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fs-real-salary-currency"
                  value={input.realSalaryCurrency}
                  onChange={onRealSalaryCurrencyChange}
                  aria-label="Real future salary currency"
                />
              </div>
            </div>
            {result ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Nominal future pay adjusted for inflation (today&apos;s
                purchasing power).
              </p>
            ) : null}
          </div>
        </div>
      </details>

      {(errors.form || conversionError || ratesWarning) && (
        <div className="space-y-2">
          {errors.form ? (
            <p
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
              role="alert"
            >
              {errors.form}
            </p>
          ) : null}
          {conversionError ? (
            <p
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
              role="alert"
            >
              {conversionError}
            </p>
          ) : null}
          {ratesWarning ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
              {ratesWarning}
            </p>
          ) : null}
        </div>
      )}

      <div className="rounded-xl border border-border bg-white px-3.5 py-3 text-xs text-muted-foreground sm:px-4">
        <p className="font-medium text-accent">Check our examples:</p>
        <ul className="mt-1.5 list-disc space-y-1 pl-4">
          <li>
            <button
              type="button"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() =>
                onChange({
                  ...EXAMPLE_CAREER_GROWTH,
                  currentSalaryCurrency: input.currentSalaryCurrency,
                  futureSalaryCurrency: input.futureSalaryCurrency,
                  realSalaryCurrency: input.realSalaryCurrency,
                })
              }
            >
 Example 1: Career growth
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() =>
                onChange({
                  ...EXAMPLE_INFLATION_CHECK,
                  currentSalaryCurrency: input.currentSalaryCurrency,
                  futureSalaryCurrency: input.futureSalaryCurrency,
                  realSalaryCurrency: input.realSalaryCurrency,
                })
              }
            >
 Example 2: Inflation check
            </button>
          </li>
        </ul>
      </div>
    </form>
  );
}
