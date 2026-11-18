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
  BedroomCount,
  RentSplitFieldErrors,
  RentSplitInput,
  RentSplitResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

const BEDROOM_OPTIONS: readonly { value: BedroomCount; label: string }[] = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
];

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

interface RentSplitFormProps {
  input: RentSplitInput;
  errors: RentSplitFieldErrors;
  result: RentSplitResult | null;
  onChange: (input: RentSplitInput) => void;
}

export function RentSplitForm({
  input,
  errors,
  result,
  onChange,
}: RentSplitFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const rentSymbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<RentSplitInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const canConvert = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const handleCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currency) return;

    const amount = parseMoneyInput(input.totalRent);
    if (!Number.isFinite(amount)) {
      set({ currency: next });
      return;
    }

    if (!canConvert(input.currency, next)) {
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

    set({
      currency: next,
      totalRent: moneyAmountToInputString(converted.amount),
    });
  };

  const setPeople = (index: 0 | 1 | 2, value: string) => {
    const next: [string, string, string] = [...input.people];
    next[index] = value;
    set({ people: next });
  };

  const peopleErrorKeys = ['people1', 'people2', 'people3'] as const;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Rent details
        </legend>

        <div>
          <label className={labelClass} htmlFor="rs-total-rent">
            <span>Total rent</span>
            <InfoTooltip
              label="Total rent"
              text="Full rent for the home in the selected currency. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalRent}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {rentSymbol}
              </span>
              <input
                id="rs-total-rent"
                className={inputClass}
                inputMode="decimal"
                value={input.totalRent}
                aria-invalid={Boolean(errors.totalRent)}
                onChange={(e) => set({ totalRent: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rs-currency"
                value={input.currency}
                onChange={handleCurrencyChange}
                aria-label="Total rent currency"
              />
            </div>
          </div>
          {errors.totalRent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalRent}</p>
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
          <div className={labelClass}>
            <span>Number of bedrooms</span>
            <InfoTooltip
              label="Number of bedrooms"
              text="Shows one to three bedroom sections. Only selected bedrooms are included in the split."
            />
          </div>
          <div
            className="flex flex-col gap-2.5"
            role="radiogroup"
            aria-label="Number of bedrooms"
          >
            {BEDROOM_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="rs-bedroom-count"
                  className="h-4 w-4 accent-primary"
                  checked={input.bedroomCount === opt.value}
                  onChange={() => set({ bedroomCount: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {Array.from({ length: input.bedroomCount }, (_, index) => {
        const bedroom = (index + 1) as 1 | 2 | 3;
        const peopleKey = peopleErrorKeys[index]!;
        const peopleId = `rs-people-${bedroom}`;
        return (
          <fieldset
            key={bedroom}
            className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          >
            <legend className="px-1 text-[13px] font-semibold text-accent">
              Bedroom {bedroom}
            </legend>
            <div>
              <label className={labelClass} htmlFor={peopleId}>
                <span>Number of people</span>
                <InfoTooltip
                  label="Number of people"
                  text="Whole number of people living in this bedroom. Counts are not converted when currency changes."
                />
              </label>
              <FieldShell error={errors[peopleKey]}>
                <input
                  id={peopleId}
                  className={inputClass}
                  inputMode="numeric"
                  value={input.people[index]}
                  aria-invalid={Boolean(errors[peopleKey])}
                  onChange={(e) =>
                    setPeople(index as 0 | 1 | 2, e.target.value)
                  }
                />
                <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
                  person(s)
                </span>
              </FieldShell>
              {errors[peopleKey] ? (
                <p className="mt-1 text-xs text-rose-600">{errors[peopleKey]}</p>
              ) : null}
            </div>
            {result ? (
              <p className="text-sm text-accent">
                Bedroom share:{' '}
                <span className="font-semibold tabular-nums">
                  {rentSymbol}
                  {result.bedrooms[index]?.formattedShare ?? '—'}
                </span>
              </p>
            ) : null}
          </fieldset>
        );
      })}

      {result ? (
        <div className="rounded-xl border border-border bg-brand-softTeal/30 p-3.5 sm:p-4">
          <p className="text-[13px] font-semibold text-accent">Split summary</p>
          <dl className="mt-2 space-y-1.5 text-sm text-accent">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Total people</dt>
              <dd className="font-semibold tabular-nums">{result.totalPeople}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Per-person rent</dt>
              <dd className="font-semibold tabular-nums">
                {rentSymbol}
                {result.formattedPerPersonRent}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
