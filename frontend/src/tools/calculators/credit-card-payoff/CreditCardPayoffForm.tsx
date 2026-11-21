'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CreditCardPayoffFieldErrors,
  CreditCardPayoffInput,
  CreditCardPayoffResult,
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

interface CreditCardPayoffFormProps {
  input: CreditCardPayoffInput;
  errors: CreditCardPayoffFieldErrors;
  result: CreditCardPayoffResult | null;
  conversionError: string | null;
  ratesWarning: string | null;
  onChange: (input: CreditCardPayoffInput) => void;
  onBalanceCurrencyChange: (next: SupportedCurrency) => void;
  onMonthlyPaymentCurrencyChange: (next: SupportedCurrency) => void;
  onTotalPaidCurrencyChange: (next: SupportedCurrency) => void;
}

export function CreditCardPayoffForm({
  input,
  errors,
  result,
  conversionError,
  ratesWarning,
  onChange,
  onBalanceCurrencyChange,
  onMonthlyPaymentCurrencyChange,
  onTotalPaidCurrencyChange,
}: CreditCardPayoffFormProps) {
  const balanceSymbol = getCurrencySymbol(input.balanceCurrency);
  const paymentSymbol = getCurrencySymbol(input.monthlyPaymentCurrency);
  const totalPaidSymbol = getCurrencySymbol(input.totalPaidCurrency);

  const set = (patch: Partial<CreditCardPayoffInput>) => {
    onChange({ ...input, ...patch });
  };

  const neverPaysOff = Boolean(result?.neverPaysOff);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="ccpo-balance">
          <span>Credit card balance</span>
          <InfoTooltip
            label="Credit card balance"
            text="Outstanding balance to repay. Calculation currency for normalizing the monthly payment before payoff math."
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
              id="ccpo-balance"
              className={inputClass}
              inputMode="decimal"
              value={input.balance}
              aria-invalid={Boolean(errors.balance)}
              onChange={(e) => set({ balance: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ccpo-balance-currency"
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
        <label className={labelClass} htmlFor="ccpo-apr">
          <span>Interest rate (APR)</span>
          <InfoTooltip
            label="Interest rate (APR)"
            text="Nominal annual percentage rate. Monthly rate = APR / 100 / 12. Not FX-converted."
          />
        </label>
        <FieldShell error={errors.aprPercent}>
          <input
            id="ccpo-apr"
            className={`${inputClass} pr-12`}
            inputMode="decimal"
            value={input.aprPercent}
            aria-invalid={Boolean(errors.aprPercent)}
            onChange={(e) => set({ aprPercent: e.target.value })}
          />
          <span
            className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            %/yr
          </span>
        </FieldShell>
        {errors.aprPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.aprPercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ccpo-payment">
          <span>Monthly payment</span>
          <InfoTooltip
            label="Monthly payment"
            text="Fixed amount paid each month. Converted into the balance currency before calculating."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.monthlyPayment}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {paymentSymbol}
            </span>
            <input
              id="ccpo-payment"
              className={inputClass}
              inputMode="decimal"
              value={input.monthlyPayment}
              aria-invalid={Boolean(errors.monthlyPayment)}
              onChange={(e) => set({ monthlyPayment: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ccpo-payment-currency"
              value={input.monthlyPaymentCurrency}
              onChange={onMonthlyPaymentCurrencyChange}
              aria-label="Monthly payment currency"
            />
          </div>
        </div>
        {errors.monthlyPayment ? (
          <p className="mt-1 text-xs text-rose-600">{errors.monthlyPayment}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ccpo-years">
          <span>Paid off after</span>
          <InfoTooltip
            label="Paid off after"
            text="Estimated payoff duration as whole years, remaining months, and prorated days from the final partial month. Not FX-converted."
          />
        </label>
        <div className="grid grid-cols-3 gap-2">
          <FieldShell muted>
            <input
              id="ccpo-years"
              className={`${inputClass} pr-10`}
              readOnly
              tabIndex={-1}
              value={neverPaysOff ? '—' : (result?.formattedYears ?? '')}
              aria-live="polite"
              aria-label="Years until paid off"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          <FieldShell muted>
            <input
              id="ccpo-months"
              className={`${inputClass} pr-10`}
              readOnly
              tabIndex={-1}
              value={neverPaysOff ? '—' : (result?.formattedMonths ?? '')}
              aria-live="polite"
              aria-label="Months until paid off"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              mos
            </span>
          </FieldShell>
          <FieldShell muted>
            <input
              id="ccpo-days"
              className={`${inputClass} pr-12`}
              readOnly
              tabIndex={-1}
              value={neverPaysOff ? '—' : (result?.formattedDays ?? '')}
              aria-live="polite"
              aria-label="Days until paid off"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              days
            </span>
          </FieldShell>
        </div>
        {neverPaysOff && result ? (
          <p className="mt-1 text-xs text-amber-800" role="status">
            {result.summary}
          </p>
        ) : null}
        {errors.form && !neverPaysOff ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.form}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ccpo-total-paid">
          <span>Total paid</span>
          <InfoTooltip
            label="Total paid"
            text="Sum of all payments including interest. Display currency can differ from the balance currency."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {totalPaidSymbol}
            </span>
            <input
              id="ccpo-total-paid"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={
                neverPaysOff ? '' : (result?.formattedTotalPaid ?? '')
              }
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ccpo-total-paid-currency"
              value={input.totalPaidCurrency}
              onChange={onTotalPaidCurrencyChange}
              aria-label="Total paid currency"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
