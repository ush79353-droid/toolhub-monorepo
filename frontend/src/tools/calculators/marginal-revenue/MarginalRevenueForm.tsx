'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MarginalRevenueFieldErrors,
  MarginalRevenueInput,
  MarginalRevenueResult,
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

interface MarginalRevenueFormProps {
  input: MarginalRevenueInput;
  errors: MarginalRevenueFieldErrors;
  result: MarginalRevenueResult | null;
  onChange: (input: MarginalRevenueInput) => void;
  onInitialRevenueCurrencyChange: (next: SupportedCurrency) => void;
  onFinalRevenueCurrencyChange: (next: SupportedCurrency) => void;
  onChangeRevenueCurrencyChange: (next: SupportedCurrency) => void;
  onMarginalRevenueCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function MarginalRevenueForm({
  input,
  errors,
  result,
  onChange,
  onInitialRevenueCurrencyChange,
  onFinalRevenueCurrencyChange,
  onChangeRevenueCurrencyChange,
  onMarginalRevenueCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: MarginalRevenueFormProps) {
  const initialSymbol = getCurrencySymbol(input.initialRevenueCurrency);
  const finalSymbol = getCurrencySymbol(input.finalRevenueCurrency);
  const changeSymbol = getCurrencySymbol(input.changeRevenueCurrency);
  const mrSymbol = getCurrencySymbol(input.marginalRevenueCurrency);

  const set = (patch: Partial<MarginalRevenueInput>) => {
    onChange({ ...input, ...patch });
  };

  const mrDisplay = result?.undefinedMarginalRevenue
    ? 'Undefined (ΔQ = 0)'
    : (result?.formattedMarginalRevenue ?? '');

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.revenueOpen}
        onToggle={(event) => set({ revenueOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.revenueOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Change in revenue</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="mr-initial-revenue">
              <span>Initial revenue</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.initialRevenue}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {initialSymbol}
                </span>
                <input
                  id="mr-initial-revenue"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.initialRevenue}
                  aria-invalid={Boolean(errors.initialRevenue)}
                  onChange={(e) => set({ initialRevenue: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="mr-initial-revenue-currency"
                  value={input.initialRevenueCurrency}
                  onChange={onInitialRevenueCurrencyChange}
                  aria-label="Initial revenue currency"
                />
              </div>
            </div>
            {errors.initialRevenue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.initialRevenue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mr-final-revenue">
              <span>Final revenue</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.finalRevenue}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {finalSymbol}
                </span>
                <input
                  id="mr-final-revenue"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.finalRevenue}
                  aria-invalid={Boolean(errors.finalRevenue)}
                  onChange={(e) => set({ finalRevenue: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="mr-final-revenue-currency"
                  value={input.finalRevenueCurrency}
                  onChange={onFinalRevenueCurrencyChange}
                  aria-label="Final revenue currency"
                />
              </div>
            </div>
            {errors.finalRevenue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.finalRevenue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mr-change-revenue">
              <span>Change in total revenue</span>
              <InfoTooltip
                label="Change in total revenue"
                text="Final revenue − initial revenue (ΔTR), after normalizing both amounts into one currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {changeSymbol}
                </span>
                <input
                  id="mr-change-revenue"
                  className={`${inputClass} text-accent`}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedChangeRevenue ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="mr-change-revenue-currency"
                  value={input.changeRevenueCurrency}
                  onChange={onChangeRevenueCurrencyChange}
                  aria-label="Change in total revenue currency"
                />
              </div>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.quantityOpen}
        onToggle={(event) => set({ quantityOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.quantityOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Change in quantity</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="mr-initial-qty">
              <span>Initial quantity</span>
            </label>
            <FieldShell error={errors.initialQuantity}>
              <input
                id="mr-initial-qty"
                className={inputClass}
                inputMode="decimal"
                value={input.initialQuantity}
                aria-invalid={Boolean(errors.initialQuantity)}
                onChange={(e) => set({ initialQuantity: e.target.value })}
              />
            </FieldShell>
            {errors.initialQuantity ? (
              <p className="mt-1 text-xs text-rose-600">{errors.initialQuantity}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mr-final-qty">
              <span>Final quantity</span>
            </label>
            <FieldShell error={errors.finalQuantity}>
              <input
                id="mr-final-qty"
                className={inputClass}
                inputMode="decimal"
                value={input.finalQuantity}
                aria-invalid={Boolean(errors.finalQuantity)}
                onChange={(e) => set({ finalQuantity: e.target.value })}
              />
            </FieldShell>
            {errors.finalQuantity ? (
              <p className="mt-1 text-xs text-rose-600">{errors.finalQuantity}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mr-change-qty">
              <span>Change in quantity</span>
              <InfoTooltip
                label="Change in quantity"
                text="Final quantity − initial quantity (ΔQ). Never currency-converted."
              />
            </label>
            <FieldShell muted>
              <input
                id="mr-change-qty"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedChangeQuantity ?? ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        </div>
      </details>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <label className={labelClass} htmlFor="mr-marginal">
            <span>Marginal revenue</span>
            <InfoTooltip
              label="Marginal revenue"
              text="Discrete approximation ΔTR/ΔQ — revenue per additional unit. Undefined when ΔQ is zero."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              {!result?.undefinedMarginalRevenue ? (
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {mrSymbol}
                </span>
              ) : null}
              <input
                id="mr-marginal"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={mrDisplay}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="mr-marginal-currency"
                  value={input.marginalRevenueCurrency}
                  onChange={onMarginalRevenueCurrencyChange}
                  aria-label="Marginal revenue currency"
                />
            </div>
          </div>
          {result?.undefinedMarginalRevenue ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Quantity did not change (ΔQ = 0), so MR = ΔTR/ΔQ is undefined.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Discrete approximation ΔTR/ΔQ — not a continuous derivative.
            </p>
          )}
        </div>
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
