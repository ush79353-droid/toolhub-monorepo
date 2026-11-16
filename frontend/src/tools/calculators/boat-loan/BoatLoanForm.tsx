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
  BoatLoanFieldErrors,
  BoatLoanInput,
  BoatLoanResult,
  TermUnit,
} from './types';

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

interface BoatLoanFormProps {
  input: BoatLoanInput;
  errors: BoatLoanFieldErrors;
  result: BoatLoanResult | null;
  onChange: (input: BoatLoanInput) => void;
  onReset: () => void;
}

export function BoatLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: BoatLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const paymentSymbol = getCurrencySymbol(input.monthlyPaymentCurrency);
  const interestSymbol = getCurrencySymbol(input.totalInterestCurrency);

  const set = (patch: Partial<BoatLoanInput>) => {
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

  /** Convert principal; leave result currencies and non-money fields alone. */
  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;

    const amount = parseMoneyInput(input.loanAmount);
    if (!Number.isFinite(amount)) {
      if (
        (input.monthlyPaymentCurrency !== next &&
          !canConvertPair(next, input.monthlyPaymentCurrency)) ||
        (input.totalInterestCurrency !== next &&
          !canConvertPair(next, input.totalInterestCurrency))
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
      (input.monthlyPaymentCurrency !== next &&
        !canConvertPair(next, input.monthlyPaymentCurrency)) ||
      (input.totalInterestCurrency !== next &&
        !canConvertPair(next, input.totalInterestCurrency))
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

  const handleMonthlyPaymentCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.monthlyPaymentCurrency) return;
    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, monthlyPaymentCurrency: next });
  };

  const handleTotalInterestCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalInterestCurrency) return;
    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, totalInterestCurrency: next });
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
          Boat Loan Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="boat-loan-amount">
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="Principal financed for the boat loan. Changing currency converts this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="boat-loan-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => set({ loanAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="boat-loan-currency"
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
          <label className={labelClass} htmlFor="boat-loan-term">
            <span>Loan term</span>
            <InfoTooltip
              label="Loan term"
              text="Length of the loan. Internally converted to monthly payments (years × 12, or months as entered)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanTerm}>
              <input
                id="boat-loan-term"
                className={inputClass}
                inputMode="decimal"
                value={input.loanTerm}
                aria-invalid={Boolean(errors.loanTerm)}
                onChange={(e) => set({ loanTerm: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="boat-loan-term-unit"
                className={selectClass}
                value={input.termUnit}
                aria-label="Loan term unit"
                onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
              >
                <option value="yrs">yrs</option>
                <option value="mos">mos</option>
              </select>
            </div>
          </div>
          {errors.loanTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTerm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="boat-loan-rate">
            <span>Annual interest rate</span>
            <InfoTooltip
              label="Annual interest rate"
              text="Nominal annual rate with monthly repayments. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.annualInterestRatePercent}>
            <input
              id="boat-loan-rate"
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
          <label className={labelClass} htmlFor="boat-loan-payment">
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
                id="boat-loan-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="boat-loan-payment-currency"
                value={input.monthlyPaymentCurrency}
                onChange={handleMonthlyPaymentCurrencyChange}
                aria-label="Monthly payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="boat-loan-interest">
            <span>Total interest paid</span>
            <InfoTooltip
              label="Total interest paid"
              text="(Monthly payment × number of payments) − principal, using full-precision payment before display rounding."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {interestSymbol}
              </span>
              <input
                id="boat-loan-interest"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalInterest : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="boat-loan-interest-currency"
                value={input.totalInterestCurrency}
                onChange={handleTotalInterestCurrencyChange}
                aria-label="Total interest currency"
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
