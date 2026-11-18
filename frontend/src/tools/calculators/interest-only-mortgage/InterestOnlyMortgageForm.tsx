'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
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
import {
  PAYMENT_FREQUENCY_OPTIONS,
  type InterestOnlyMortgageFieldErrors,
  type InterestOnlyMortgageInput,
  type InterestOnlyMortgageResult,
  type PaymentFrequency,
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

interface InterestOnlyMortgageFormProps {
  input: InterestOnlyMortgageInput;
  errors: InterestOnlyMortgageFieldErrors;
  result: InterestOnlyMortgageResult | null;
  onChange: (input: InterestOnlyMortgageInput) => void;
  onReset: () => void;
}

export function InterestOnlyMortgageForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: InterestOnlyMortgageFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [periodOpen, setPeriodOpen] = React.useState(false);
  const loanSymbol = getCurrencySymbol(input.currency);
  const resultSymbol = getCurrencySymbol(input.resultCurrency);
  const totalSymbol = getCurrencySymbol(input.totalCurrency);
  const paymentLabel = result?.paymentLabel ?? 'Monthly payment';

  const set = (patch: Partial<InterestOnlyMortgageInput>) => {
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
    if (next === input.currency) return;

    const amount = parseMoneyInput(input.loanAmount);
    if (!Number.isFinite(amount)) {
      if (input.resultCurrency !== next && !canConvertPair(next, input.resultCurrency)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      if (input.totalCurrency !== next && !canConvertPair(next, input.totalCurrency)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, currency: next });
      return;
    }

    if (!canConvertPair(input.currency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (input.resultCurrency !== next && !canConvertPair(next, input.resultCurrency)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (input.totalCurrency !== next && !canConvertPair(next, input.totalCurrency)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.currency,
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
      currency: next,
      loanAmount: moneyAmountToInputString(converted.amount),
    });
  };

  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.resultCurrency) return;
    if (!canConvertPair(input.currency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, resultCurrency: next });
  };

  const handleTotalCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalCurrency) return;
    if (!canConvertPair(input.currency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, totalCurrency: next });
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
          Interest-only mortgage
        </legend>

        <div>
          <label className={labelClass} htmlFor="iom-loan">
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="Outstanding principal. Interest-only payments do not reduce this balance."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="iom-loan"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => set({ loanAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="iom-loan-currency"
                value={input.currency}
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
          <label className={labelClass} htmlFor="iom-rate">
            <span>Annual interest rate</span>
            <InfoTooltip
              label="Annual interest rate"
              text="Nominal annual interest rate as a percent."
            />
          </label>
          <FieldShell error={errors.annualInterestRatePercent}>
            <input
              id="iom-rate"
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
          <div className={labelClass}>
            <span>Payment frequency</span>
            <InfoTooltip
              label="Payment frequency"
              text="How often interest-only payments are due. The periodic rate is the annual rate divided by 365, 12, 4, or 1."
            />
          </div>
          <div className="space-y-2" role="radiogroup" aria-label="Payment frequency">
            {PAYMENT_FREQUENCY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="iom-frequency"
                  className="h-4 w-4 accent-primary"
                  checked={input.paymentFrequency === option.value}
                  onChange={() =>
                    set({ paymentFrequency: option.value as PaymentFrequency })
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="iom-payment">
            <span>{paymentLabel}</span>
            <InfoTooltip
              label={paymentLabel}
              text="Interest-only payment for the selected frequency. Principal is not repaid in this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {resultSymbol}
              </span>
              <input
                id="iom-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedPeriodicPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="iom-payment-currency"
                value={input.resultCurrency}
                onChange={handleResultCurrencyChange}
                aria-label={`${paymentLabel} currency`}
              />
            </div>
          </div>
        </div>
      </fieldset>

      <div className="rounded-xl border border-border bg-muted/10">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={periodOpen}
          onClick={() => setPeriodOpen((open) => !open)}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${periodOpen ? 'rotate-180' : ''}`}
          />
          Interest-only period
        </button>
        {periodOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5">
            <div>
              <label className={labelClass} htmlFor="iom-years">
                <span>Interest-only period</span>
                <InfoTooltip
                  label="Interest-only period"
                  text="Length of the interest-only phase in years and months. Used only for the total interest estimate."
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <FieldShell error={errors.periodYears}>
                    <input
                      id="iom-years"
                      className={`${inputClass} pr-12`}
                      inputMode="decimal"
                      value={input.periodYears}
                      aria-invalid={Boolean(errors.periodYears)}
                      aria-label="Interest-only period years"
                      onChange={(e) => set({ periodYears: e.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      yrs
                    </span>
                  </FieldShell>
                </div>
                <div className="relative">
                  <FieldShell error={errors.periodMonths}>
                    <input
                      id="iom-months"
                      className={`${inputClass} pr-12`}
                      inputMode="decimal"
                      value={input.periodMonths}
                      aria-invalid={Boolean(errors.periodMonths)}
                      aria-label="Interest-only period months"
                      onChange={(e) => set({ periodMonths: e.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      mos
                    </span>
                  </FieldShell>
                </div>
              </div>
              {errors.periodYears ? (
                <p className="mt-1 text-xs text-rose-600">{errors.periodYears}</p>
              ) : null}
              {errors.periodMonths ? (
                <p className="mt-1 text-xs text-rose-600">{errors.periodMonths}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="iom-total">
                <span>Total amount paid in interest-only period</span>
                <InfoTooltip
                  label="Total amount paid in interest-only period"
                  text="Loan × annual rate × years. The principal remaining after this period equals the original loan amount."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {totalSymbol}
                  </span>
                  <input
                    id="iom-total"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result?.formattedTotalInterest ?? ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="iom-total-currency"
                    value={input.totalCurrency}
                    onChange={handleTotalCurrencyChange}
                    aria-label="Total interest currency"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

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
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
