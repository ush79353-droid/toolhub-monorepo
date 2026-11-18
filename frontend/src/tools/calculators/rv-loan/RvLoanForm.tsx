'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { RvLoanFieldErrors, RvLoanInput, RvLoanResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface RvLoanFormProps {
  input: RvLoanInput;
  errors: RvLoanFieldErrors;
  result: RvLoanResult | null;
  onChange: (input: RvLoanInput) => void;
  onReset: () => void;
}

export function RvLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: RvLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const set = (patch: Partial<RvLoanInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const convertAmount = (
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): number | null => {
    if (from === to) return amount;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    return converted.ok ? converted.amount : null;
  };

  const handleRvPriceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.rvPriceCurrency) return;
    const amount = parseMoneyInput(input.rvPrice);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, rvPriceCurrency: next });
      return;
    }
    const converted = convertAmount(amount, input.rvPriceCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      rvPriceCurrency: next,
      rvPrice: moneyAmountToInputString(converted),
    });
  };

  const handleDownCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.downPaymentCurrency) return;
    const amount = parseMoneyInput(input.downPayment);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, downPaymentCurrency: next });
      return;
    }
    const converted = convertAmount(amount, input.downPaymentCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      downPaymentCurrency: next,
      downPayment: moneyAmountToInputString(converted),
    });
  };

  const handleDisplayCurrencyChange = (
    field:
      | 'loanAmountCurrency'
      | 'paymentCurrency'
      | 'totalPaidCurrency'
      | 'costOfLoanCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.rvPriceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
  };

  const priceSymbol = getCurrencySymbol(input.rvPriceCurrency);
  const downSymbol = getCurrencySymbol(input.downPaymentCurrency);
  const loanSymbol = getCurrencySymbol(input.loanAmountCurrency);
  const paymentSymbol = getCurrencySymbol(input.paymentCurrency);
  const totalSymbol = getCurrencySymbol(input.totalPaidCurrency);
  const costSymbol = getCurrencySymbol(input.costOfLoanCurrency);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">RV loan setup</legend>

        <div>
          <label className={labelClass} htmlFor="rv-price">
            <span>RV price</span>
            <InfoTooltip
              label="RV price"
              text="Purchase price of the recreational vehicle. Changing currency converts this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.rvPrice}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {priceSymbol}
              </span>
              <input
                id="rv-price"
                className={inputClass}
                inputMode="decimal"
                value={input.rvPrice}
                aria-invalid={Boolean(errors.rvPrice)}
                onChange={(e) => set({ rvPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rv-price-currency"
                value={input.rvPriceCurrency}
                onChange={handleRvPriceCurrencyChange}
                aria-label="RV price currency"
              />
            </div>
          </div>
          {errors.rvPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rvPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rv-down">
            <span>Down payment</span>
            <InfoTooltip
              label="Down payment"
              text="Upfront payment. Zero allowed. Normalized into RV price currency before financing. Changing currency converts this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.downPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {downSymbol}
              </span>
              <input
                id="rv-down"
                className={inputClass}
                inputMode="decimal"
                value={input.downPayment}
                aria-invalid={Boolean(errors.downPayment)}
                onChange={(e) => set({ downPayment: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rv-down-currency"
                value={input.downPaymentCurrency}
                onChange={handleDownCurrencyChange}
                aria-label="Down payment currency"
              />
            </div>
          </div>
          {errors.downPayment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.downPayment}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rv-term-years">
            <span>Term</span>
            <InfoTooltip
              label="Term"
              text="Loan duration in years and months (0–11). Total months = years × 12 + months. Not FX-converted."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FieldShell error={errors.termYears}>
              <input
                id="rv-term-years"
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
                id="rv-term-months"
                className={selectClass}
                value={input.termMonths}
                aria-invalid={Boolean(errors.termMonths)}
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

        <div>
          <label className={labelClass} htmlFor="rv-interest">
            <span>Interest</span>
            <InfoTooltip
              label="Interest"
              text="Nominal annual interest rate for monthly payments. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.annualInterestRatePercent}>
            <input
              id="rv-interest"
              className={`${inputClass} pr-14`}
              inputMode="decimal"
              value={input.annualInterestRatePercent}
              aria-invalid={Boolean(errors.annualInterestRatePercent)}
              onChange={(e) => set({ annualInterestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %/yr
            </span>
          </FieldShell>
          {errors.annualInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRatePercent}</p>
          ) : null}
        </div>

        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">RV loan payments</legend>

        <div>
          <label className={labelClass} htmlFor="rv-loan-amount">
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="RV price − down payment after normalizing currencies. Result currency only re-expresses this value."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="rv-loan-amount"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedLoanAmount : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rv-loan-amount-currency"
                value={input.loanAmountCurrency}
                onChange={(c) => handleDisplayCurrencyChange('loanAmountCurrency', c)}
                aria-label="Loan amount currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="rv-payment">
            <span>Payment</span>
            <InfoTooltip
              label="Payment"
              text="Fixed monthly installment on the financed principal. Displayed as / mon. Result currency only re-expresses this payment."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {paymentSymbol}
              </span>
              <input
                id="rv-payment"
                className={`${inputClass} pr-14 font-semibold`}
                readOnly
                value={result ? result.formattedPayment : ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                / mon
              </span>
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rv-payment-currency"
                value={input.paymentCurrency}
                onChange={(c) => handleDisplayCurrencyChange('paymentCurrency', c)}
                aria-label="Payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="rv-total-paid">
            <span>Total paid</span>
            <InfoTooltip
              label="Total paid"
              text="Monthly payment × number of payments (excludes down payment). Result currency only re-expresses this total."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {totalSymbol}
              </span>
              <input
                id="rv-total-paid"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalPaid : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rv-total-paid-currency"
                value={input.totalPaidCurrency}
                onChange={(c) => handleDisplayCurrencyChange('totalPaidCurrency', c)}
                aria-label="Total paid currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="rv-cost">
            <span>Cost of loan</span>
            <InfoTooltip
              label="Cost of loan"
              text="Total paid − loan amount (financing interest). Result currency only re-expresses this cost."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {costSymbol}
              </span>
              <input
                id="rv-cost"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedCostOfLoan : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rv-cost-currency"
                value={input.costOfLoanCurrency}
                onChange={(c) => handleDisplayCurrencyChange('costOfLoanCurrency', c)}
                aria-label="Cost of loan currency"
              />
            </div>
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
