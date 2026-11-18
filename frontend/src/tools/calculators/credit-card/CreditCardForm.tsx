'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  MINIMUM_METHOD_OPTIONS,
  REPAYMENT_MODE_OPTIONS,
  type CompoundingMethod,
  type CreditCardFieldErrors,
  type CreditCardInput,
  type MinimumPaymentMethod,
  type RepaymentMode,
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

interface CreditCardFormProps {
  input: CreditCardInput;
  errors: CreditCardFieldErrors;
  conversionError: string | null;
  ratesWarning: string | null;
  onChange: (input: CreditCardInput) => void;
  onBalanceCurrencyChange: (next: SupportedCurrency) => void;
  onFixedCurrencyChange: (next: SupportedCurrency) => void;
  onAdditionalCurrencyChange: (next: SupportedCurrency) => void;
  onFloorCurrencyChange: (next: SupportedCurrency) => void;
}

export function CreditCardForm({
  input,
  errors,
  conversionError,
  ratesWarning,
  onChange,
  onBalanceCurrencyChange,
  onFixedCurrencyChange,
  onAdditionalCurrencyChange,
  onFloorCurrencyChange,
}: CreditCardFormProps) {
  const balanceSymbol = getCurrencySymbol(input.balanceCurrency);
  const fixedSymbol = getCurrencySymbol(input.fixedPaymentCurrency);
  const additionalSymbol = getCurrencySymbol(input.additionalPaymentCurrency);
  const floorSymbol = getCurrencySymbol(input.minPaymentFloorCurrency);

  const set = (patch: Partial<CreditCardInput>) => {
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
            <label className={labelClass} htmlFor="cc-balance">
              <span>Current unpaid balance</span>
              <InfoTooltip
                label="Current unpaid balance"
                text="Outstanding revolving balance. Calculation currency for normalizing other money fields."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.balance}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {balanceSymbol}
                </span>
                <input
                  id="cc-balance"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.balance}
                  aria-invalid={Boolean(errors.balance)}
                  onChange={(e) => set({ balance: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="cc-balance-currency"
                  value={input.balanceCurrency}
                  onChange={onBalanceCurrencyChange}
                  aria-label="Balance currency"
                />
              </div>
            </div>
            {errors.balance ? (
              <p className="mt-1 text-xs text-rose-600">{errors.balance}</p>
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
            <label className={labelClass} htmlFor="cc-apr">
              <span>Annual percentage rate (APR)</span>
              <InfoTooltip
                label="APR"
                text="Nominal annual percentage rate. Not FX-converted. Default interest uses APR ÷ 12 per month."
              />
            </label>
            <FieldShell error={errors.aprPercent}>
              <input
                id="cc-apr"
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

          <fieldset>
            <legend className={labelClass}>Repayment by…</legend>
            <div className="flex flex-wrap gap-4">
              {REPAYMENT_MODE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="cc-repayment-mode"
                    className="h-4 w-4 accent-primary"
                    checked={input.repaymentMode === option.value}
                    onChange={() =>
                      set({ repaymentMode: option.value as RepaymentMode })
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          {input.repaymentMode === 'fixed' ? (
            <div>
              <label className={labelClass} htmlFor="cc-fixed">
                <span>Monthly fix payment</span>
                <InfoTooltip
                  label="Monthly fix payment"
                  text="Recurring fixed payment before the optional additional amount. Converted into the balance currency."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.fixedPayment}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {fixedSymbol}
                  </span>
                  <input
                    id="cc-fixed"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.fixedPayment}
                    aria-invalid={Boolean(errors.fixedPayment)}
                    onChange={(e) => set({ fixedPayment: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="cc-fixed-currency"
                    value={input.fixedPaymentCurrency}
                    onChange={onFixedCurrencyChange}
                    aria-label="Fixed payment currency"
                  />
                </div>
              </div>
              {errors.fixedPayment ? (
                <p className="mt-1 text-xs text-rose-600">{errors.fixedPayment}</p>
              ) : null}
            </div>
          ) : (
            <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              Minimum-payment mode uses the percentage, floor, and method in
              Minimum payment &amp; compounding settings below.
            </p>
          )}

          <div>
            <label className={labelClass} htmlFor="cc-additional">
              <span>Monthly additional payment</span>
              <InfoTooltip
                label="Monthly additional payment"
                text="Extra amount added each month on top of the fixed or minimum payment. Converted into the balance currency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.additionalPayment}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {additionalSymbol}
                </span>
                <input
                  id="cc-additional"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.additionalPayment}
                  aria-invalid={Boolean(errors.additionalPayment)}
                  onChange={(e) => set({ additionalPayment: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="cc-additional-currency"
                  value={input.additionalPaymentCurrency}
                  onChange={onAdditionalCurrencyChange}
                  aria-label="Additional payment currency"
                />
              </div>
            </div>
            {errors.additionalPayment ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.additionalPayment}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.advancedOpen}
        onToggle={(event) => set({ advancedOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.advancedOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Minimum payment &amp; compounding settings</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="cc-min-floor">
              <span>Minimum payment floor</span>
              <InfoTooltip
                label="Minimum payment floor"
                text="Lowest allowed minimum payment when the percentage of balance is smaller. Used only in minimum-payment mode."
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
                  id="cc-min-floor"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.minPaymentFloor}
                  aria-invalid={Boolean(errors.minPaymentFloor)}
                  onChange={(e) => set({ minPaymentFloor: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="cc-floor-currency"
                  value={input.minPaymentFloorCurrency}
                  onChange={onFloorCurrencyChange}
                  aria-label="Minimum payment floor currency"
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
            <label className={labelClass} htmlFor="cc-min-percent">
              <span>Minimum payment percentage</span>
              <InfoTooltip
                label="Minimum payment percentage"
                text="Percent of the outstanding balance used to compute the minimum. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.minPaymentPercent}>
              <input
                id="cc-min-percent"
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

          <div>
            <label className={labelClass} htmlFor="cc-min-method">
              <span>Minimum payment method</span>
            </label>
            <select
              id="cc-min-method"
              className={selectClass}
              value={input.minPaymentMethod}
              onChange={(e) =>
                set({
                  minPaymentMethod: e.target.value as MinimumPaymentMethod,
                })
              }
            >
              {MINIMUM_METHOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="cc-compounding">
              <span>Interest compounding</span>
              <InfoTooltip
                label="Interest compounding"
                text="Monthly uses Balance × APR / 1200. Daily options compound within each month before payment. Not FX-converted."
              />
            </label>
            <select
              id="cc-compounding"
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
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
