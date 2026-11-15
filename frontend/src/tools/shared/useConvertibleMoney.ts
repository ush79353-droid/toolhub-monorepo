'use client';

import * as React from 'react';
import { convertCurrency, normalizeAmountsToCurrency } from './convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from './currency-rates';
import {
  createMoneyValue,
  moneyAmountToInputString,
  parseMoneyInput,
  type MoneyValue,
} from './money-value';

export interface ConvertibleMoneyField {
  value: MoneyValue;
  /** Text shown in the amount input (may be mid-edit). */
  displayText: string;
  conversionError: string | null;
  setAmountText: (text: string) => void;
  /** Converts the canonical amount into `nextCurrency` when rates allow. */
  setCurrency: (nextCurrency: string) => boolean;
  /** Canonical amount for engines (NaN if blank). */
  canonicalAmount: number;
  currency: string;
  commitDisplayText: () => void;
}

/**
 * Conversion-aware money field state.
 * - Currency change converts the unrounded canonical amount (no display rounding).
 * - Amount edits update canonical value in the current currency.
 * - Does not invent rates; returns false / error when conversion is unavailable.
 */
export function useConvertibleMoneyField(options: {
  value: MoneyValue;
  onChange: (next: MoneyValue) => void;
  rates: CurrencyRatesSnapshot | null | undefined;
}): ConvertibleMoneyField {
  const { value, onChange, rates } = options;
  const [displayText, setDisplayText] = React.useState(() =>
    moneyAmountToInputString(value.amount)
  );
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const lastSyncedAmount = React.useRef(value.amount);
  const lastSyncedCurrency = React.useRef(value.currency);

  React.useEffect(() => {
    if (
      value.amount === lastSyncedAmount.current &&
      value.currency === lastSyncedCurrency.current
    ) {
      return;
    }
    lastSyncedAmount.current = value.amount;
    lastSyncedCurrency.current = value.currency;
    setDisplayText(moneyAmountToInputString(value.amount));
    setConversionError(null);
  }, [value.amount, value.currency]);

  const setAmountText = (text: string) => {
    setDisplayText(text);
    setConversionError(null);
    const parsed = parseMoneyInput(text);
    const next = createMoneyValue(parsed, value.currency);
    lastSyncedAmount.current = next.amount;
    lastSyncedCurrency.current = next.currency;
    onChange(next);
  };

  const commitDisplayText = () => {
    const parsed = parseMoneyInput(displayText);
    const next = createMoneyValue(parsed, value.currency);
    setDisplayText(moneyAmountToInputString(next.amount));
    lastSyncedAmount.current = next.amount;
    lastSyncedCurrency.current = next.currency;
    onChange(next);
  };

  const setCurrency = (nextCurrency: string): boolean => {
    const next = nextCurrency.trim().toUpperCase();
    if (!next || next === value.currency) return true;

    if (!Number.isFinite(value.amount)) {
      const blank = createMoneyValue(Number.NaN, next);
      lastSyncedAmount.current = blank.amount;
      lastSyncedCurrency.current = blank.currency;
      setDisplayText('');
      setConversionError(null);
      onChange(blank);
      return true;
    }

    if (!rates?.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return false;
    }

    const converted = convertCurrency({
      amount: value.amount,
      from: value.currency,
      to: next,
      rates: rates.rates,
    });

    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return false;
    }

    const money = createMoneyValue(converted.amount, next);
    lastSyncedAmount.current = money.amount;
    lastSyncedCurrency.current = money.currency;
    setDisplayText(moneyAmountToInputString(money.amount));
    setConversionError(null);
    onChange(money);
    return true;
  };

  return {
    value,
    displayText,
    conversionError,
    setAmountText,
    setCurrency,
    canonicalAmount: value.amount,
    currency: value.currency,
    commitDisplayText,
  };
}

/**
 * Normalize many convertible fields into one currency for calculation engines.
 */
export function normalizeMoneyValues(
  values: readonly MoneyValue[],
  targetCurrency: string,
  rates: CurrencyRatesSnapshot | null | undefined
): number[] | null {
  if (!rates?.available) return null;
  return normalizeAmountsToCurrency(values, targetCurrency, rates.rates);
}
