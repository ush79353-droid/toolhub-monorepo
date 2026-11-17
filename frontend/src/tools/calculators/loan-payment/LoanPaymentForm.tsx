'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
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
import {
  PAYMENT_FREQUENCY_OPTIONS,
  type LoanPaymentFieldErrors,
  type LoanPaymentInput,
  type LoanPaymentResult,
  type PaymentFrequency,
} from './types';

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

interface LoanPaymentFormProps {
  input: LoanPaymentInput;
  errors: LoanPaymentFieldErrors;
  result: LoanPaymentResult | null;
  onChange: (input: LoanPaymentInput) => void;
}

export function LoanPaymentForm({
  input,
  errors,
  result,
  onChange,
}: LoanPaymentFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const paymentSymbol = getCurrencySymbol(input.paymentCurrency);
  const totalSymbol = getCurrencySymbol(input.totalCurrency);

  const set = (patch: Partial<LoanPaymentInput>) => {
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

  /** Convert loan amount; leave result currencies and non-money fields alone. */
  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;

    const amount = parseMoneyInput(input.loanAmount);
    if (!Number.isFinite(amount)) {
      if (
        (input.paymentCurrency !== next && !canConvertPair(next, input.paymentCurrency)) ||
        (input.totalCurrency !== next && !canConvertPair(next, input.totalCurrency))
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, loanCurrency: next });
      return;
    }

    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (
      (input.paymentCurrency !== next && !canConvertPair(next, input.paymentCurrency)) ||
      (input.totalCurrency !== next && !canConvertPair(next, input.totalCurrency))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.loanCurrency,
      to: next,
      rates: rates.rates,
    });

    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      loanCurrency: next,
      loanAmount: moneyAmountToInputString(converted.amount),
    });
  };

  /** Change result display currency only — no change to loan amount/rate/term. */
  const handleResultCurrencyChange = (
    field: 'paymentCurrency' | 'totalCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Loan Payment Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="lp-amount">
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="Principal borrowed. Changing currency converts this amount using live rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="lp-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => set({ loanAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lp-loan-currency"
                value={input.loanCurrency}
                onChange={handleLoanCurrencyChange}
                aria-label="Loan amount currency"
              />
            </div>
          </div>
          {errors.loanAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
          ) : null}
          {conversionError ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {conversionError}
            </p>
          ) : null}
          {ratesStatus.warning && !conversionError ? (
            <p className="mt-1 text-xs text-amber-700">{ratesStatus.warning}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lp-rate">
            <span>Annual rate</span>
            <InfoTooltip
              label="Annual rate"
              text="Nominal annual interest rate as a percent. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.annualRatePercent}>
            <input
              id="lp-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualRatePercent}
              aria-invalid={Boolean(errors.annualRatePercent)}
              onChange={(e) => set({ annualRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.annualRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lp-term-years">
            <span>Loan term</span>
            <InfoTooltip
              label="Loan term"
              text="Duration in years and months (0–11). Installments = (years + months/12) × payments per year. Not FX-converted."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FieldShell error={errors.termYears}>
              <input
                id="lp-term-years"
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
                id="lp-term-months"
                className={selectClass}
                value={input.termMonths}
                aria-invalid={Boolean(errors.termMonths)}
                aria-label="Loan term months"
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
          <label className={labelClass} htmlFor="lp-frequency">
            <span>Payment Frequency</span>
            <InfoTooltip
              label="Payment Frequency"
              text="How often payments are made. Sets payments per year for installments and the periodic rate."
            />
          </label>
          <select
            id="lp-frequency"
            className={selectClass}
            value={input.paymentFrequency}
            aria-invalid={Boolean(errors.paymentFrequency)}
            onChange={(e) =>
              set({ paymentFrequency: e.target.value as PaymentFrequency })
            }
          >
            {PAYMENT_FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.paymentFrequency ? (
            <p className="mt-1 text-xs text-rose-600">{errors.paymentFrequency}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lp-installments">
            <span>Number of installments</span>
            <InfoTooltip
              label="Number of installments"
              text="Rounded (years + months/12) × payments per year."
            />
          </label>
          <FieldShell muted>
            <input
              id="lp-installments"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedNumberOfInstallments : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="lp-periodic-rate">
            <span>Periodic interest rate</span>
            <InfoTooltip
              label="Periodic interest rate"
              text="Nominal annual rate divided by payments per year. Percentages are never currency-converted."
            />
          </label>
          <FieldShell muted>
            <input
              id="lp-periodic-rate"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedPeriodicInterestRate : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="lp-periodic-payment">
            <span>Periodic loan payment</span>
            <InfoTooltip
              label="Periodic loan payment"
              text="Amortizing payment for each installment, converted into the selected result currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {paymentSymbol}
              </span>
              <input
                id="lp-periodic-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedPeriodicPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lp-payment-currency"
                value={input.paymentCurrency}
                onChange={(next) => handleResultCurrencyChange('paymentCurrency', next)}
                aria-label="Periodic loan payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="lp-total">
            <span>Loan payment total</span>
            <InfoTooltip
              label="Loan payment total"
              text="Periodic payment × number of installments, converted into the selected result currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {totalSymbol}
              </span>
              <input
                id="lp-total"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedLoanPaymentTotal : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lp-total-currency"
                value={input.totalCurrency}
                onChange={(next) => handleResultCurrencyChange('totalCurrency', next)}
                aria-label="Loan payment total currency"
              />
            </div>
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
