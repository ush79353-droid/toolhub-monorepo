'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
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
import type {
  CompoundingFrequency,
  LoanRepaymentFieldErrors,
  LoanRepaymentInput,
  LoanRepaymentResult,
  PaymentType,
} from './types';
import { COMPOUNDING_FREQUENCY_OPTIONS, PAYMENT_TYPE_OPTIONS } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface LoanRepaymentFormProps {
  input: LoanRepaymentInput;
  errors: LoanRepaymentFieldErrors;
  result: LoanRepaymentResult | null;
  onChange: (input: LoanRepaymentInput) => void;
}

export function LoanRepaymentForm({
  input,
  errors,
  result,
  onChange,
}: LoanRepaymentFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [specsOpen, setSpecsOpen] = React.useState(true);
  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const extraSymbol = getCurrencySymbol(input.extraPaymentCurrency);
  const resultSymbol = getCurrencySymbol(result?.currency ?? input.loanCurrency);

  const set = (patch: Partial<LoanRepaymentInput>) => {
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

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;
    const amount = parseMoneyInput(input.loanAmount);
    if (!Number.isFinite(amount)) {
      if (
        input.extraPaymentCurrency !== next &&
        !canConvertPair(next, input.extraPaymentCurrency)
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
      input.extraPaymentCurrency !== next &&
      !canConvertPair(next, input.extraPaymentCurrency)
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

  const handleExtraCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.extraPaymentCurrency) return;
    const amount = parseMoneyInput(input.extraMonthlyPayment);
    if (!Number.isFinite(amount)) {
      if (input.loanCurrency !== next && !canConvertPair(input.loanCurrency, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, extraPaymentCurrency: next });
      return;
    }
    if (!canConvertPair(input.extraPaymentCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (input.loanCurrency !== next && !canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.extraPaymentCurrency,
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
      extraPaymentCurrency: next,
      extraMonthlyPayment: moneyAmountToInputString(converted.amount),
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          onClick={() => setSpecsOpen((open) => !open)}
          aria-expanded={specsOpen}
        >
          <span className="text-[13px] font-semibold text-accent">Loan specifications</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              specsOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>

        {specsOpen ? (
          <div className="mt-3.5 space-y-3.5">
            <div>
              <span className={labelClass}>Payment type</span>
              <div className="space-y-2" role="radiogroup" aria-label="Payment type">
                {PAYMENT_TYPE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 text-[13px] text-accent"
                  >
                    <input
                      type="radio"
                      name="loan-repayment-payment-type"
                      className="size-4 border-border accent-primary"
                      checked={input.paymentType === opt.value}
                      onChange={() => set({ paymentType: opt.value as PaymentType })}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="lr-amount">
                <span>Loan amount</span>
                <InfoTooltip
                  label="Loan amount"
                  text="Principal borrowed. Changing currency converts this amount with stored FX rates."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.loanAmount}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {loanSymbol}
                  </span>
                  <input
                    id="lr-amount"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.loanAmount}
                    aria-invalid={Boolean(errors.loanAmount)}
                    onChange={(e) => set({ loanAmount: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="lr-loan-currency"
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
              <span className={labelClass}>Loan term</span>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1">
                  <FieldShell error={errors.termYears}>
                    <input
                      id="lr-years"
                      className={`${inputClass} pr-12`}
                      inputMode="numeric"
                      value={input.termYears}
                      aria-label="Loan term years"
                      aria-invalid={Boolean(errors.termYears)}
                      onChange={(e) => set({ termYears: e.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      yrs
                    </span>
                  </FieldShell>
                </div>
                <div className="min-w-0 flex-1">
                  <FieldShell error={errors.termMonths}>
                    <input
                      id="lr-months"
                      className={`${inputClass} pr-12`}
                      inputMode="numeric"
                      value={input.termMonths}
                      aria-label="Loan term months"
                      aria-invalid={Boolean(errors.termMonths)}
                      onChange={(e) => set({ termMonths: e.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      mos
                    </span>
                  </FieldShell>
                </div>
              </div>
              {errors.termYears || errors.termMonths ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.termYears || errors.termMonths}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="lr-rate">
                <span>Interest rate</span>
                <InfoTooltip
                  label="Interest rate"
                  text="Nominal annual rate. Effective monthly rate depends on compound frequency. Never converted with FX."
                />
              </label>
              <FieldShell error={errors.interestRatePercent}>
                <input
                  id="lr-rate"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.interestRatePercent}
                  aria-invalid={Boolean(errors.interestRatePercent)}
                  onChange={(e) => set({ interestRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.interestRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="lr-compound">
                <span>Compound frequency</span>
              </label>
              <select
                id="lr-compound"
                className={selectClass}
                value={input.compoundingFrequency}
                onChange={(e) =>
                  set({
                    compoundingFrequency: e.target.value as CompoundingFrequency,
                  })
                }
              >
                {COMPOUNDING_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="lr-extra">
                <span>Extra monthly payment</span>
                <InfoTooltip
                  label="Extra monthly payment"
                  text="Additional principal each month. Converted into the loan currency before amortization when currencies differ."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.extraMonthlyPayment}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {extraSymbol}
                  </span>
                  <input
                    id="lr-extra"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.extraMonthlyPayment}
                    aria-invalid={Boolean(errors.extraMonthlyPayment)}
                    onChange={(e) => set({ extraMonthlyPayment: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="lr-extra-currency"
                    value={input.extraPaymentCurrency}
                    onChange={handleExtraCurrencyChange}
                    aria-label="Extra monthly payment currency"
                  />
                </div>
              </div>
              {errors.extraMonthlyPayment ? (
                <p className="mt-1 text-xs text-rose-600">{errors.extraMonthlyPayment}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-[13px] font-semibold text-accent">Results</h3>
        {result ? (
          <div className="space-y-2 text-sm leading-relaxed text-accent">
            <p>
              Your <strong>monthly repayment</strong> is{' '}
              <strong>
                {resultSymbol}
                {result.formattedMonthlyRepayment}
              </strong>
              .
            </p>
            <p>
              Thus, your <strong>total repayment amount</strong> is{' '}
              <strong>
                {resultSymbol}
                {result.formattedTotalRepayment}
              </strong>
              , with an <strong>interest payment</strong> of{' '}
              <strong>
                {resultSymbol}
                {result.formattedTotalInterest}
              </strong>
              .
            </p>
            {result.hasExtraPayments ? (
              <p>
                With extra payments you pay off in{' '}
                <strong>{result.actualPayments} months</strong>
                {result.timeSavedLabel ? (
                  <>
                    {' '}
                    (<strong>{result.timeSavedLabel}</strong> sooner)
                  </>
                ) : null}
                , saving{' '}
                <strong>
                  {resultSymbol}
                  {result.formattedInterestSavings}
                </strong>{' '}
                in interest versus the baseline schedule.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter loan details to see repayment results.
          </p>
        )}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </div>
    </form>
  );
}
