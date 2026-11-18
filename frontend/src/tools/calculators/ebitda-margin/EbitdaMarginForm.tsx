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
  EbitdaMarginFieldErrors,
  EbitdaMarginInput,
  EbitdaMarginResult,
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

interface EbitdaMarginFormProps {
  input: EbitdaMarginInput;
  errors: EbitdaMarginFieldErrors;
  result: EbitdaMarginResult | null;
  onChange: (input: EbitdaMarginInput) => void;
}

export function EbitdaMarginForm({
  input,
  errors,
  result,
  onChange,
}: EbitdaMarginFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const revenuesSymbol = getCurrencySymbol(input.totalRevenuesCurrency);
  const ebitdaSymbol = getCurrencySymbol(input.ebitdaCurrency);

  const set = (patch: Partial<EbitdaMarginInput>) => {
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

  const handleRevenuesCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalRevenuesCurrency) return;

    const amount = parseMoneyInput(input.totalRevenues);
    if (!Number.isFinite(amount)) {
      if (
        input.ebitdaCurrency !== next &&
        !canConvertPair(next, input.ebitdaCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, totalRevenuesCurrency: next });
      return;
    }

    if (!canConvertPair(input.totalRevenuesCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (
      input.ebitdaCurrency !== next &&
      !canConvertPair(next, input.ebitdaCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.totalRevenuesCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      totalRevenuesCurrency: next,
      totalRevenues: moneyAmountToInputString(converted),
    });
  };

  const handleEbitdaCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.ebitdaCurrency) return;

    const amount = parseMoneyInput(input.ebitda);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, ebitdaCurrency: next });
      return;
    }

    if (!canConvertPair(input.ebitdaCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.ebitdaCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      ebitdaCurrency: next,
      ebitda: moneyAmountToInputString(converted),
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
          EBITDA Margin Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="ebitda-margin-revenues">
            <span>Total revenues</span>
            <InfoTooltip
              label="Total revenues"
              text="Period total revenues (sales). Must be nonzero. EBITDA is normalized into this currency before dividing."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalRevenues}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {revenuesSymbol}
              </span>
              <input
                id="ebitda-margin-revenues"
                className={inputClass}
                inputMode="decimal"
                value={input.totalRevenues}
                aria-invalid={Boolean(errors.totalRevenues)}
                onChange={(e) => set({ totalRevenues: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ebitda-margin-revenues-currency"
                value={input.totalRevenuesCurrency}
                onChange={handleRevenuesCurrencyChange}
                aria-label="Total revenues currency"
              />
            </div>
          </div>
          {errors.totalRevenues ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalRevenues}</p>
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
          <label className={labelClass} htmlFor="ebitda-margin-ebitda">
            <span>EBITDA</span>
            <InfoTooltip
              label="EBITDA"
              text="Earnings before interest, taxes, depreciation, and amortization for the same period. May be negative. May use a different currency than total revenues."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.ebitda}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {ebitdaSymbol}
              </span>
              <input
                id="ebitda-margin-ebitda"
                className={inputClass}
                inputMode="decimal"
                value={input.ebitda}
                aria-invalid={Boolean(errors.ebitda)}
                onChange={(e) => set({ ebitda: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ebitda-margin-ebitda-currency"
                value={input.ebitdaCurrency}
                onChange={handleEbitdaCurrencyChange}
                aria-label="EBITDA currency"
              />
            </div>
          </div>
          {errors.ebitda ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ebitda}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ebitda-margin-result">
            <span>EBITDA margin</span>
          </label>
          <FieldShell muted>
            <input
              id="ebitda-margin-result"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedMarginPercent : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
