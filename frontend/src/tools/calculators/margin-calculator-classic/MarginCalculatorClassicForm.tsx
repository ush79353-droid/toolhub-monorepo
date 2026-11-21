'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Pin } from 'lucide-react';
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
  MarginCalculatorClassicFieldErrors,
  MarginCalculatorClassicInput,
  MarginClassicDriver,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface MarginCalculatorClassicFormProps {
  input: MarginCalculatorClassicInput;
  errors: MarginCalculatorClassicFieldErrors;
  onChange: (input: MarginCalculatorClassicInput) => void;
}

export function MarginCalculatorClassicForm({
  input,
  errors,
  onChange,
}: MarginCalculatorClassicFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const costSymbol = getCurrencySymbol(input.costCurrency);
  const revenueSymbol = getCurrencySymbol(input.revenueCurrency);
  const profitSymbol = getCurrencySymbol(input.profitCurrency);

  const set = (
    patch: Partial<MarginCalculatorClassicInput>,
    driver?: MarginClassicDriver
  ) => {
    setConversionError(null);
    onChange({
      ...input,
      ...patch,
      ...(driver ? { driver } : {}),
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

  const convertFieldAmount = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return raw;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return null;
    return moneyAmountToInputString(converted.amount);
  };

  const handleCostCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.costCurrency) return;
    const nextAmount = convertFieldAmount(input.cost, input.costCurrency, next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      (input.revenueCurrency !== next &&
        !canConvertPair(input.revenueCurrency, next)) ||
      (input.profitCurrency !== next && !canConvertPair(input.profitCurrency, next))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      costCurrency: next,
      cost: nextAmount,
    });
  };

  const handleRevenueCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.revenueCurrency) return;
    const nextAmount = convertFieldAmount(
      input.revenue,
      input.revenueCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      revenueCurrency: next,
      revenue: nextAmount,
    });
  };

  const handleProfitCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.profitCurrency) return;
    const nextAmount = convertFieldAmount(input.profit, input.profitCurrency, next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      profitCurrency: next,
      profit: nextAmount,
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
          Margin Calculator Classic
        </legend>

        <div>
          <label className={labelClass} htmlFor="mcc-cost">
            <span>Cost</span>
            <InfoTooltip
              label="Cost"
              text="Cost of goods or services. Calculation currency for normalizing revenue and profit."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.cost}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {costSymbol}
              </span>
              <input
                id="mcc-cost"
                className={inputClass}
                inputMode="decimal"
                value={input.cost}
                aria-invalid={Boolean(errors.cost)}
                onChange={(e) => set({ cost: e.target.value }, 'cost')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mcc-cost-currency"
                value={input.costCurrency}
                onChange={handleCostCurrencyChange}
                aria-label="Cost currency"
              />
            </div>
          </div>
          {errors.cost ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cost}</p>
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
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label className="flex items-center gap-1.5 text-[13px] font-medium text-accent" htmlFor="mcc-margin">
              <span>Margin</span>
              <InfoTooltip
                label="Margin"
                text="Profit ÷ revenue × 100. Pin holds margin when cost, revenue, or profit changes."
              />
            </label>
            <button
              type="button"
              onClick={() => set({ marginPinned: !input.marginPinned })}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                input.marginPinned
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={input.marginPinned}
              aria-label={
                input.marginPinned ? 'Unpin margin' : 'Pin margin'
              }
              title={
                input.marginPinned
                  ? 'Margin pinned; held constant when solving'
                  : 'Pin margin to hold it constant'
              }
            >
              <Pin
                className={`h-3.5 w-3.5 ${input.marginPinned ? 'fill-current' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>
          <FieldShell error={errors.marginPercent}>
            <input
              id="mcc-margin"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.marginPercent}
              aria-invalid={Boolean(errors.marginPercent)}
              onChange={(e) => set({ marginPercent: e.target.value }, 'margin')}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.marginPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.marginPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mcc-revenue">
            <span>Revenue</span>
            <InfoTooltip
              label="Revenue"
              text="Selling price / revenue. Independent currency; normalized into cost currency before math."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.revenue}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {revenueSymbol}
              </span>
              <input
                id="mcc-revenue"
                className={inputClass}
                inputMode="decimal"
                value={input.revenue}
                aria-invalid={Boolean(errors.revenue)}
                onChange={(e) => set({ revenue: e.target.value }, 'revenue')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mcc-revenue-currency"
                value={input.revenueCurrency}
                onChange={handleRevenueCurrencyChange}
                aria-label="Revenue currency"
              />
            </div>
          </div>
          {errors.revenue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.revenue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mcc-profit">
            <span>Profit</span>
            <InfoTooltip
              label="Profit"
              text="Revenue − cost. Independent currency; normalized into cost currency before math."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.profit}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {profitSymbol}
              </span>
              <input
                id="mcc-profit"
                className={inputClass}
                inputMode="decimal"
                value={input.profit}
                aria-invalid={Boolean(errors.profit)}
                onChange={(e) => set({ profit: e.target.value }, 'profit')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mcc-profit-currency"
                value={input.profitCurrency}
                onChange={handleProfitCurrencyChange}
                aria-label="Profit currency"
              />
            </div>
          </div>
          {errors.profit ? (
            <p className="mt-1 text-xs text-rose-600">{errors.profit}</p>
          ) : null}
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
