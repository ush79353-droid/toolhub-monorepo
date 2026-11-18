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
  MarginAndMarkupFieldErrors,
  MarginAndMarkupInput,
  MarginAndMarkupResult,
  MarginMarkupDriver,
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

interface MarginAndMarkupFormProps {
  input: MarginAndMarkupInput;
  errors: MarginAndMarkupFieldErrors;
  result: MarginAndMarkupResult | null;
  onChange: (input: MarginAndMarkupInput) => void;
}

export function MarginAndMarkupForm({
  input,
  errors,
  result,
  onChange,
}: MarginAndMarkupFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const costSymbol = getCurrencySymbol(input.costCurrency);
  const revenueSymbol = getCurrencySymbol(input.revenueCurrency);
  const profitSymbol = getCurrencySymbol(input.profitCurrency);

  const set = (patch: Partial<MarginAndMarkupInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const setDriver = (
    driver: MarginMarkupDriver,
    patch: Partial<MarginAndMarkupInput>
  ) => {
    setConversionError(null);
    onChange({ ...input, ...patch, driver });
  };

  const setDriver2 = (
    driver2: MarginMarkupDriver,
    patch: Partial<MarginAndMarkupInput>
  ) => {
    setConversionError(null);
    onChange({ ...input, ...patch, driver2 });
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
    return converted.ok ? moneyAmountToInputString(converted.amount) : null;
  };

  const handleCostCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.costCurrency) return;
    if (!canConvertPair(input.costCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.revenueCurrency !== next &&
      !canConvertPair(next, input.revenueCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.profitCurrency !== next &&
      !canConvertPair(next, input.profitCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const nextCost = convertFieldAmount(input.cost, input.costCurrency, next);
    if (nextCost === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      costCurrency: next,
      cost: nextCost,
      driver: 'cost',
    });
  };

  const handleRevenueCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.revenueCurrency) return;
    if (!canConvertPair(input.revenueCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const nextRevenue = convertFieldAmount(
      input.revenue,
      input.revenueCurrency,
      next
    );
    if (nextRevenue === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    let nextRevenue2 = input.revenue2;
    if (input.compareTwo && input.revenue2.trim() !== '') {
      const converted2 = convertFieldAmount(
        input.revenue2,
        input.revenueCurrency,
        next
      );
      if (converted2 === null) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      nextRevenue2 = converted2;
    }
    setConversionError(null);
    onChange({
      ...input,
      revenueCurrency: next,
      revenue: nextRevenue,
      revenue2: nextRevenue2,
    });
  };

  const handleProfitCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.profitCurrency) return;
    if (!canConvertPair(input.profitCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const nextProfit = convertFieldAmount(input.profit, input.profitCurrency, next);
    if (nextProfit === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    let nextProfit2 = input.profit2;
    if (input.compareTwo && input.profit2.trim() !== '') {
      const converted2 = convertFieldAmount(
        input.profit2,
        input.profitCurrency,
        next
      );
      if (converted2 === null) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      nextProfit2 = converted2;
    }
    setConversionError(null);
    onChange({
      ...input,
      profitCurrency: next,
      profit: nextProfit,
      profit2: nextProfit2,
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
        <legend className="px-1 text-[13px] font-semibold text-accent">Cost</legend>

        <div>
          <label className={labelClass} htmlFor="mm-cost">
            <span>Cost</span>
            <InfoTooltip
              label="Cost"
              text="Production or purchase cost. Money amounts normalize into this currency before formulas. Changing currency converts the cost amount; margin and markup % stay the same."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.cost}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {costSymbol}
              </span>
              <input
                id="mm-cost"
                className={inputClass}
                inputMode="decimal"
                value={input.cost}
                aria-invalid={Boolean(errors.cost)}
                onChange={(e) => setDriver('cost', { cost: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mm-cost-currency"
                value={input.costCurrency}
                onChange={handleCostCurrencyChange}
                aria-label="Cost currency"
              />
            </div>
          </div>
          {errors.cost ? <p className="mt-1 text-xs text-rose-600">{errors.cost}</p> : null}
          {conversionError ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {conversionError}
            </p>
          ) : null}
          {ratesStatus.warning && !conversionError ? (
            <p className="mt-1 text-xs text-amber-700">{ratesStatus.warning}</p>
          ) : null}
        </div>

        <label className="flex items-start gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border"
            checked={input.compareTwo}
            onChange={(e) => set({ compareTwo: e.target.checked })}
          />
          <span>Compare two markups and margins</span>
        </label>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          {input.compareTwo ? 'Scenario 1' : 'Margin & markup'}
        </legend>

        <div>
          <label className={labelClass} htmlFor="mm-margin">
            <span>Margin</span>
          </label>
          <FieldShell error={errors.margin}>
            <input
              id="mm-margin"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.margin}
              aria-invalid={Boolean(errors.margin)}
              onChange={(e) => setDriver('margin', { margin: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.margin ? (
            <p className="mt-1 text-xs text-rose-600">{errors.margin}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mm-markup">
            <span>Markup</span>
          </label>
          <FieldShell error={errors.markup}>
            <input
              id="mm-markup"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.markup}
              aria-invalid={Boolean(errors.markup)}
              onChange={(e) => setDriver('markup', { markup: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.markup ? (
            <p className="mt-1 text-xs text-rose-600">{errors.markup}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mm-revenue">
            <span>Revenue</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.revenue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {revenueSymbol}
              </span>
              <input
                id="mm-revenue"
                className={inputClass}
                inputMode="decimal"
                value={input.revenue}
                aria-invalid={Boolean(errors.revenue)}
                onChange={(e) => setDriver('revenue', { revenue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mm-revenue-currency"
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
          <label className={labelClass} htmlFor="mm-profit">
            <span>Profit</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.profit}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {profitSymbol}
              </span>
              <input
                id="mm-profit"
                className={inputClass}
                inputMode="decimal"
                value={input.profit}
                aria-invalid={Boolean(errors.profit)}
                onChange={(e) => setDriver('profit', { profit: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mm-profit-currency"
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

        <p className="text-sm text-muted-foreground">
          Check out{' '}
          <a
            href="#how-to-use-markup-and-margin"
            className="font-medium text-primary underline underline-offset-2"
          >
            how to use the markup and margin calculator
          </a>
          .
        </p>
      </fieldset>

      {input.compareTwo ? (
        <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <legend className="px-1 text-[13px] font-semibold text-accent">
            Scenario 2
          </legend>
          <p className="text-xs text-muted-foreground">
            Shares the same cost and money currencies. Enter a second margin or markup to compare
            prices (Omni two-set behavior).
          </p>

          <div>
            <label className={labelClass} htmlFor="mm-margin2">
              <span>Margin</span>
            </label>
            <FieldShell error={errors.margin2}>
              <input
                id="mm-margin2"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.margin2}
                aria-invalid={Boolean(errors.margin2)}
                onChange={(e) => setDriver2('margin', { margin2: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.margin2 ? (
              <p className="mt-1 text-xs text-rose-600">{errors.margin2}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mm-markup2">
              <span>Markup</span>
            </label>
            <FieldShell error={errors.markup2}>
              <input
                id="mm-markup2"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.markup2}
                aria-invalid={Boolean(errors.markup2)}
                onChange={(e) => setDriver2('markup', { markup2: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.markup2 ? (
              <p className="mt-1 text-xs text-rose-600">{errors.markup2}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mm-revenue2">
              <span>Revenue</span>
            </label>
            <FieldShell error={errors.revenue2}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {revenueSymbol}
              </span>
              <input
                id="mm-revenue2"
                className={inputClass}
                inputMode="decimal"
                value={input.revenue2}
                aria-invalid={Boolean(errors.revenue2)}
                onChange={(e) => setDriver2('revenue', { revenue2: e.target.value })}
              />
            </FieldShell>
            {errors.revenue2 ? (
              <p className="mt-1 text-xs text-rose-600">{errors.revenue2}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mm-profit2">
              <span>Profit</span>
            </label>
            <FieldShell error={errors.profit2}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {profitSymbol}
              </span>
              <input
                id="mm-profit2"
                className={inputClass}
                inputMode="decimal"
                value={input.profit2}
                aria-invalid={Boolean(errors.profit2)}
                onChange={(e) => setDriver2('profit', { profit2: e.target.value })}
              />
            </FieldShell>
            {errors.profit2 ? (
              <p className="mt-1 text-xs text-rose-600">{errors.profit2}</p>
            ) : null}
          </div>

          {result?.scenario2 ? (
            <p className="text-xs text-muted-foreground">
              Scenario 2 → margin {result.scenario2.formattedMargin}% · markup{' '}
              {result.scenario2.formattedMarkup}% · revenue {revenueSymbol}
              {result.scenario2.formattedRevenue} · profit {profitSymbol}
              {result.scenario2.formattedProfit}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
