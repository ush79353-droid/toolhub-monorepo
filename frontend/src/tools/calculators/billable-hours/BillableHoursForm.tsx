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
  BillableHoursDraft,
  BillableHoursFieldErrors,
  BillableHoursResult,
  BillableHoursSolveTarget,
  BillableTimeUnit,
} from './types';
import { BILLABLE_TIME_UNITS, RATE_TIME_UNITS } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring sm:w-[96px]';

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

interface BillableHoursFormProps {
  input: BillableHoursDraft;
  errors: BillableHoursFieldErrors;
  result: BillableHoursResult | null;
  onChange: (input: BillableHoursDraft) => void;
}

export function BillableHoursForm({
  input,
  errors,
  result,
  onChange,
}: BillableHoursFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const rateSymbol = getCurrencySymbol(input.rateCurrency);
  const valueSymbol = getCurrencySymbol(input.valueCurrency);

  const displayRate =
    result && result.solvedField === 'rate' ? result.formattedRate : input.rate;
  const displayTime =
    result && result.solvedField === 'time' ? result.formattedTime : input.time;
  const displayValue =
    result && result.solvedField === 'value' ? result.formattedValue : input.value;

  const setField = (field: BillableHoursSolveTarget, value: string) => {
    setConversionError(null);
    onChange({
      ...input,
      [field]: value,
      lastEdited: field,
      solveFor: field,
    });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const handleRateCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.rateCurrency) return;
    const amount = parseMoneyInput(input.rate);
    if (!Number.isFinite(amount)) {
      if (
        input.valueCurrency !== next &&
        !canConvertPair(next, input.valueCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, rateCurrency: next, lastEdited: 'rate' });
      return;
    }
    if (!canConvertPair(input.rateCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.rateCurrency,
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
      rateCurrency: next,
      rate: moneyAmountToInputString(converted.amount),
      lastEdited: 'rate',
    });
  };

  const handleValueCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.valueCurrency) return;
    const amount = parseMoneyInput(input.value);
    if (!Number.isFinite(amount)) {
      if (!canConvertPair(input.rateCurrency, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, valueCurrency: next, lastEdited: 'value' });
      return;
    }
    if (!canConvertPair(input.valueCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.valueCurrency,
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
      valueCurrency: next,
      value: moneyAmountToInputString(converted.amount),
      lastEdited: 'value',
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="billable-hours-rate">
          <span>Billable rate</span>
          <InfoTooltip
            label="Billable rate"
            text="Money per selected time unit. Leave blank to solve for rate. Changing currency converts this amount; the time unit is never FX-converted."
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <FieldShell error={errors.rate} muted={result?.solvedField === 'rate'}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {rateSymbol}
            </span>
            <input
              id="billable-hours-rate"
              className={inputClass}
              inputMode="decimal"
              value={displayRate}
              aria-invalid={Boolean(errors.rate)}
              onChange={(e) => setField('rate', e.target.value)}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="billable-hours-rate-currency"
              value={input.rateCurrency}
              onChange={handleRateCurrencyChange}
              aria-label="Billable rate currency"
            />
          </div>
          <span className="text-sm text-muted-foreground" aria-hidden="true">
            /
          </span>
          <select
            className={selectClass}
            value={input.rateUnit}
            aria-label="Billable rate time unit"
            onChange={(e) =>
              onChange({
                ...input,
                rateUnit: e.target.value as BillableTimeUnit,
                lastEdited: 'rate',
              })
            }
          >
            {RATE_TIME_UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        {errors.rate ? <p className="mt-1 text-xs text-rose-600">{errors.rate}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="billable-hours-time">
          <span>Billable time</span>
          <InfoTooltip
            label="Billable time"
            text="Duration billed. Leave blank to solve for time. Seconds, minutes, and hours use exact conversions (60 s/min, 60 min/hr). Never FX-converted."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.time} muted={result?.solvedField === 'time'}>
            <input
              id="billable-hours-time"
              className={inputClass}
              inputMode="decimal"
              value={displayTime}
              aria-invalid={Boolean(errors.time)}
              onChange={(e) => setField('time', e.target.value)}
            />
          </FieldShell>
          <select
            className={selectClass}
            value={input.timeUnit}
            aria-label="Billable time unit"
            onChange={(e) =>
              onChange({
                ...input,
                timeUnit: e.target.value as BillableTimeUnit,
                lastEdited: 'time',
              })
            }
          >
            {BILLABLE_TIME_UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        {errors.time ? <p className="mt-1 text-xs text-rose-600">{errors.time}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="billable-hours-value">
          <span>Billable value</span>
          <InfoTooltip
            label="Billable value"
            text="Rate × time in the selected display currency. Leave blank to solve for value."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.value} muted={result?.solvedField === 'value'}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {valueSymbol}
            </span>
            <input
              id="billable-hours-value"
              className={`${inputClass} font-semibold`}
              inputMode="decimal"
              value={displayValue}
              aria-invalid={Boolean(errors.value)}
              onChange={(e) => setField('value', e.target.value)}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="billable-hours-value-currency"
              value={input.valueCurrency}
              onChange={handleValueCurrencyChange}
              aria-label="Billable value currency"
            />
          </div>
        </div>
        {errors.value ? <p className="mt-1 text-xs text-rose-600">{errors.value}</p> : null}
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesStatus.warning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
