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
import type {
  StudentLoanFieldErrors,
  StudentLoanInput,
  StudentLoanResult,
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

interface StudentLoanFormProps {
  input: StudentLoanInput;
  errors: StudentLoanFieldErrors;
  result: StudentLoanResult | null;
  onChange: (input: StudentLoanInput) => void;
  onReset: () => void;
}

export function StudentLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: StudentLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const paymentSymbol = getCurrencySymbol(input.monthlyPaymentCurrency);

  const set = (patch: Partial<StudentLoanInput>) => {
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

  /** Convert principal; leave result currency and non-money fields alone. */
  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;

    const amount = parseMoneyInput(input.loanBalance);
    if (!Number.isFinite(amount)) {
      if (
        input.monthlyPaymentCurrency !== next &&
        !canConvertPair(next, input.monthlyPaymentCurrency)
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
      input.monthlyPaymentCurrency !== next &&
      !canConvertPair(next, input.monthlyPaymentCurrency)
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
      loanBalance: moneyAmountToInputString(converted.amount),
    });
  };

  const handleMonthlyPaymentCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.monthlyPaymentCurrency) return;
    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, monthlyPaymentCurrency: next });
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
          Student Loan Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="student-loan-balance">
            <span>Loan balance</span>
            <InfoTooltip
              label="Loan balance"
              text="Outstanding student loan principal. Changing currency converts this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="student-loan-balance"
                className={inputClass}
                inputMode="decimal"
                value={input.loanBalance}
                aria-invalid={Boolean(errors.loanBalance)}
                onChange={(e) => set({ loanBalance: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="student-loan-currency"
                value={input.loanCurrency}
                onChange={handleLoanCurrencyChange}
                aria-label="Loan balance currency"
              />
            </div>
          </div>
          {errors.loanBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanBalance}</p>
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
          <span className={labelClass}>
            <span>Remaining term</span>
            <InfoTooltip
              label="Remaining term"
              text="Years and months left on the loan. Total months = years × 12 + months (0–11). Not FX-converted."
            />
          </span>
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.termYears}>
                <input
                  id="student-loan-term-years"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.termYears}
                  aria-label="Remaining term years"
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
                  id="student-loan-term-months"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.termMonths}
                  aria-label="Remaining term months"
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
          <label className={labelClass} htmlFor="student-loan-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual interest rate with monthly repayments. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.annualInterestRatePercent}>
            <input
              id="student-loan-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualInterestRatePercent}
              aria-invalid={Boolean(errors.annualInterestRatePercent)}
              onChange={(e) => set({ annualInterestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.annualInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="student-loan-payment">
            <span>Monthly payment</span>
            <InfoTooltip
              label="Monthly payment"
              text="Fixed amortizing payment. Changing this currency only re-expresses the payment for display."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {paymentSymbol}
              </span>
              <input
                id="student-loan-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="student-loan-payment-currency"
                value={input.monthlyPaymentCurrency}
                onChange={handleMonthlyPaymentCurrencyChange}
                aria-label="Monthly payment currency"
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
