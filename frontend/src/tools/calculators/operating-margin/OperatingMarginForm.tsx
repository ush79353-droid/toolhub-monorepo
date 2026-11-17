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
  OperatingMarginFieldErrors,
  OperatingMarginInput,
  OperatingMarginResult,
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

interface OperatingMarginFormProps {
  input: OperatingMarginInput;
  errors: OperatingMarginFieldErrors;
  result: OperatingMarginResult | null;
  onChange: (input: OperatingMarginInput) => void;
}

export function OperatingMarginForm({
  input,
  errors,
  result,
  onChange,
}: OperatingMarginFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const revenueSymbol = getCurrencySymbol(input.revenueCurrency);
  const cogsSymbol = getCurrencySymbol(input.cogsCurrency);
  const opexSymbol = getCurrencySymbol(input.operatingExpensesCurrency);
  const incomeSymbol = getCurrencySymbol(input.operatingIncomeCurrency);

  const set = (patch: Partial<OperatingMarginInput>) => {
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
        (input.operatingExpensesCurrency !== next &&
          !canConvertPair(next, input.operatingExpensesCurrency)) ||
        (input.operatingIncomeCurrency !== next &&
          !canConvertPair(next, input.operatingIncomeCurrency))
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

  const handleOpexCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.operatingExpensesCurrency) return;

    const amount = parseMoneyInput(input.operatingExpenses);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, operatingExpensesCurrency: next });
      return;
    }

    if (!canConvertPair(input.operatingExpensesCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(
      amount,
      input.operatingExpensesCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      operatingExpensesCurrency: next,
      operatingExpenses: moneyAmountToInputString(converted),
    });
  };

  const handleIncomeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.operatingIncomeCurrency) return;
    if (
      next !== input.revenueCurrency &&
      !canConvertPair(input.revenueCurrency, next)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, operatingIncomeCurrency: next });
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
          Operating income
        </legend>

        <div>
          <label className={labelClass} htmlFor="om-revenue">
            <span>Revenue</span>
            <InfoTooltip
              label="Revenue"
              text="Period sales revenue. Must be nonzero. Calculation currency for operating income and margin."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.revenue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {revenueSymbol}
              </span>
              <input
                id="om-revenue"
                className={inputClass}
                inputMode="decimal"
                value={input.revenue}
                aria-invalid={Boolean(errors.revenue)}
                onChange={(e) => set({ revenue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="om-revenue-currency"
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
          <label className={labelClass} htmlFor="om-cogs">
            <span>Cost of goods sold</span>
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
                id="om-cogs"
                className={inputClass}
                inputMode="decimal"
                value={input.cogs}
                aria-invalid={Boolean(errors.cogs)}
                onChange={(e) => set({ cogs: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="om-cogs-currency"
                value={input.cogsCurrency}
                onChange={handleCogsCurrencyChange}
                aria-label="Cost of goods sold currency"
              />
            </div>
          </div>
          {errors.cogs ? <p className="mt-1 text-xs text-rose-600">{errors.cogs}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="om-opex">
            <span>Operating expenses</span>
            <InfoTooltip
              label="Operating expenses"
              text="Selling, general, and administrative (and similar) operating expenses for the same period. Normalized into the revenue currency before subtracting."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.operatingExpenses}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {opexSymbol}
              </span>
              <input
                id="om-opex"
                className={inputClass}
                inputMode="decimal"
                value={input.operatingExpenses}
                aria-invalid={Boolean(errors.operatingExpenses)}
                onChange={(e) => set({ operatingExpenses: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="om-opex-currency"
                value={input.operatingExpensesCurrency}
                onChange={handleOpexCurrencyChange}
                aria-label="Operating expenses currency"
              />
            </div>
          </div>
          {errors.operatingExpenses ? (
            <p className="mt-1 text-xs text-rose-600">{errors.operatingExpenses}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="om-income">
            <span>Operating income</span>
            <InfoTooltip
              label="Operating income"
              text="Revenue − COGS − operating expenses. Display currency is independent; the margin percent is never currency-converted."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {incomeSymbol}
              </span>
              <input
                id="om-income"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedOperatingIncome : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="om-income-currency"
                value={input.operatingIncomeCurrency}
                onChange={handleIncomeCurrencyChange}
                aria-label="Operating income currency"
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
        <legend className="px-1 text-[13px] font-semibold text-accent">Result</legend>
        <div>
          <label className={labelClass} htmlFor="om-margin">
            <span>Operating margin</span>
          </label>
          <FieldShell muted>
            <input
              id="om-margin"
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
