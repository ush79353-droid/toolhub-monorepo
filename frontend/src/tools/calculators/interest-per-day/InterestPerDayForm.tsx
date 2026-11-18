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
import { INTEREST_PER_DAY_YEAR_DAYS } from './calculation';
import type {
  InterestPerDayFieldErrors,
  InterestPerDayInput,
  InterestPerDayResult,
  RatePercentUnit,
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

interface InterestPerDayFormProps {
  input: InterestPerDayInput;
  errors: InterestPerDayFieldErrors;
  result: InterestPerDayResult | null;
  onChange: (input: InterestPerDayInput) => void;
}

export function InterestPerDayForm({
  input,
  errors,
  result,
  onChange,
}: InterestPerDayFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const loanSymbol = getCurrencySymbol(input.loanBalanceCurrency);
  const resultSymbol = getCurrencySymbol(input.interestPerDayCurrency);

  const set = (patch: Partial<InterestPerDayInput>) => {
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

  /** Convert loan balance; leave result currency and rate fields alone. */
  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanBalanceCurrency) return;

    const amount = parseMoneyInput(input.loanBalance);
    if (!Number.isFinite(amount)) {
      if (
        input.interestPerDayCurrency !== next &&
        !canConvertPair(next, input.interestPerDayCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, loanBalanceCurrency: next });
      return;
    }

    if (!canConvertPair(input.loanBalanceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (
      input.interestPerDayCurrency !== next &&
      !canConvertPair(next, input.interestPerDayCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.loanBalanceCurrency,
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
      loanBalanceCurrency: next,
      loanBalance: moneyAmountToInputString(converted.amount),
    });
  };

  /** Change result display currency only — no change to loan balance or rates. */
  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.interestPerDayCurrency) return;

    if (!canConvertPair(input.loanBalanceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({ ...input, interestPerDayCurrency: next });
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
          Interest Per Day Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="ipd-loan-balance">
            <span>Loan balance</span>
            <InfoTooltip
              label="Loan balance"
              text="Outstanding principal used for simple daily interest."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="ipd-loan-balance"
                className={inputClass}
                inputMode="decimal"
                value={input.loanBalance}
                aria-invalid={Boolean(errors.loanBalance)}
                onChange={(e) => set({ loanBalance: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ipd-loan-currency"
                value={input.loanBalanceCurrency}
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
          <label className={labelClass} htmlFor="ipd-annual-rate">
            <span>Annual interest rate</span>
            <InfoTooltip
              label="Annual interest rate"
              text={`Nominal annual rate as a percent. Daily rate = annual / ${INTEREST_PER_DAY_YEAR_DAYS}. Not FX-converted.`}
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.annualInterestRatePercent}>
              <input
                id="ipd-annual-rate"
                className={inputClass}
                inputMode="decimal"
                value={input.annualInterestRatePercent}
                aria-invalid={Boolean(errors.annualInterestRatePercent)}
                onChange={(e) => set({ annualInterestRatePercent: e.target.value })}
              />
            </FieldShell>
            <div className="w-[88px] shrink-0 sm:w-[96px]">
              <select
                id="ipd-annual-rate-unit"
                className={selectClass}
                value={input.annualRateUnit}
                aria-label="Annual interest rate unit"
                onChange={(e) =>
                  set({ annualRateUnit: e.target.value as RatePercentUnit })
                }
              >
                <option value="%">%</option>
              </select>
            </div>
          </div>
          {errors.annualInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ipd-interest-per-day">
            <span>Interest per day</span>
            <InfoTooltip
              label="Interest per day"
              text={`Loan balance × (annual rate / 100) / ${INTEREST_PER_DAY_YEAR_DAYS}, then converted into the result currency.`}
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {resultSymbol}
              </span>
              <input
                id="ipd-interest-per-day"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedInterestPerDay : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ipd-result-currency"
                value={input.interestPerDayCurrency}
                onChange={handleResultCurrencyChange}
                aria-label="Interest per day currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ipd-daily-rate">
            <span>Interest rate per day</span>
            <InfoTooltip
              label="Interest rate per day"
              text={`Annual interest rate divided by ${INTEREST_PER_DAY_YEAR_DAYS}. Percentages are never currency-converted.`}
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <input
                id="ipd-daily-rate"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedInterestRatePerDay : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[88px] shrink-0 sm:w-[96px]">
              <select
                id="ipd-daily-rate-unit"
                className={selectClass}
                value={input.dailyRateUnit}
                aria-label="Interest rate per day unit"
                onChange={(e) =>
                  set({ dailyRateUnit: e.target.value as RatePercentUnit })
                }
              >
                <option value="%">%</option>
              </select>
            </div>
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
