'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AppreciationFieldErrors,
  AppreciationInput,
  AppreciationRatePeriod,
  AppreciationResult,
} from './types';

const MONEY_FIELDS = ['startingValue'] as const;

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

interface AppreciationFormProps {
  input: AppreciationInput;
  errors: AppreciationFieldErrors;
  result: AppreciationResult | null;
  onChange: (input: AppreciationInput) => void;
  onReset: () => void;
}

const RATE_PERIODS: readonly { value: AppreciationRatePeriod; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export function AppreciationForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: AppreciationFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<AppreciationInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  /** Shared currency — convert starting value; rate/duration unchanged; final recalculates. */
  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      input,
      MONEY_FIELDS,
      input.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      ...converted.values,
      currency,
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="appreciation-start">
          <span>Starting value</span>
          <InfoTooltip
            label="Starting value"
            text="Initial amount before appreciation. Must be greater than zero."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.startingValue}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="appreciation-start"
              className={inputClass}
              inputMode="decimal"
              value={input.startingValue}
              aria-invalid={Boolean(errors.startingValue)}
              onChange={(event) => set({ startingValue: event.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="appreciation-start-currency"
              value={input.currency}
              onChange={handleCurrencyChange}
              aria-label="Starting value currency"
            />
          </div>
        </div>
        {errors.startingValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.startingValue}</p>
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
        <label className={labelClass} htmlFor="appreciation-rate">
          <span>Appreciation rate</span>
          <InfoTooltip
            label="Appreciation rate"
            text="Percent change per rate period. Must be greater than −100%. Zero is allowed; negative values model depreciation."
          />
        </label>
        <FieldShell error={errors.appreciationRate}>
          <input
            id="appreciation-rate"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.appreciationRate}
            aria-invalid={Boolean(errors.appreciationRate)}
            onChange={(event) => set({ appreciationRate: event.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.appreciationRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.appreciationRate}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={`${labelClass} mb-2`}>Appreciation rate period</legend>
        <div
          className="flex flex-wrap gap-4"
          role="radiogroup"
          aria-label="Appreciation rate period"
        >
          {RATE_PERIODS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="appreciation-rate-period"
                className="h-4 w-4 border-border"
                checked={input.ratePeriod === option.value}
                onChange={() => set({ ratePeriod: option.value })}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <div className={`${labelClass} mb-1.5`}>
          <span>Period</span>
          <InfoTooltip
            label="Period"
            text="Duration of appreciation in years and months. Both must be non-negative."
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldShell error={errors.years}>
            <input
              id="appreciation-years"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.years}
              placeholder="0"
              aria-label="Years"
              aria-invalid={Boolean(errors.years)}
              onChange={(event) => set({ years: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          <FieldShell error={errors.months}>
            <input
              id="appreciation-months"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.months}
              placeholder="0"
              aria-label="Months"
              aria-invalid={Boolean(errors.months)}
              onChange={(event) => set({ months: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              mos
            </span>
          </FieldShell>
        </div>
        {errors.years ? (
          <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
        ) : errors.months ? (
          <p className="mt-1 text-xs text-rose-600">{errors.months}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="appreciation-final">
          <span>Final value</span>
          <InfoTooltip
            label="Final value"
            text="Starting value × (1 + rate/100)^N, where N is the number of rate periods in the duration."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="appreciation-final"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedFinalValue : ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="appreciation-final-currency"
              value={input.currency}
              onChange={handleCurrencyChange}
              aria-label="Final value currency"
            />
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          If you want to calculate depreciation, use a negative appreciation rate or try the
          depreciation calculator.
        </p>
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
          Reset
        </Button>
      </div>
    </form>
  );
}
