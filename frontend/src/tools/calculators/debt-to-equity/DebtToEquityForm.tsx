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
  DebtToEquityFieldErrors,
  DebtToEquityInput,
  DebtToEquityResult,
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

interface DebtToEquityFormProps {
  input: DebtToEquityInput;
  errors: DebtToEquityFieldErrors;
  result: DebtToEquityResult | null;
  onChange: (input: DebtToEquityInput) => void;
}

export function DebtToEquityForm({
  input,
  errors,
  result,
  onChange,
}: DebtToEquityFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const liabilitiesSymbol = getCurrencySymbol(input.totalLiabilitiesCurrency);
  const equitySymbol = getCurrencySymbol(input.stockholdersEquityCurrency);

  const set = (patch: Partial<DebtToEquityInput>) => {
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

  const handleLiabilitiesCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalLiabilitiesCurrency) return;

    const amount = parseMoneyInput(input.totalLiabilities);
    if (!Number.isFinite(amount)) {
      if (
        input.stockholdersEquityCurrency !== next &&
        !canConvertPair(next, input.stockholdersEquityCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, totalLiabilitiesCurrency: next });
      return;
    }

    if (!canConvertPair(input.totalLiabilitiesCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (
      input.stockholdersEquityCurrency !== next &&
      !canConvertPair(next, input.stockholdersEquityCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.totalLiabilitiesCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      totalLiabilitiesCurrency: next,
      totalLiabilities: moneyAmountToInputString(converted),
    });
  };

  const handleEquityCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.stockholdersEquityCurrency) return;

    const amount = parseMoneyInput(input.stockholdersEquity);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, stockholdersEquityCurrency: next });
      return;
    }

    if (!canConvertPair(input.stockholdersEquityCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.stockholdersEquityCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      stockholdersEquityCurrency: next,
      stockholdersEquity: moneyAmountToInputString(converted),
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
          Debt to Equity Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="dte-liabilities">
            <span>Total liabilities (D)</span>
            <InfoTooltip
              label="Total liabilities (D)"
              text="All liabilities for the period. This is total liabilities, not interest-bearing debt only."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalLiabilities}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {liabilitiesSymbol}
              </span>
              <input
                id="dte-liabilities"
                className={inputClass}
                inputMode="decimal"
                value={input.totalLiabilities}
                aria-invalid={Boolean(errors.totalLiabilities)}
                onChange={(e) => set({ totalLiabilities: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dte-liabilities-currency"
                value={input.totalLiabilitiesCurrency}
                onChange={handleLiabilitiesCurrencyChange}
                aria-label="Total liabilities currency"
              />
            </div>
          </div>
          {errors.totalLiabilities ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalLiabilities}</p>
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
          <label className={labelClass} htmlFor="dte-equity">
            <span>Stockholders&apos; equity (E)</span>
            <InfoTooltip
              label="Stockholders' equity (E)"
              text="Book equity for the same reporting date. Must be nonzero. May use a different currency than liabilities."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.stockholdersEquity}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {equitySymbol}
              </span>
              <input
                id="dte-equity"
                className={inputClass}
                inputMode="decimal"
                value={input.stockholdersEquity}
                aria-invalid={Boolean(errors.stockholdersEquity)}
                onChange={(e) => set({ stockholdersEquity: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dte-equity-currency"
                value={input.stockholdersEquityCurrency}
                onChange={handleEquityCurrencyChange}
                aria-label="Stockholders' equity currency"
              />
            </div>
          </div>
          {errors.stockholdersEquity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.stockholdersEquity}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dte-result">
            <span>Debt to equity ratio (D/E)</span>
            <InfoTooltip
              label="Debt to equity ratio (D/E)"
              text="Total liabilities ÷ stockholders' equity after normalizing both amounts into the liabilities currency. Dimensionless — no currency symbol."
            />
          </label>
          <FieldShell muted>
            <input
              id="dte-result"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedRatio : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
