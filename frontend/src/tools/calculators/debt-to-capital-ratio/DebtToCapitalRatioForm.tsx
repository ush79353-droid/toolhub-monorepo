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
  DebtToCapitalRatioFieldErrors,
  DebtToCapitalRatioInput,
  DebtToCapitalRatioResult,
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

interface DebtToCapitalRatioFormProps {
  input: DebtToCapitalRatioInput;
  errors: DebtToCapitalRatioFieldErrors;
  result: DebtToCapitalRatioResult | null;
  onChange: (input: DebtToCapitalRatioInput) => void;
}

export function DebtToCapitalRatioForm({
  input,
  errors,
  result,
  onChange,
}: DebtToCapitalRatioFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const debtSymbol = getCurrencySymbol(input.interestBearingDebtCurrency);
  const equitySymbol = getCurrencySymbol(input.shareholdersEquityCurrency);

  const set = (patch: Partial<DebtToCapitalRatioInput>) => {
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

  const handleDebtCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.interestBearingDebtCurrency) return;

    const amount = parseMoneyInput(input.interestBearingDebt);
    if (!Number.isFinite(amount)) {
      if (
        input.shareholdersEquityCurrency !== next &&
        !canConvertPair(next, input.shareholdersEquityCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, interestBearingDebtCurrency: next });
      return;
    }

    if (!canConvertPair(input.interestBearingDebtCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (
      input.shareholdersEquityCurrency !== next &&
      !canConvertPair(next, input.shareholdersEquityCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(
      amount,
      input.interestBearingDebtCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      interestBearingDebtCurrency: next,
      interestBearingDebt: moneyAmountToInputString(converted),
    });
  };

  const handleEquityCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.shareholdersEquityCurrency) return;

    const amount = parseMoneyInput(input.shareholdersEquity);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, shareholdersEquityCurrency: next });
      return;
    }

    if (!canConvertPair(input.shareholdersEquityCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(
      amount,
      input.shareholdersEquityCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      shareholdersEquityCurrency: next,
      shareholdersEquity: moneyAmountToInputString(converted),
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
          Debt-to-Capital Ratio Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="dtc-debt">
            <span>Interest bearing debt</span>
            <InfoTooltip
              label="Interest bearing debt"
              text="Interest-bearing liabilities such as loans, bonds, and notes used in the capital structure."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.interestBearingDebt}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {debtSymbol}
              </span>
              <input
                id="dtc-debt"
                className={inputClass}
                inputMode="decimal"
                value={input.interestBearingDebt}
                aria-invalid={Boolean(errors.interestBearingDebt)}
                onChange={(e) => set({ interestBearingDebt: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dtc-debt-currency"
                value={input.interestBearingDebtCurrency}
                onChange={handleDebtCurrencyChange}
                aria-label="Interest bearing debt currency"
              />
            </div>
          </div>
          {errors.interestBearingDebt ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestBearingDebt}</p>
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
          <label className={labelClass} htmlFor="dtc-equity">
            <span>Shareholder’s equity</span>
            <InfoTooltip
              label="Shareholder’s equity"
              text="Book equity for the same period. May use a different currency than debt."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.shareholdersEquity}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {equitySymbol}
              </span>
              <input
                id="dtc-equity"
                className={inputClass}
                inputMode="decimal"
                value={input.shareholdersEquity}
                aria-invalid={Boolean(errors.shareholdersEquity)}
                onChange={(e) => set({ shareholdersEquity: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dtc-equity-currency"
                value={input.shareholdersEquityCurrency}
                onChange={handleEquityCurrencyChange}
                aria-label="Shareholder’s equity currency"
              />
            </div>
          </div>
          {errors.shareholdersEquity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.shareholdersEquity}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dtc-result">
            <span>Debt to capital ratio</span>
            <InfoTooltip
              label="Debt to capital ratio"
              text="Debt ÷ (Debt + Equity) after normalizing both amounts into the debt currency. Dimensionless; no currency symbol."
            />
          </label>
          <FieldShell muted>
            <input
              id="dtc-result"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedDebtToCapitalRatio : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
