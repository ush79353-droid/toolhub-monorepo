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
  MoveStatus,
  ProratedRentFieldErrors,
  ProratedRentInput,
  ProratedRentResult,
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

interface ProratedRentFormProps {
  input: ProratedRentInput;
  errors: ProratedRentFieldErrors;
  result: ProratedRentResult | null;
  onChange: (input: ProratedRentInput) => void;
}

export function ProratedRentForm({
  input,
  errors,
  result,
  onChange,
}: ProratedRentFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const rentSymbol = getCurrencySymbol(input.monthlyRentCurrency);
  const resultSymbol = getCurrencySymbol(input.proratedRentCurrency);

  const set = (patch: Partial<ProratedRentInput>) => {
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

  const handleMonthlyRentCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.monthlyRentCurrency) return;

    const amount = parseMoneyInput(input.monthlyRent);
    if (!Number.isFinite(amount)) {
      if (
        input.proratedRentCurrency !== next &&
        !canConvertPair(next, input.proratedRentCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      set({ monthlyRentCurrency: next });
      return;
    }

    if (!canConvertPair(input.monthlyRentCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.proratedRentCurrency !== next &&
      !canConvertPair(next, input.proratedRentCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.monthlyRentCurrency,
      to: next,
      rates: rates.rates,
    });
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    set({
      monthlyRentCurrency: next,
      monthlyRent: moneyAmountToInputString(converted.amount),
    });
  };

  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.proratedRentCurrency) return;
    if (!canConvertPair(input.monthlyRentCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({ proratedRentCurrency: next });
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
          Moving in or out?
        </legend>

        <div
          className="flex flex-wrap gap-4"
          role="radiogroup"
          aria-label="Moving in or out"
        >
          {(
            [
              { value: 'moving-in', label: 'Moving in' },
              { value: 'moving-out', label: 'Moving out' },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="pr-move-status"
                className="h-4 w-4 accent-primary"
                checked={input.moveStatus === opt.value}
                onChange={() => set({ moveStatus: opt.value as MoveStatus })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>

        <div>
          <label className={labelClass} htmlFor="pr-moving-date">
            Moving date
          </label>
          <FieldShell error={errors.movingDate}>
            <input
              id="pr-moving-date"
              type="date"
              className={inputClass}
              value={input.movingDate}
              aria-invalid={Boolean(errors.movingDate)}
              onChange={(e) => set({ movingDate: e.target.value })}
            />
          </FieldShell>
          {errors.movingDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.movingDate}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Costs</legend>

        <div>
          <label className={labelClass} htmlFor="pr-monthly-rent">
            <span>Basic monthly rent</span>
            <InfoTooltip
              label="Basic monthly rent"
              text="Full monthly rent for the move month. Proration uses actual calendar days in that month."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.monthlyRent}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {rentSymbol}
              </span>
              <input
                id="pr-monthly-rent"
                className={inputClass}
                inputMode="decimal"
                value={input.monthlyRent}
                aria-invalid={Boolean(errors.monthlyRent)}
                onChange={(e) => set({ monthlyRent: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pr-monthly-rent-currency"
                value={input.monthlyRentCurrency}
                onChange={handleMonthlyRentCurrencyChange}
                aria-label="Monthly rent currency"
              />
            </div>
          </div>
          {errors.monthlyRent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyRent}</p>
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
          <label className={labelClass} htmlFor="pr-prorated-rent">
            <span>Prorated rent</span>
            <InfoTooltip
              label="Prorated rent"
              text="Daily rent × chargeable days. Moving in charges from the move date through month-end; moving out charges from the 1st through the move date."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {resultSymbol}
              </span>
              <input
                id="pr-prorated-rent"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedProratedRent ?? ''}
                aria-label="Prorated rent result"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pr-prorated-rent-currency"
                value={input.proratedRentCurrency}
                onChange={handleResultCurrencyChange}
                aria-label="Prorated rent currency"
              />
            </div>
          </div>
          {result ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.chargeableDays} of {result.daysInMonth} days in month
            </p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
