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
  DebtToAssetRatioFieldErrors,
  DebtToAssetRatioInput,
  DebtToAssetRatioResult,
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

interface DebtToAssetRatioFormProps {
  input: DebtToAssetRatioInput;
  errors: DebtToAssetRatioFieldErrors;
  result: DebtToAssetRatioResult | null;
  onChange: (input: DebtToAssetRatioInput) => void;
}

export function DebtToAssetRatioForm({
  input,
  errors,
  result,
  onChange,
}: DebtToAssetRatioFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const longSymbol = getCurrencySymbol(input.longTermDebtCurrency);
  const shortSymbol = getCurrencySymbol(input.shortTermDebtCurrency);
  const totalDebtSymbol = getCurrencySymbol(input.totalDebtCurrency);
  const assetsSymbol = getCurrencySymbol(input.totalAssetsCurrency);

  const set = (patch: Partial<DebtToAssetRatioInput>) => {
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

  const ensurePair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (!canConvertPair(from, to)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return false;
    }
    return true;
  };

  const handleLongCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.longTermDebtCurrency) return;
    const nextAmount = convertFieldAmount(
      input.longTermDebt,
      input.longTermDebtCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.totalAssetsCurrency !== next &&
      !ensurePair(next, input.totalAssetsCurrency)
    ) {
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      longTermDebtCurrency: next,
      longTermDebt: nextAmount,
    });
  };

  const handleShortCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.shortTermDebtCurrency) return;
    const nextAmount = convertFieldAmount(
      input.shortTermDebt,
      input.shortTermDebtCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.totalAssetsCurrency !== next &&
      !ensurePair(next, input.totalAssetsCurrency)
    ) {
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      shortTermDebtCurrency: next,
      shortTermDebt: nextAmount,
    });
  };

  const handleTotalDebtCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalDebtCurrency) return;
    if (
      input.totalAssetsCurrency !== next &&
      !ensurePair(input.totalAssetsCurrency, next)
    ) {
      return;
    }
    setConversionError(null);
    onChange({ ...input, totalDebtCurrency: next });
  };

  const handleAssetsCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalAssetsCurrency) return;
    const nextAmount = convertFieldAmount(
      input.totalAssets,
      input.totalAssetsCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.longTermDebtCurrency !== next &&
      !ensurePair(input.longTermDebtCurrency, next)
    ) {
      return;
    }
    if (
      input.shortTermDebtCurrency !== next &&
      !ensurePair(input.shortTermDebtCurrency, next)
    ) {
      return;
    }
    if (
      input.totalDebtCurrency !== next &&
      !ensurePair(next, input.totalDebtCurrency)
    ) {
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      totalAssetsCurrency: next,
      totalAssets: nextAmount,
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
          Debt to Asset Ratio Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="dta-long">
            <span>Long-term debt</span>
            <InfoTooltip
              label="Long-term debt"
              text="Debt due beyond one year. Independent currency; normalized into total-assets currency before summing."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.longTermDebt}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {longSymbol}
              </span>
              <input
                id="dta-long"
                className={inputClass}
                inputMode="decimal"
                value={input.longTermDebt}
                aria-invalid={Boolean(errors.longTermDebt)}
                onChange={(e) => set({ longTermDebt: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dta-long-currency"
                value={input.longTermDebtCurrency}
                onChange={handleLongCurrencyChange}
                aria-label="Long-term debt currency"
              />
            </div>
          </div>
          {errors.longTermDebt ? (
            <p className="mt-1 text-xs text-rose-600">{errors.longTermDebt}</p>
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
          <label className={labelClass} htmlFor="dta-short">
            <span>Short-term debt</span>
            <InfoTooltip
              label="Short-term debt"
              text="Debt due within one year. Independent currency; normalized into total-assets currency before summing."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.shortTermDebt}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {shortSymbol}
              </span>
              <input
                id="dta-short"
                className={inputClass}
                inputMode="decimal"
                value={input.shortTermDebt}
                aria-invalid={Boolean(errors.shortTermDebt)}
                onChange={(e) => set({ shortTermDebt: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dta-short-currency"
                value={input.shortTermDebtCurrency}
                onChange={handleShortCurrencyChange}
                aria-label="Short-term debt currency"
              />
            </div>
          </div>
          {errors.shortTermDebt ? (
            <p className="mt-1 text-xs text-rose-600">{errors.shortTermDebt}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dta-total-debt">
            <span>Total debt</span>
            <InfoTooltip
              label="Total debt"
              text="Long-term + short-term debt after FX normalization. Currency selector only re-expresses this calculated amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {totalDebtSymbol}
              </span>
              <input
                id="dta-total-debt"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalDebt : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dta-total-debt-currency"
                value={input.totalDebtCurrency}
                onChange={handleTotalDebtCurrencyChange}
                aria-label="Total debt currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="dta-assets">
            <span>Total assets</span>
            <InfoTooltip
              label="Total assets"
              text="Must be greater than zero. Calculation currency for the ratio — debts normalize into this currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalAssets}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {assetsSymbol}
              </span>
              <input
                id="dta-assets"
                className={inputClass}
                inputMode="decimal"
                value={input.totalAssets}
                aria-invalid={Boolean(errors.totalAssets)}
                onChange={(e) => set({ totalAssets: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dta-assets-currency"
                value={input.totalAssetsCurrency}
                onChange={handleAssetsCurrencyChange}
                aria-label="Total assets currency"
              />
            </div>
          </div>
          {errors.totalAssets ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalAssets}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dta-ratio">
            <span>Debt to assets ratio</span>
            <InfoTooltip
              label="Debt to assets ratio"
              text="(Total debt ÷ total assets) × 100 after FX normalization. Not capped at 100%. Percentage is never currency-converted."
            />
          </label>
          <FieldShell muted>
            <input
              id="dta-ratio"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedRatioPercent : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
