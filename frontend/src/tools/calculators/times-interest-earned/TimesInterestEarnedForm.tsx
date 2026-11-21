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
import type {
  TimesInterestEarnedFieldErrors,
  TimesInterestEarnedInput,
  TimesInterestEarnedResult,
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

interface TimesInterestEarnedFormProps {
  input: TimesInterestEarnedInput;
  errors: TimesInterestEarnedFieldErrors;
  result: TimesInterestEarnedResult | null;
  onChange: (input: TimesInterestEarnedInput) => void;
}

export function TimesInterestEarnedForm({
  input,
  errors,
  result,
  onChange,
}: TimesInterestEarnedFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const ebitSymbol = getCurrencySymbol(input.ebitCurrency);
  const interestSymbol = getCurrencySymbol(input.totalInterestCurrency);

  const set = (patch: Partial<TimesInterestEarnedInput>) => {
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

  const convertFieldAmount = (
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

  const handleEbitCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.ebitCurrency) return;

    const amount = parseMoneyInput(input.ebit);
    if (!Number.isFinite(amount)) {
      if (
        input.totalInterestCurrency !== next &&
        !canConvertPair(next, input.totalInterestCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, ebitCurrency: next });
      return;
    }

    if (!canConvertPair(input.ebitCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (
      input.totalInterestCurrency !== next &&
      !canConvertPair(next, input.totalInterestCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.ebitCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      ebitCurrency: next,
      ebit: moneyAmountToInputString(converted),
    });
  };

  const handleInterestCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalInterestCurrency) return;

    const amount = parseMoneyInput(input.totalInterest);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, totalInterestCurrency: next });
      return;
    }

    if (!canConvertPair(input.totalInterestCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.totalInterestCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      totalInterestCurrency: next,
      totalInterest: moneyAmountToInputString(converted),
    });
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
          Times Interest Earned Ratio Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="tie-ebit">
            <span>EBIT</span>
            <InfoTooltip
              label="EBIT"
              text="Earnings before interest and taxes for the same period as total interest."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.ebit}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {ebitSymbol}
              </span>
              <input
                id="tie-ebit"
                className={inputClass}
                inputMode="decimal"
                value={input.ebit}
                aria-invalid={Boolean(errors.ebit)}
                onChange={(e) => set({ ebit: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="tie-ebit-currency"
                value={input.ebitCurrency}
                onChange={handleEbitCurrencyChange}
                aria-label="EBIT currency"
              />
            </div>
          </div>
          {errors.ebit ? <p className="mt-1 text-xs text-rose-600">{errors.ebit}</p> : null}
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
          <label className={labelClass} htmlFor="tie-interest">
            <span>Total interest</span>
            <InfoTooltip
              label="Total interest"
              text="Period interest cost. Must be greater than zero. May use a different currency than EBIT."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalInterest}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {interestSymbol}
              </span>
              <input
                id="tie-interest"
                className={inputClass}
                inputMode="decimal"
                value={input.totalInterest}
                aria-invalid={Boolean(errors.totalInterest)}
                onChange={(e) => set({ totalInterest: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="tie-interest-currency"
                value={input.totalInterestCurrency}
                onChange={handleInterestCurrencyChange}
                aria-label="Total interest currency"
              />
            </div>
          </div>
          {errors.totalInterest ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalInterest}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="tie-result">
            <span>Times interest earned (TIE) ratio</span>
            <InfoTooltip
              label="Times interest earned (TIE) ratio"
              text="EBIT ÷ total interest after normalizing both amounts into the EBIT currency. Dimensionless; no currency symbol."
            />
          </label>
          <FieldShell muted>
            <input
              id="tie-result"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedTieRatio : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
