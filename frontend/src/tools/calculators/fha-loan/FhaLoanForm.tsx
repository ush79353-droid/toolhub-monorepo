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
import { FHA_UPFRONT_MIP_RATE } from './types';
import type {
  FhaLoanFieldErrors,
  FhaLoanInput,
  FhaLoanResult,
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

interface FhaLoanFormProps {
  input: FhaLoanInput;
  errors: FhaLoanFieldErrors;
  result: FhaLoanResult | null;
  onChange: (input: FhaLoanInput) => void;
  onReset: () => void;
}

type ResultCurrencyKey =
  | 'totalDownPaymentCurrency'
  | 'baseLoanAmountCurrency'
  | 'upfrontMipCurrency'
  | 'monthlyMortgagePaymentCurrency'
  | 'monthlyMipCurrency'
  | 'totalFhaLoanAmountCurrency'
  | 'totalMonthlyPaymentCurrency'
  | 'totalCostOfLoanCurrency';

export function FhaLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: FhaLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const homeSymbol = getCurrencySymbol(input.homePriceCurrency);

  const set = (patch: Partial<FhaLoanInput>) => {
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

  const resultCurrencyKeys: ResultCurrencyKey[] = [
    'totalDownPaymentCurrency',
    'baseLoanAmountCurrency',
    'upfrontMipCurrency',
    'monthlyMortgagePaymentCurrency',
    'monthlyMipCurrency',
    'totalFhaLoanAmountCurrency',
    'totalMonthlyPaymentCurrency',
    'totalCostOfLoanCurrency',
  ];

  const handleHomeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.homePriceCurrency) return;

    const amount = parseMoneyInput(input.homePrice);
    for (const key of resultCurrencyKeys) {
      const display = input[key];
      if (display !== next && !canConvertPair(next, display)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    }

    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, homePriceCurrency: next });
      return;
    }

    if (!canConvertPair(input.homePriceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.homePriceCurrency,
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
      homePriceCurrency: next,
      homePrice: moneyAmountToInputString(converted.amount),
    });
  };

  const handleResultCurrencyChange = (key: ResultCurrencyKey, next: SupportedCurrency) => {
    if (next === input[key]) return;
    if (!canConvertPair(input.homePriceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [key]: next });
  };

  const moneyResult = (
    id: string,
    label: string,
    tip: string,
    value: string,
    currencyKey: ResultCurrencyKey,
    currency: SupportedCurrency
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {getCurrencySymbol(currency)}
          </span>
          <input
            id={id}
            className={`${inputClass} font-semibold`}
            readOnly
            value={value}
            aria-live="polite"
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={(next) => handleResultCurrencyChange(currencyKey, next)}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          FHA Loan Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="fha-home-price">
            <span>Home price</span>
            <InfoTooltip
              label="Home price"
              text="Purchase price. Changing currency converts this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.homePrice}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {homeSymbol}
              </span>
              <input
                id="fha-home-price"
                className={inputClass}
                inputMode="decimal"
                value={input.homePrice}
                aria-invalid={Boolean(errors.homePrice)}
                onChange={(e) => set({ homePrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="fha-home-currency"
                value={input.homePriceCurrency}
                onChange={handleHomeCurrencyChange}
                aria-label="Home price currency"
              />
            </div>
          </div>
          {errors.homePrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.homePrice}</p>
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
          <label className={labelClass} htmlFor="fha-down">
            <span>Down payment percentage</span>
          </label>
          <FieldShell error={errors.downPaymentPercent}>
            <input
              id="fha-down"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.downPaymentPercent}
              aria-invalid={Boolean(errors.downPaymentPercent)}
              onChange={(e) => set({ downPaymentPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.downPaymentPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.downPaymentPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fha-term">
            <span>Loan term</span>
          </label>
          <FieldShell error={errors.loanTermYears}>
            <input
              id="fha-term"
              className={`${inputClass} pr-12`}
              inputMode="decimal"
              value={input.loanTermYears}
              aria-invalid={Boolean(errors.loanTermYears)}
              onChange={(e) => set({ loanTermYears: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          {errors.loanTermYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTermYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fha-rate">
            <span>Interest rate</span>
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="fha-rate"
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
          <label className={labelClass} htmlFor="fha-annual-mip">
            <span>FHA Annual MIP</span>
            <InfoTooltip
              label="FHA Annual MIP"
              text="Annual mortgage insurance premium rate. Monthly MIP = base loan × annual MIP / 12. Distinct from upfront MIP."
            />
          </label>
          <FieldShell error={errors.annualMipPercent}>
            <input
              id="fha-annual-mip"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualMipPercent}
              aria-invalid={Boolean(errors.annualMipPercent)}
              onChange={(e) => set({ annualMipPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.annualMipPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualMipPercent}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        {moneyResult(
          'fha-down-payment',
          'Total down payment',
          'Home price × down payment %.',
          result?.formattedTotalDownPayment ?? '',
          'totalDownPaymentCurrency',
          input.totalDownPaymentCurrency
        )}
        {moneyResult(
          'fha-base-loan',
          'FHA base loan amount',
          'Home price − total down payment.',
          result?.formattedBaseLoanAmount ?? '',
          'baseLoanAmountCurrency',
          input.baseLoanAmountCurrency
        )}
        {moneyResult(
          'fha-upfront-mip',
          'FHA Upfront MIP',
          `Base loan × ${(FHA_UPFRONT_MIP_RATE * 100).toFixed(2)}% (fixed reference rate; not editable).`,
          result?.formattedUpfrontMip ?? '',
          'upfrontMipCurrency',
          input.upfrontMipCurrency
        )}
        {moneyResult(
          'fha-monthly-mortgage',
          'Monthly mortgage payment',
          'Amortizing payment on the FHA base loan amount (not base + upfront MIP).',
          result?.formattedMonthlyMortgagePayment ?? '',
          'monthlyMortgagePaymentCurrency',
          input.monthlyMortgagePaymentCurrency
        )}
        {moneyResult(
          'fha-monthly-mip',
          'Monthly MIP',
          'Base loan × annual MIP / 12 (simplified constant model).',
          result?.formattedMonthlyMip ?? '',
          'monthlyMipCurrency',
          input.monthlyMipCurrency
        )}
        {moneyResult(
          'fha-total-loan',
          'Total FHA loan amount',
          'Base loan + upfront MIP.',
          result?.formattedTotalFhaLoanAmount ?? '',
          'totalFhaLoanAmountCurrency',
          input.totalFhaLoanAmountCurrency
        )}
        {moneyResult(
          'fha-total-monthly',
          'Total monthly payment',
          'Monthly mortgage payment + monthly MIP.',
          result?.formattedTotalMonthlyPayment ?? '',
          'totalMonthlyPaymentCurrency',
          input.totalMonthlyPaymentCurrency
        )}
        {moneyResult(
          'fha-total-cost',
          'Total cost of loan',
          'Total monthly payment × number of payments (aggregate mortgage + MIP under this model).',
          result?.formattedTotalCostOfLoan ?? '',
          'totalCostOfLoanCurrency',
          input.totalCostOfLoanCurrency
        )}

        <div>
          <label className={labelClass} htmlFor="fha-periodic-rate">
            <span>Periodic interest rate</span>
          </label>
          <FieldShell muted>
            <input
              id="fha-periodic-rate"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result?.formattedPeriodicInterestRatePercent ?? ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="fha-payments">
            <span>Number of payments</span>
          </label>
          <FieldShell muted>
            <input
              id="fha-payments"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? String(result.numberOfPayments) : ''}
              aria-live="polite"
            />
          </FieldShell>
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
