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
  PrivateSavingsFieldErrors,
  PrivateSavingsInput,
  PrivateSavingsResult,
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

interface PrivateSavingsFormProps {
  input: PrivateSavingsInput;
  errors: PrivateSavingsFieldErrors;
  result: PrivateSavingsResult | null;
  onChange: (input: PrivateSavingsInput) => void;
}

export function PrivateSavingsForm({
  input,
  errors,
  result,
  onChange,
}: PrivateSavingsFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const incomeSymbol = getCurrencySymbol(input.totalIncomeCurrency);
  const taxesSymbol = getCurrencySymbol(input.taxesCurrency);
  const consumptionSymbol = getCurrencySymbol(input.consumptionCurrency);
  const savingsSymbol = getCurrencySymbol(input.privateSavingsCurrency);

  const set = (patch: Partial<PrivateSavingsInput>) => {
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
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): { ok: true; text: string } | { ok: false } => {
    if (from === to) return { ok: true, text: raw };
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return { ok: true, text: raw };
    if (!canConvertPair(from, to)) return { ok: false };
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return { ok: false };
    return { ok: true, text: moneyAmountToInputString(converted.amount) };
  };

  const handleIncomeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalIncomeCurrency) return;
    const converted = convertFieldAmount(
      input.totalIncome,
      input.totalIncomeCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      totalIncomeCurrency: next,
      totalIncome: converted.text,
    });
  };

  const handleTaxesCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.taxesCurrency) return;
    const converted = convertFieldAmount(input.taxes, input.taxesCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      taxesCurrency: next,
      taxes: converted.text,
    });
  };

  const handleConsumptionCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.consumptionCurrency) return;
    const converted = convertFieldAmount(
      input.consumption,
      input.consumptionCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      consumptionCurrency: next,
      consumption: converted.text,
    });
  };

  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.privateSavingsCurrency) return;
    // Result currency only re-expresses Sp; inputs stay in their own currencies.
    // Ensure we can normalize each input into the new result currency when filled.
    const pairs: Array<[string, SupportedCurrency]> = [
      [input.totalIncome, input.totalIncomeCurrency],
      [input.taxes, input.taxesCurrency],
      [input.consumption, input.consumptionCurrency],
    ];
    for (const [raw, from] of pairs) {
      const amount = parseMoneyInput(raw);
      if (!Number.isFinite(amount)) continue;
      if (!canConvertPair(from, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    }
    setConversionError(null);
    onChange({ ...input, privateSavingsCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="ps-total-income">
          <span>Total income</span>
          <InfoTooltip
            label="Total income"
            text="Gross income (Y) for the period before subtracting taxes and consumption. Changing currency converts this amount with stored FX rates."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.totalIncome}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {incomeSymbol}
            </span>
            <input
              id="ps-total-income"
              className={inputClass}
              inputMode="decimal"
              value={input.totalIncome}
              aria-invalid={Boolean(errors.totalIncome)}
              onChange={(e) => set({ totalIncome: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ps-total-income-currency"
              value={input.totalIncomeCurrency}
              onChange={handleIncomeCurrencyChange}
              aria-label="Total income currency"
            />
          </div>
        </div>
        {errors.totalIncome ? (
          <p className="mt-1 text-xs text-rose-600">{errors.totalIncome}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ps-taxes">
          <span>Taxes paid to government</span>
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.taxes}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {taxesSymbol}
            </span>
            <input
              id="ps-taxes"
              className={inputClass}
              inputMode="decimal"
              value={input.taxes}
              aria-invalid={Boolean(errors.taxes)}
              onChange={(e) => set({ taxes: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ps-taxes-currency"
              value={input.taxesCurrency}
              onChange={handleTaxesCurrencyChange}
              aria-label="Taxes currency"
            />
          </div>
        </div>
        {errors.taxes ? (
          <p className="mt-1 text-xs text-rose-600">{errors.taxes}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ps-consumption">
          <span>Consumption</span>
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.consumption}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {consumptionSymbol}
            </span>
            <input
              id="ps-consumption"
              className={inputClass}
              inputMode="decimal"
              value={input.consumption}
              aria-invalid={Boolean(errors.consumption)}
              onChange={(e) => set({ consumption: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ps-consumption-currency"
              value={input.consumptionCurrency}
              onChange={handleConsumptionCurrencyChange}
              aria-label="Consumption currency"
            />
          </div>
        </div>
        {errors.consumption ? (
          <p className="mt-1 text-xs text-rose-600">{errors.consumption}</p>
        ) : null}
      </div>

      <div className="flex items-start gap-2.5">
        <input
          id="ps-additional"
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-ring"
          checked={input.includeAdditionalParameters}
          onChange={(e) =>
            set({ includeAdditionalParameters: e.target.checked })
          }
        />
        <label htmlFor="ps-additional" className="text-[13px] text-accent">
          Include additional parameters
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
 No extra fields are unlocked; only the verified Sp = Y − T − C
            identity is used.
          </span>
        </label>
      </div>

      <div>
        <label className={labelClass} htmlFor="ps-private-savings">
          <span>Private savings</span>
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {savingsSymbol}
            </span>
            <input
              id="ps-private-savings"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedPrivateSavings ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ps-private-savings-currency"
              value={input.privateSavingsCurrency}
              onChange={handleResultCurrencyChange}
              aria-label="Private savings currency"
            />
          </div>
        </div>
        {result?.isDissaving ? (
          <p className="mt-1 text-xs text-amber-700">
            Negative private savings means dissaving: taxes and consumption exceed
            income for this period.
          </p>
        ) : null}
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesStatus.warning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}
    </form>
  );
}
