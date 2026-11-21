'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEPRECIATION_METHODS,
  suggestedDecliningBalanceRatePercent,
  type DepreciationFieldErrors,
  type DepreciationInput,
  type DepreciationMethod,
  type DepreciationResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

const METHOD_OPTIONS: { value: DepreciationMethod; label: string }[] = [
  { value: 'straight-line', label: 'Straight line depreciation' },
  { value: 'declining-balance', label: 'Declining balance depreciation' },
  { value: 'sum-of-years-digits', label: "Sum-of-years' digits depreciation" },
];

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

interface DepreciationFormProps {
  input: DepreciationInput;
  errors: DepreciationFieldErrors;
  result: DepreciationResult | null;
  onChange: (input: DepreciationInput) => void;
  onOriginalCostCurrencyChange: (next: SupportedCurrency) => void;
  onSalvageCurrencyChange: (next: SupportedCurrency) => void;
  onExpenseCurrencyChange: (next: SupportedCurrency) => void;
  onEndBookCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function DepreciationForm({
  input,
  errors,
  result,
  onChange,
  onOriginalCostCurrencyChange,
  onSalvageCurrencyChange,
  onExpenseCurrencyChange,
  onEndBookCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: DepreciationFormProps) {
  const costSymbol = getCurrencySymbol(input.originalCostCurrency);
  const salvageSymbol = getCurrencySymbol(input.salvageValueCurrency);
  const expenseSymbol = getCurrencySymbol(input.expenseCurrency);
  const bookSymbol = getCurrencySymbol(input.endBookCurrency);

  const set = (patch: Partial<DepreciationInput>) => onChange({ ...input, ...patch });

  const handleMethodChange = (method: DepreciationMethod) => {
    if (!DEPRECIATION_METHODS.includes(method)) return;
    const next: DepreciationInput = { ...input, method };
    if (method === 'declining-balance') {
      const life = Number(input.lifetimeYears);
      const suggested = suggestedDecliningBalanceRatePercent(life);
      if (Number.isFinite(suggested) && input.decliningBalanceRatePercent.trim() === '') {
        next.decliningBalanceRatePercent = String(suggested);
      }
    }
    onChange(next);
  };

  const handleLifetimeChange = (lifetimeYears: string) => {
    const next: DepreciationInput = { ...input, lifetimeYears };
    if (input.method === 'declining-balance') {
      const life = Number(lifetimeYears);
      const suggested = suggestedDecliningBalanceRatePercent(life);
      const prevLife = Number(input.lifetimeYears);
      const prevSuggested = suggestedDecliningBalanceRatePercent(prevLife);
      const currentRate = Number(input.decliningBalanceRatePercent);
      const wasAtSuggested =
        Number.isFinite(prevSuggested) &&
        Number.isFinite(currentRate) &&
        Math.abs(currentRate - prevSuggested) < 1e-9;
      if (wasAtSuggested && Number.isFinite(suggested)) {
        next.decliningBalanceRatePercent = String(suggested);
      }
    }
    onChange(next);
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
          <h3 className="text-sm font-semibold text-accent">Asset details</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Choose the depreciation method, enter original cost and salvage value, then set
            lifetime and the year for end book value.
          </p>
        </div>

        <fieldset>
          <legend className={`${labelClass} mb-2`}>Depreciation method</legend>
          <div role="radiogroup" aria-label="Depreciation method" className="space-y-2">
            {METHOD_OPTIONS.map((option) => {
              const active = input.method === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                    active
                      ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
                      : 'border-border bg-white text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <input
                    type="radio"
                    name="depreciation-method"
                    className="accent-[hsl(var(--primary))]"
                    checked={active}
                    value={option.value}
                    onChange={() => handleMethodChange(option.value)}
                  />
                  <span className="font-medium text-accent">{option.label}</span>
                </label>
              );
            })}
          </div>
          {errors.method ? (
            <p className="mt-1 text-xs text-rose-600">{errors.method}</p>
          ) : null}
        </fieldset>

        {input.method === 'declining-balance' ? (
          <div>
            <label className={labelClass} htmlFor="dep-db-rate">
              <span>Declining balance rate</span>
              <InfoTooltip
                label="Declining balance rate"
                text="Annual declining-balance rate as a percent of beginning book value. Default is double-declining (200% ÷ useful life). Edit to use another verified rate."
              />
            </label>
            <FieldShell error={errors.decliningBalanceRatePercent}>
              <input
                id="dep-db-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.decliningBalanceRatePercent}
                aria-invalid={Boolean(errors.decliningBalanceRatePercent)}
                onChange={(e) => set({ decliningBalanceRatePercent: e.target.value })}
              />
              <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.decliningBalanceRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.decliningBalanceRatePercent}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Double-declining default = 200% ÷ lifetime years.
              </p>
            )}
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="dep-original-cost">
            <span>Original cost</span>
            <InfoTooltip
              label="Original cost"
              text="Acquisition cost of the asset. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.originalCost}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {costSymbol}
              </span>
              <input
                id="dep-original-cost"
                className={inputClass}
                inputMode="decimal"
                value={input.originalCost}
                aria-invalid={Boolean(errors.originalCost)}
                onChange={(e) => set({ originalCost: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dep-original-cost-currency"
                value={input.originalCostCurrency}
                onChange={onOriginalCostCurrencyChange}
                aria-label="Original cost currency"
              />
            </div>
          </div>
          {errors.originalCost ? (
            <p className="mt-1 text-xs text-rose-600">{errors.originalCost}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dep-salvage">
            <span>Salvage value</span>
            <InfoTooltip
              label="Salvage value"
              text="Estimated residual value at the end of useful life. Book value is never driven below salvage. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.salvageValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {salvageSymbol}
              </span>
              <input
                id="dep-salvage"
                className={inputClass}
                inputMode="decimal"
                value={input.salvageValue}
                aria-invalid={Boolean(errors.salvageValue)}
                onChange={(e) => set({ salvageValue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dep-salvage-currency"
                value={input.salvageValueCurrency}
                onChange={onSalvageCurrencyChange}
                aria-label="Salvage value currency"
              />
            </div>
          </div>
          {errors.salvageValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.salvageValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dep-lifetime">
            <span>Lifetime</span>
            <InfoTooltip
              label="Lifetime"
              text="Useful life in whole years. Partial years are not supported."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.lifetimeYears}>
              <input
                id="dep-lifetime"
                className={inputClass}
                inputMode="numeric"
                value={input.lifetimeYears}
                aria-invalid={Boolean(errors.lifetimeYears)}
                onChange={(e) => handleLifetimeChange(e.target.value)}
              />
            </FieldShell>
            <div className="flex h-11 w-[90px] shrink-0 items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-muted-foreground">
              yrs
            </div>
          </div>
          {errors.lifetimeYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lifetimeYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dep-end-after">
            <span>End book value after…</span>
            <InfoTooltip
              label="End book value after"
              text="Whole year within useful life. Depreciation expense is the expense for this selected year; end book value is after that many years."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.endBookAfterYears}>
              <input
                id="dep-end-after"
                className={inputClass}
                inputMode="numeric"
                value={input.endBookAfterYears}
                aria-invalid={Boolean(errors.endBookAfterYears)}
                onChange={(e) => set({ endBookAfterYears: e.target.value })}
              />
            </FieldShell>
            <div className="flex h-11 w-[90px] shrink-0 items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-muted-foreground">
              yrs
            </div>
          </div>
          {errors.endBookAfterYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.endBookAfterYears}</p>
          ) : null}
        </div>

        {errors.form ? (
          <p className="text-xs text-rose-600" role="alert">
            {errors.form}
          </p>
        ) : null}
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesWarning ? (
          <p className="text-xs text-amber-700" role="status">
            {ratesWarning}
          </p>
        ) : null}
      </div>

      <div className="space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4">
        <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
          Results
        </div>

        <div>
          <label className={labelClass} htmlFor="dep-expense">
            <span>Depreciation expense</span>
            <InfoTooltip
              label="Depreciation expense"
              text="Expense for the selected year only; not cumulative depreciation."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {expenseSymbol}
              </span>
              <input
                id="dep-expense"
                className={inputClass}
                readOnly
                value={result?.formattedDepreciationExpense ?? ''}
                tabIndex={-1}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dep-expense-currency"
                value={input.expenseCurrency}
                onChange={onExpenseCurrencyChange}
                aria-label="Depreciation expense currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="dep-end-book">
            <span>End book value</span>
            <InfoTooltip
              label="End book value"
              text="Book value after the selected number of years, never below salvage."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {bookSymbol}
              </span>
              <input
                id="dep-end-book"
                className={inputClass}
                readOnly
                value={result?.formattedEndBookValue ?? ''}
                tabIndex={-1}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dep-end-book-currency"
                value={input.endBookCurrency}
                onChange={onEndBookCurrencyChange}
                aria-label="End book value currency"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
