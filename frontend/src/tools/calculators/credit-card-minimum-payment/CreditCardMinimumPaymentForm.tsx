'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  MINIMUM_METHOD_OPTIONS,
  type CompoundingMethod,
  type CreditCardMinimumPaymentFieldErrors,
  type CreditCardMinimumPaymentInput,
  type MinimumPaymentMethod,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface CreditCardMinimumPaymentFormProps {
  input: CreditCardMinimumPaymentInput;
  errors: CreditCardMinimumPaymentFieldErrors;
  conversionError: string | null;
  ratesWarning: string | null;
  onChange: (input: CreditCardMinimumPaymentInput) => void;
  onBalanceCurrencyChange: (next: SupportedCurrency) => void;
  onFloorCurrencyChange: (next: SupportedCurrency) => void;
  onFixCurrencyChange: (next: SupportedCurrency) => void;
}

export function CreditCardMinimumPaymentForm({
  input,
  errors,
  conversionError,
  ratesWarning,
  onChange,
  onBalanceCurrencyChange,
  onFloorCurrencyChange,
  onFixCurrencyChange,
}: CreditCardMinimumPaymentFormProps) {
  const balanceSymbol = getCurrencySymbol(input.statementBalanceCurrency);
  const floorSymbol = getCurrencySymbol(input.minPaymentFloorCurrency);
  const fixSymbol = getCurrencySymbol(input.monthlyFixPaymentCurrency);

  const set = (patch: Partial<CreditCardMinimumPaymentInput>) => {
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
        open={input.specificationsOpen}
        onToggle={(event) =>
          set({ specificationsOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.specificationsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Specifications</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="ccmp-balance">
              <span>Statement balance</span>
              <InfoTooltip
                label="Statement balance"
                text="Outstanding statement balance. Calculation currency for normalizing other money fields."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.statementBalance}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {balanceSymbol}
                </span>
                <input
                  id="ccmp-balance"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.statementBalance}
                  aria-invalid={Boolean(errors.statementBalance)}
                  onChange={(e) => set({ statementBalance: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ccmp-balance-currency"
                  value={input.statementBalanceCurrency}
                  onChange={onBalanceCurrencyChange}
                  aria-label="Statement balance currency"
                />
              </div>
            </div>
            {errors.statementBalance ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.statementBalance}
              </p>
            ) : null}
            {conversionError ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {conversionError}
              </p>
            ) : null}
            {ratesWarning && !conversionError ? (
              <p className="mt-1 text-xs text-amber-700">{ratesWarning}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ccmp-due">
              <span>Due date</span>
              <InfoTooltip
                label="Due date"
                text="First payment due date. The estimated payoff date advances one month per payment from this date."
              />
            </label>
            <FieldShell error={errors.dueDate}>
              <input
                id="ccmp-due"
                type="date"
                className={inputClass}
                value={input.dueDate}
                aria-invalid={Boolean(errors.dueDate)}
                onChange={(e) => set({ dueDate: e.target.value })}
              />
            </FieldShell>
            {errors.dueDate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ccmp-apr">
              <span>APR</span>
              <InfoTooltip
                label="APR"
                text="Nominal annual percentage rate. Not FX-converted. Default capitalization uses Daily (360)."
              />
            </label>
            <FieldShell error={errors.aprPercent}>
              <input
                id="ccmp-apr"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.aprPercent}
                aria-invalid={Boolean(errors.aprPercent)}
                onChange={(e) => set({ aprPercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.aprPercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.aprPercent}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={input.changeCapitalization}
                onChange={(e) =>
                  set({ changeCapitalization: e.target.checked })
                }
              />
              <span>Change capitalization frequency</span>
            </label>
            {input.changeCapitalization ? (
              <div>
                <label className={labelClass} htmlFor="ccmp-compounding">
                  <span>Capitalization frequency</span>
                  <InfoTooltip
                    label="Capitalization frequency"
                    text="How interest accrues each month before payment. Monthly uses APR/12. Daily options compound within the month. Not FX-converted."
                  />
                </label>
                <select
                  id="ccmp-compounding"
                  className={selectClass}
                  value={input.compounding}
                  onChange={(e) =>
                    set({ compounding: e.target.value as CompoundingMethod })
                  }
                >
                  {COMPOUNDING_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.paymentSettingsOpen}
        onToggle={(event) =>
          set({ paymentSettingsOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.paymentSettingsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Payment setting</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="ccmp-min-floor">
              <span>Minimum payment</span>
              <InfoTooltip
                label="Minimum payment"
                text="Currency floor for the minimum when the percentage of balance is smaller. Converted into the statement-balance currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.minPaymentFloor}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {floorSymbol}
                </span>
                <input
                  id="ccmp-min-floor"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.minPaymentFloor}
                  aria-invalid={Boolean(errors.minPaymentFloor)}
                  onChange={(e) => set({ minPaymentFloor: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ccmp-floor-currency"
                  value={input.minPaymentFloorCurrency}
                  onChange={onFloorCurrencyChange}
                  aria-label="Minimum payment currency"
                />
              </div>
            </div>
            {errors.minPaymentFloor ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.minPaymentFloor}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ccmp-min-percent">
              <span>Minimum percentage</span>
              <InfoTooltip
                label="Minimum percentage"
                text="Percent of the outstanding balance used to compute the minimum. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.minPaymentPercent}>
              <input
                id="ccmp-min-percent"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.minPaymentPercent}
                aria-invalid={Boolean(errors.minPaymentPercent)}
                onChange={(e) => set({ minPaymentPercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.minPaymentPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.minPaymentPercent}
              </p>
            ) : null}
          </div>

          <fieldset>
            <legend className={labelClass}>
              <span>Calculation method</span>
              <InfoTooltip
                label="Calculation method"
                text="Flat percentage uses max(floor, balance × %). Percentage + interest adds that month’s interest to the percentage portion before the floor."
              />
            </legend>
            <div className="flex flex-wrap gap-4">
              {MINIMUM_METHOD_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="ccmp-min-method"
                    className="h-4 w-4 accent-primary"
                    checked={input.minPaymentMethod === option.value}
                    onChange={() =>
                      set({
                        minPaymentMethod: option.value as MinimumPaymentMethod,
                      })
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label className={labelClass} htmlFor="ccmp-fix">
              <span>Monthly fix payment</span>
              <InfoTooltip
                label="Monthly fix payment"
                text="Optional fixed amount added each month on top of the calculated minimum. It does not replace the minimum. Converted into the statement-balance currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.monthlyFixPayment}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {fixSymbol}
                </span>
                <input
                  id="ccmp-fix"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.monthlyFixPayment}
                  aria-invalid={Boolean(errors.monthlyFixPayment)}
                  onChange={(e) => set({ monthlyFixPayment: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ccmp-fix-currency"
                  value={input.monthlyFixPaymentCurrency}
                  onChange={onFixCurrencyChange}
                  aria-label="Monthly fix payment currency"
                />
              </div>
            </div>
            {errors.monthlyFixPayment ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.monthlyFixPayment}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
