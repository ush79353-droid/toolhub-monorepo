'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  MINIMUM_METHOD_OPTIONS,
  PAYMENT_MODE_OPTIONS,
  type CompoundingMethod,
  type CreditCardPaymentFieldErrors,
  type CreditCardPaymentInput,
  type MinimumPaymentMethod,
  type PaymentMode,
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

interface CreditCardPaymentFormProps {
  input: CreditCardPaymentInput;
  errors: CreditCardPaymentFieldErrors;
  conversionError: string | null;
  ratesWarning: string | null;
  onChange: (input: CreditCardPaymentInput) => void;
  onBalanceCurrencyChange: (next: SupportedCurrency) => void;
  onFloorCurrencyChange: (next: SupportedCurrency) => void;
}

export function CreditCardPaymentForm({
  input,
  errors,
  conversionError,
  ratesWarning,
  onChange,
  onBalanceCurrencyChange,
  onFloorCurrencyChange,
}: CreditCardPaymentFormProps) {
  const balanceSymbol = getCurrencySymbol(input.balanceCurrency);
  const floorSymbol = getCurrencySymbol(input.minPaymentFloorCurrency);

  const set = (patch: Partial<CreditCardPaymentInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-border bg-muted/15 px-3.5 py-3.5 sm:px-4 sm:py-4">
        <label className={labelClass} htmlFor="ccp-mode">
          <span>Monthly payment with…</span>
          <InfoTooltip
            label="Monthly payment with"
            text="Only the verified specified payback term mode is available. Finds the monthly payment needed to clear the balance within the chosen years and months."
          />
        </label>
        <select
          id="ccp-mode"
          className={selectClass}
          value={input.paymentMode}
          onChange={(e) =>
            set({ paymentMode: e.target.value as PaymentMode })
          }
        >
          {PAYMENT_MODE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

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
            <label className={labelClass} htmlFor="ccp-balance">
              <span>Credit card balance</span>
              <InfoTooltip
                label="Credit card balance"
                text="Outstanding balance to repay. Calculation currency for normalizing the minimum-payment floor."
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
                  id="ccp-balance"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.balance}
                  aria-invalid={Boolean(errors.balance)}
                  onChange={(e) => set({ balance: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ccp-balance-currency"
                  value={input.balanceCurrency}
                  onChange={onBalanceCurrencyChange}
                  aria-label="Credit card balance currency"
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
            <label className={labelClass} htmlFor="ccp-due">
              <span>Due date</span>
              <InfoTooltip
                label="Due date"
                text="Reference due date used to estimate the payoff date for the chosen term."
              />
            </label>
            <FieldShell error={errors.dueDate}>
              <input
                id="ccp-due"
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
            <label className={labelClass} htmlFor="ccp-apr">
              <span>Interest rate APR</span>
              <InfoTooltip
                label="Interest rate APR"
                text="Nominal annual percentage rate. Period rate follows the selected compounding convention. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.aprPercent}>
              <input
                id="ccp-apr"
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

          <div>
            <label className={labelClass} htmlFor="ccp-term-years">
              <span>Payback within</span>
              <InfoTooltip
                label="Payback within"
                text="Target payoff term in years and months (0–11). Number of payments n = years × 12 + months. Not FX-converted."
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <FieldShell error={errors.termYears}>
                <input
                  id="ccp-term-years"
                  className={`${inputClass} pr-10`}
                  inputMode="numeric"
                  value={input.termYears}
                  aria-invalid={Boolean(errors.termYears)}
                  onChange={(e) => set({ termYears: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
              <div className="relative">
                <select
                  id="ccp-term-months"
                  className={selectClass}
                  value={input.termMonths}
                  aria-invalid={Boolean(errors.termMonths)}
                  aria-label="Payback months"
                  onChange={(e) => set({ termMonths: e.target.value })}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={String(i)}>
                      {i} mos
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.termYears ? (
              <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
            ) : errors.termMonths ? (
              <p className="mt-1 text-xs text-rose-600">{errors.termMonths}</p>
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
          <span>Minimum payment &amp; compound settings</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="ccp-min-percent">
              <span>Minimum percentage</span>
              <InfoTooltip
                label="Minimum percentage"
                text="Percent of balance used for the card minimum floor check. Required payment is raised to at least this minimum when needed. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.minPaymentPercent}>
              <input
                id="ccp-min-percent"
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
            <label className={labelClass} htmlFor="ccp-min-floor">
              <span>Minimum payment</span>
              <InfoTooltip
                label="Minimum payment"
                text="Currency floor for the card minimum. Converted into the balance currency before comparing with the required payment."
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
                  id="ccp-min-floor"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.minPaymentFloor}
                  aria-invalid={Boolean(errors.minPaymentFloor)}
                  onChange={(e) => set({ minPaymentFloor: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ccp-floor-currency"
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

          <fieldset>
            <legend className={labelClass}>Minimum percentage type</legend>
            <div className="flex flex-wrap gap-4">
              {MINIMUM_METHOD_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="ccp-min-method"
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
            <label className={labelClass} htmlFor="ccp-compounding">
              <span>Compounding</span>
              <InfoTooltip
                label="Compounding"
                text="Sets the monthly period rate used in the payment formula and schedule. Monthly uses APR/12. Daily options compound within each month. Not FX-converted."
              />
            </label>
            <select
              id="ccp-compounding"
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
