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
  NetProfitMarginFieldErrors,
  NetProfitMarginInput,
  NetProfitMarginResult,
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

interface NetProfitMarginFormProps {
  input: NetProfitMarginInput;
  errors: NetProfitMarginFieldErrors;
  result: NetProfitMarginResult | null;
  onChange: (input: NetProfitMarginInput) => void;
}

export function NetProfitMarginForm({
  input,
  errors,
  result,
  onChange,
}: NetProfitMarginFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const profitSymbol = getCurrencySymbol(input.netProfitCurrency);
  const revenueSymbol = getCurrencySymbol(input.totalRevenuesCurrency);

  const set = (patch: Partial<NetProfitMarginInput>) => {
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

  const handleProfitCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.netProfitCurrency) return;

    const amount = parseMoneyInput(input.netProfit);
    if (!Number.isFinite(amount)) {
      if (
        input.totalRevenuesCurrency !== next &&
        !canConvertPair(next, input.totalRevenuesCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, netProfitCurrency: next });
      return;
    }

    if (!canConvertPair(input.netProfitCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.netProfitCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      netProfitCurrency: next,
      netProfit: moneyAmountToInputString(converted),
    });
  };

  const handleRevenueCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalRevenuesCurrency) return;

    const amount = parseMoneyInput(input.totalRevenues);
    if (!Number.isFinite(amount)) {
      if (
        input.netProfitCurrency !== next &&
        !canConvertPair(input.netProfitCurrency, next)
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

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="space-y-3.5">
        <div>
          <label className={labelClass} htmlFor="npm-net-profit">
            <span>Net profit</span>
            <InfoTooltip
              label="Net profit"
              text="Profit after all relevant expenses and taxes for the period. Negative values are allowed and produce a negative margin."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.netProfit}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {profitSymbol}
              </span>
              <input
                id="npm-net-profit"
                className={inputClass}
                inputMode="decimal"
                value={input.netProfit}
                aria-invalid={Boolean(errors.netProfit)}
                onChange={(e) => set({ netProfit: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="npm-net-profit-currency"
                value={input.netProfitCurrency}
                onChange={handleProfitCurrencyChange}
                aria-label="Net profit currency"
              />
            </div>
          </div>
          {errors.netProfit ? (
            <p className="mt-1 text-xs text-rose-600">{errors.netProfit}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="npm-total-revenues">
            <span>Total revenues</span>
            <InfoTooltip
              label="Total revenues"
              text="Period revenue before expenses. Must be greater than zero. Net profit is normalized into this currency before dividing."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalRevenues}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {revenueSymbol}
              </span>
              <input
                id="npm-total-revenues"
                className={inputClass}
                inputMode="decimal"
                value={input.totalRevenues}
                aria-invalid={Boolean(errors.totalRevenues)}
                onChange={(e) => set({ totalRevenues: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="npm-total-revenues-currency"
                value={input.totalRevenuesCurrency}
                onChange={handleRevenueCurrencyChange}
                aria-label="Total revenues currency"
              />
            </div>
          </div>
          {errors.totalRevenues ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalRevenues}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="npm-margin">
            <span>Net profit margin</span>
            <InfoTooltip
              label="Net profit margin"
              text="(Net profit ÷ Total revenues) × 100. Distinct from gross margin (after COGS only) and operating margin (after operating expenses). The percentage is never currency-converted."
            />
          </label>
          <FieldShell muted>
            <input
              id="npm-margin"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedMarginPercent : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-primary">
              %
            </span>
          </FieldShell>
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
      </div>
    </form>
  );
}
