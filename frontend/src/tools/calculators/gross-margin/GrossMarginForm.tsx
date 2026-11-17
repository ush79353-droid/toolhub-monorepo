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
  GrossMarginFieldErrors,
  GrossMarginInput,
  GrossMarginResult,
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

interface GrossMarginFormProps {
  input: GrossMarginInput;
  errors: GrossMarginFieldErrors;
  result: GrossMarginResult | null;
  onChange: (input: GrossMarginInput) => void;
}

export function GrossMarginForm({
  input,
  errors,
  result,
  onChange,
}: GrossMarginFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const revenueSymbol = getCurrencySymbol(input.revenueCurrency);
  const cogsSymbol = getCurrencySymbol(input.cogsCurrency);
  const profitSymbol = getCurrencySymbol(input.profitCurrency);

  const set = (patch: Partial<GrossMarginInput>) => {
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

  const handleRevenueCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.revenueCurrency) return;

    const amount = parseMoneyInput(input.revenue);
    if (!Number.isFinite(amount)) {
      if (
        (input.cogsCurrency !== next && !canConvertPair(next, input.cogsCurrency)) ||
        (input.profitCurrency !== next && !canConvertPair(next, input.profitCurrency))
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, revenueCurrency: next });
      return;
    }

    if (!canConvertPair(input.revenueCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.revenueCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      revenueCurrency: next,
      revenue: moneyAmountToInputString(converted),
    });
  };

  const handleCogsCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.cogsCurrency) return;

    const amount = parseMoneyInput(input.cogs);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, cogsCurrency: next });
      return;
    }

    if (!canConvertPair(input.cogsCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.cogsCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      cogsCurrency: next,
      cogs: moneyAmountToInputString(converted),
    });
  };

  const handleProfitCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.profitCurrency) return;
    if (next !== input.revenueCurrency && !canConvertPair(input.revenueCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, profitCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Gross profit</legend>

        <div>
          <label className={labelClass} htmlFor="gm-revenue">
            <span>Revenue</span>
            <InfoTooltip
              label="Revenue"
              text="Period sales revenue. Must be nonzero. Calculation currency for gross profit and margin."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.revenue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {revenueSymbol}
              </span>
              <input
                id="gm-revenue"
                className={inputClass}
                inputMode="decimal"
                value={input.revenue}
                aria-invalid={Boolean(errors.revenue)}
                onChange={(e) => set({ revenue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="gm-revenue-currency"
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
          <label className={labelClass} htmlFor="gm-cogs">
            <span>Cost of goods sold (COGS)</span>
            <InfoTooltip
              label="Cost of goods sold"
              text="Direct costs of goods sold for the same period. Normalized into the revenue currency before subtracting."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.cogs}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {cogsSymbol}
              </span>
              <input
                id="gm-cogs"
                className={inputClass}
                inputMode="decimal"
                value={input.cogs}
                aria-invalid={Boolean(errors.cogs)}
                onChange={(e) => set({ cogs: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="gm-cogs-currency"
                value={input.cogsCurrency}
                onChange={handleCogsCurrencyChange}
                aria-label="COGS currency"
              />
            </div>
          </div>
          {errors.cogs ? <p className="mt-1 text-xs text-rose-600">{errors.cogs}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="gm-profit">
            <span>Gross profit</span>
            <InfoTooltip
              label="Gross profit"
              text="Revenue minus COGS. Display currency is independent; the margin percent is never currency-converted."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {profitSymbol}
              </span>
              <input
                id="gm-profit"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedGrossProfit : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="gm-profit-currency"
                value={input.profitCurrency}
                onChange={handleProfitCurrencyChange}
                aria-label="Gross profit currency"
              />
            </div>
          </div>
        </div>

        {conversionError || ratesStatus.warning ? (
          <p
            className={`text-xs ${conversionError ? 'text-rose-600' : 'text-amber-700'}`}
            role="status"
          >
            {conversionError || ratesStatus.warning}
          </p>
        ) : null}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Gross margin</legend>
        <div>
          <label className={labelClass} htmlFor="gm-margin">
            <span>Gross margin</span>
          </label>
          <FieldShell muted>
            <input
              id="gm-margin"
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
      </fieldset>
    </form>
  );
}
