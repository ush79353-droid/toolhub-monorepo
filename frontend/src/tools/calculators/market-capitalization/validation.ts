import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateMarketCapitalization,
  formatCompactMarketCap,
  formatMarketCapMoney,
  interpretMarketCap,
} from './calculation';
import type {
  MarketCapitalizationFieldErrors,
  MarketCapitalizationInput,
  MarketCapitalizationResult,
} from './types';

export interface MarketCapitalizationValidation {
  isValid: boolean;
  errors: MarketCapitalizationFieldErrors;
  result: MarketCapitalizationResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function parseWholeShares(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  fractional: boolean;
  unsafe: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return {
      value: null,
      blank: true,
      invalid: false,
      fractional: false,
      unsafe: false,
    };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return {
      value: null,
      blank: false,
      invalid: true,
      fractional: false,
      unsafe: false,
    };
  }
  if (/^-?\d+\.\d*[1-9]\d*$/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      invalid: false,
      fractional: true,
      unsafe: false,
    };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return {
      value: null,
      blank: false,
      invalid: true,
      fractional: false,
      unsafe: false,
    };
  }
  if (!Number.isInteger(value)) {
    return {
      value: null,
      blank: false,
      invalid: false,
      fractional: true,
      unsafe: false,
    };
  }
  if (!Number.isSafeInteger(value)) {
    return {
      value: null,
      blank: false,
      invalid: false,
      fractional: false,
      unsafe: true,
    };
  }
  return {
    value,
    blank: false,
    invalid: false,
    fractional: false,
    unsafe: false,
  };
}

export function validateMarketCapitalizationInput(
  input: MarketCapitalizationInput
): MarketCapitalizationValidation {
  const errors: MarketCapitalizationFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasFieldError = false;

  const price = parseNumber(input.sharePrice);
  if (price.blank) {
    errors.sharePrice = 'Enter the price of a single share.';
    hasFieldError = true;
  } else if (price.invalid || price.value === null) {
    errors.sharePrice = 'Enter a valid share price.';
    hasFieldError = true;
  } else if (price.value < 0) {
    errors.sharePrice = 'Share price cannot be negative.';
    hasFieldError = true;
  }

  const shares = parseWholeShares(input.outstandingShares);
  if (shares.blank) {
    errors.outstandingShares = 'Enter the number of outstanding shares.';
    hasFieldError = true;
  } else if (shares.fractional) {
    errors.outstandingShares =
      'Outstanding shares must be a whole number (no fractions).';
    hasFieldError = true;
  } else if (shares.unsafe) {
    errors.outstandingShares =
      'Outstanding shares exceed the supported numeric range.';
    hasFieldError = true;
  } else if (shares.invalid || shares.value === null) {
    errors.outstandingShares = 'Enter a valid number of outstanding shares.';
    hasFieldError = true;
  } else if (shares.value <= 0) {
    errors.outstandingShares =
      'Outstanding shares must be greater than zero.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (price.value === null || shares.value === null) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateMarketCapitalization({
    sharePrice: price.value,
    outstandingShares: shares.value,
  });

  if (math === null) {
    errors.form =
      'Unable to calculate market capitalization with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const full = formatMarketCapMoney(math.marketCapitalization, currency);
  const compact = formatCompactMarketCap(math.marketCapitalization, currency);

  const result: MarketCapitalizationResult = {
    marketCapitalization: math.marketCapitalization,
    currency,
    formattedMarketCap: `${symbol}${full}`,
    compactMarketCap: `${symbol}${compact}`,
    interpretation: interpretMarketCap(
      math.marketCapitalization,
      symbol,
      currency
    ),
    warningMessage:
      'Market capitalization is equity market value (price × outstanding shares). It excludes debt and cash and is not the same as enterprise value or company net worth.',
  };

  return { isValid: true, errors, result };
}
