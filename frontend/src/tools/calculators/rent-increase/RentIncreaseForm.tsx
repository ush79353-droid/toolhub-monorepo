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
  RentIncreaseFieldErrors,
  RentIncreaseInput,
  RentIncreaseResult,
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

interface RentIncreaseFormProps {
  input: RentIncreaseInput;
  errors: RentIncreaseFieldErrors;
  result: RentIncreaseResult | null;
  onChange: (input: RentIncreaseInput) => void;
}

export function RentIncreaseForm({
  input,
  errors,
  result,
  onChange,
}: RentIncreaseFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const currentSymbol = getCurrencySymbol(input.currentRentCurrency);
  const futureSymbol = getCurrencySymbol(input.futureRentCurrency);

  const set = (patch: Partial<RentIncreaseInput>) => {
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

  /** Convert current rent; leave percent/years alone. */
  const handleCurrentCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currentRentCurrency) return;

    const amount = parseMoneyInput(input.currentAnnualRent);
    if (!Number.isFinite(amount)) {
      if (
        input.futureRentCurrency !== next &&
        !canConvertPair(next, input.futureRentCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, currentRentCurrency: next });
      return;
    }

    if (!canConvertPair(input.currentRentCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (
      input.futureRentCurrency !== next &&
      !canConvertPair(next, input.futureRentCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.currentRentCurrency,
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
      currentRentCurrency: next,
      currentAnnualRent: moneyAmountToInputString(converted.amount),
    });
  };

  /** Result currency only — does not alter growth math inputs. */
  const handleFutureCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.futureRentCurrency) return;

    if (!canConvertPair(input.currentRentCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({ ...input, futureRentCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="ri-current-rent">
          <span>Current annual rent</span>
          <InfoTooltip
            label="Current annual rent"
            text="Today’s annual rent in the selected currency. Changing currency converts this amount."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.currentAnnualRent}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {currentSymbol}
            </span>
            <input
              id="ri-current-rent"
              className={inputClass}
              inputMode="decimal"
              value={input.currentAnnualRent}
              aria-invalid={Boolean(errors.currentAnnualRent)}
              onChange={(e) => set({ currentAnnualRent: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ri-current-currency"
              value={input.currentRentCurrency}
              onChange={handleCurrentCurrencyChange}
              aria-label="Current annual rent currency"
            />
          </div>
        </div>
        {errors.currentAnnualRent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.currentAnnualRent}</p>
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
        <label className={labelClass} htmlFor="ri-change">
          <span>Average rent change per year</span>
          <InfoTooltip
            label="Average rent change per year"
            text="Compounded yearly percent change. May be zero or negative (≥ −100%). Never currency-converted."
          />
        </label>
        <FieldShell error={errors.averageRentChangePercent}>
          <input
            id="ri-change"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.averageRentChangePercent}
            aria-invalid={Boolean(errors.averageRentChangePercent)}
            onChange={(e) => set({ averageRentChangePercent: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.averageRentChangePercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.averageRentChangePercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ri-years">
          <span>Number of years</span>
          <InfoTooltip
            label="Number of years"
            text="How many years to compound. Zero years leaves future rent equal to current rent."
          />
        </label>
        <FieldShell error={errors.numberOfYears}>
          <input
            id="ri-years"
            className={`${inputClass} pr-12`}
            inputMode="decimal"
            value={input.numberOfYears}
            aria-invalid={Boolean(errors.numberOfYears)}
            onChange={(e) => set({ numberOfYears: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            yrs
          </span>
        </FieldShell>
        {errors.numberOfYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.numberOfYears}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ri-future">
          <span>Expected future annual rent</span>
          <InfoTooltip
            label="Expected future annual rent"
            text="Current × (1 + change/100)^years in the current-rent currency, then re-expressed in this result currency."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {futureSymbol}
            </span>
            <input
              id="ri-future"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedFutureAnnualRent : ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ri-future-currency"
              value={input.futureRentCurrency}
              onChange={handleFutureCurrencyChange}
              aria-label="Expected future annual rent currency"
            />
          </div>
        </div>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
