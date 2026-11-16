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
  PartiallyAmortizedLoanFieldErrors,
  PartiallyAmortizedLoanInput,
  PartiallyAmortizedLoanResult,
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

type ResultCurrencyKey =
  | 'monthlyPaymentCurrency'
  | 'totalPaidCurrency'
  | 'balloonCurrency'
  | 'totalCurrency';

interface PartiallyAmortizedLoanFormProps {
  input: PartiallyAmortizedLoanInput;
  errors: PartiallyAmortizedLoanFieldErrors;
  result: PartiallyAmortizedLoanResult | null;
  onChange: (input: PartiallyAmortizedLoanInput) => void;
  onReset: () => void;
}

export function PartiallyAmortizedLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: PartiallyAmortizedLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const loanSymbol = getCurrencySymbol(input.loanCurrency);

  const set = (patch: Partial<PartiallyAmortizedLoanInput>) => {
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

  const resultCurrencies = [
    input.monthlyPaymentCurrency,
    input.totalPaidCurrency,
    input.balloonCurrency,
    input.totalCurrency,
  ] as const;

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;

    for (const resultCurrency of resultCurrencies) {
      if (resultCurrency !== next && !canConvertPair(next, resultCurrency)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    }

    const amount = parseMoneyInput(input.fullLoan);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, loanCurrency: next });
      return;
    }

    if (!canConvertPair(input.loanCurrency, next)) {
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
      fullLoan: moneyAmountToInputString(converted.amount),
    });
  };

  const handleResultCurrencyChange =
    (key: ResultCurrencyKey) => (next: SupportedCurrency) => {
      if (next === input[key]) return;
      if (!canConvertPair(input.loanCurrency, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, [key]: next });
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
          Partially Amortized Loan Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="pal-loan">
            <span>Full loan</span>
            <InfoTooltip
              label="Full loan"
              text="Original financed principal. Changing currency converts this amount using stored exchange rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.fullLoan}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="pal-loan"
                className={inputClass}
                inputMode="decimal"
                value={input.fullLoan}
                aria-invalid={Boolean(errors.fullLoan)}
                onChange={(e) => set({ fullLoan: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pal-loan-currency"
                value={input.loanCurrency}
                onChange={handleLoanCurrencyChange}
                aria-label="Full loan currency"
              />
            </div>
          </div>
          {errors.fullLoan ? (
            <p className="mt-1 text-xs text-rose-600">{errors.fullLoan}</p>
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
          <label className={labelClass} htmlFor="pal-rate">
            <span>Annual interest rate</span>
            <InfoTooltip
              label="Annual interest rate"
              text="Nominal annual rate for monthly repayments. Not currency-converted."
            />
          </label>
          <FieldShell error={errors.annualInterestRatePercent}>
            <input
              id="pal-rate"
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

        <div>
          <span className={labelClass}>
            Amortization time
            <InfoTooltip
              label="Amortization time"
              text="Full theoretical amortization length used to size the regular monthly payment (N months)."
            />
          </span>
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.amortYears}>
                <input
                  id="pal-amort-years"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.amortYears}
                  aria-label="Amortization years"
                  aria-invalid={Boolean(errors.amortYears)}
                  onChange={(e) => set({ amortYears: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
            </div>
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.amortMonths}>
                <input
                  id="pal-amort-months"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.amortMonths}
                  aria-label="Amortization months"
                  aria-invalid={Boolean(errors.amortMonths)}
                  onChange={(e) => set({ amortMonths: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  mos
                </span>
              </FieldShell>
            </div>
          </div>
          {errors.amortYears || errors.amortMonths ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.amortYears || errors.amortMonths}
            </p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>
            Payment period
            <InfoTooltip
              label="Payment period"
              text="Actual months of scheduled payments before the remaining principal is due as a balloon (K months). Must not exceed amortization time."
            />
          </span>
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.paymentYears}>
                <input
                  id="pal-pay-years"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.paymentYears}
                  aria-label="Payment period years"
                  aria-invalid={Boolean(errors.paymentYears)}
                  onChange={(e) => set({ paymentYears: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
            </div>
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.paymentMonths}>
                <input
                  id="pal-pay-months"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.paymentMonths}
                  aria-label="Payment period months"
                  aria-invalid={Boolean(errors.paymentMonths)}
                  onChange={(e) => set({ paymentMonths: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  mos
                </span>
              </FieldShell>
            </div>
          </div>
          {errors.paymentYears || errors.paymentMonths ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.paymentYears || errors.paymentMonths}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pal-monthly">
            <span>Monthly payment</span>
            <InfoTooltip
              label="Monthly payment"
              text="Level payment sized over the full amortization time. Changing currency only re-expresses this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.monthlyPaymentCurrency)}
              </span>
              <input
                id="pal-monthly"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pal-monthly-currency"
                value={input.monthlyPaymentCurrency}
                onChange={handleResultCurrencyChange('monthlyPaymentCurrency')}
                aria-label="Monthly payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="pal-total-paid">
            <span>Total paid during payment period</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.totalPaidCurrency)}
              </span>
              <input
                id="pal-total-paid"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalPaid : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pal-total-paid-currency"
                value={input.totalPaidCurrency}
                onChange={handleResultCurrencyChange('totalPaidCurrency')}
                aria-label="Total paid currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="pal-balloon">
            <span>Balloon payment</span>
            <InfoTooltip
              label="Balloon payment"
              text="Outstanding principal immediately after the last regular payment in the payment period."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.balloonCurrency)}
              </span>
              <input
                id="pal-balloon"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedBalloon : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pal-balloon-currency"
                value={input.balloonCurrency}
                onChange={handleResultCurrencyChange('balloonCurrency')}
                aria-label="Balloon payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="pal-total">
            <span>Total</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.totalCurrency)}
              </span>
              <input
                id="pal-total"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotal : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pal-total-currency"
                value={input.totalCurrency}
                onChange={handleResultCurrencyChange('totalCurrency')}
                aria-label="Total currency"
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
