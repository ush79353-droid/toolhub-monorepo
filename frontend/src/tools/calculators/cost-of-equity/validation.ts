import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateCostOfEquityDividend } from './calculation';
import type {
  CostOfEquityFieldErrors,
  CostOfEquityInput,
  CostOfEquityResult,
} from './types';

export interface CostOfEquityValidation {
  isValid: boolean;
  errors: CostOfEquityFieldErrors;
  result: CostOfEquityResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

/**
 * Validates inputs and computes cost of equity.
 * When dividend and share-price currencies differ, both amounts are normalized
 * into the share-price currency (full precision) before (D₁ / P₀) × 100 + g.
 */
export function validateCostOfEquityInput(
  input: CostOfEquityInput,
  rates?: CurrencyRatesSnapshot | null
): CostOfEquityValidation {
  if (input.mode !== 'dividend') {
    return {
      isValid: false,
      errors: {
        form: 'Non-dividend (CAPM) fields are not confirmed by the reference screenshot.',
      },
      result: null,
    };
  }

  const errors: CostOfEquityFieldErrors = {};

  const dividend = parseNumber(input.dividendPerShare);
  const price = parseNumber(input.sharePrice);
  const growth = parseNumber(input.growthRatePercent);

  if (!dividend.blank && (dividend.invalid || dividend.value === null)) {
    errors.dividendPerShare = 'Enter a valid dividend per share.';
  } else if (!dividend.blank && dividend.value !== null && dividend.value < 0) {
    errors.dividendPerShare = 'Dividend cannot be negative.';
  }

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.sharePrice = 'Enter a valid current share price.';
  } else if (!price.blank && price.value !== null && !(price.value > 0)) {
    errors.sharePrice = 'Share price must be greater than zero.';
  }

  if (!growth.blank && (growth.invalid || growth.value === null)) {
    errors.growthRatePercent = 'Enter a valid growth rate.';
  }

  const allBlank = dividend.blank && price.blank && growth.blank;
  if (allBlank) {
    return { isValid: false, errors, result: null };
  }

  if (
    dividend.blank ||
    price.blank ||
    growth.blank ||
    Object.keys(errors).length > 0 ||
    dividend.value === null ||
    price.value === null ||
    growth.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  let dividendNormalized = dividend.value;
  const sharePriceNormalized = price.value;

  if (input.dividendCurrency !== input.sharePriceCurrency) {
    if (!rates?.available) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    const convertedDividend = convertCurrency({
      amount: dividend.value,
      from: input.dividendCurrency,
      to: input.sharePriceCurrency,
      rates: rates.rates,
    });
    if (!convertedDividend.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    dividendNormalized = convertedDividend.amount;
  }

  const result = calculateCostOfEquityDividend({
    dividendPerShare: dividendNormalized,
    sharePrice: sharePriceNormalized,
    growthRatePercent: growth.value,
  });

  if (!result) {
    errors.form = 'Unable to calculate a finite cost of equity.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
