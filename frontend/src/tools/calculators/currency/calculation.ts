/**
 * Currency conversion using a stored base FX map (ADR-021):
 * converted = amount × rates[to] / rates[from]
 *
 * Full internal precision. Round only for display helpers below.
 */

import {
  convertCurrency,
  formatConvertedMoney,
  roundMoneyAmount,
} from '@/tools/shared/convert-currency';
import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';

export interface CurrencyConversionComputation {
  amount: number;
  convertedAmount: number;
  rateFromTo: number;
  rateToFrom: number;
  sameCurrency: boolean;
}

export function formatCurrencyAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  const rounded = roundMoneyAmount(amount, currency);
  if (rounded === null) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(rounded);
}

/** Cross rates need more decimals than money amounts. */
export function formatFxRate(rate: number): string {
  if (!Number.isFinite(rate)) return '';
  const abs = Math.abs(rate);
  let digits = 6;
  if (abs >= 100) digits = 4;
  else if (abs >= 1) digits = 6;
  else if (abs >= 0.01) digits = 8;
  else digits = 10;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(rate);
}

export function formatCurrencyMoneyStyle(
  amount: number,
  currency: SupportedCurrency
): string | null {
  return formatConvertedMoney(amount, currency);
}

/**
 * Convert `amount` from → to using the snapshot map.
 * Same-currency returns identity without needing rates.
 * Missing/invalid rates → null (never silent 1:1).
 */
export function convertAmountWithRates(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): CurrencyConversionComputation | null {
  if (!Number.isFinite(amount) || amount < 0) return null;

  if (from === to) {
    return {
      amount,
      convertedAmount: amount,
      rateFromTo: 1,
      rateToFrom: 1,
      sameCurrency: true,
    };
  }

  if (!rates?.available) return null;

  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) return null;

  const oneUnit = convertCurrency({
    amount: 1,
    from,
    to,
    rates: rates.rates,
  });
  if (!oneUnit.ok || !(oneUnit.amount > 0) || !Number.isFinite(oneUnit.amount)) {
    return null;
  }

  const rateFromTo = oneUnit.amount;
  const rateToFrom = 1 / rateFromTo;
  if (!Number.isFinite(rateToFrom) || !(rateToFrom > 0)) return null;

  return {
    amount,
    convertedAmount: converted.amount,
    rateFromTo,
    rateToFrom,
    sameCurrency: false,
  };
}
