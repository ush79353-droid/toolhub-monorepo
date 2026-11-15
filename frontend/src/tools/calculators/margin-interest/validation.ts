import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateMarginInterestInBorrowed,
  formatMarginInterestAmount,
} from './calculation';
import type {
  MarginInterestFieldErrors,
  MarginInterestInput,
  MarginInterestResult,
} from './types';

export interface MarginInterestValidation {
  isValid: boolean;
  errors: MarginInterestFieldErrors;
  result: MarginInterestResult | null;
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
 * Validates inputs, computes interest in the borrowed currency at full precision,
 * then converts that interest into `resultCurrency` before display rounding.
 */
export function validateMarginInterestInput(
  input: MarginInterestInput,
  rates?: CurrencyRatesSnapshot | null
): MarginInterestValidation {
  const errors: MarginInterestFieldErrors = {};

  const amount = parseNumber(input.amountBorrowed);
  const rate = parseNumber(input.interestRatePercent);
  const days = parseNumber(input.numberOfDays);

  if (!amount.blank && (amount.invalid || amount.value === null)) {
    errors.amountBorrowed = 'Enter a valid amount borrowed.';
  } else if (!amount.blank && amount.value !== null && amount.value < 0) {
    errors.amountBorrowed = 'Amount borrowed cannot be negative.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (!days.blank && (days.invalid || days.value === null)) {
    errors.numberOfDays = 'Enter a valid number of days.';
  } else if (!days.blank && days.value !== null && days.value < 0) {
    errors.numberOfDays = 'Number of days cannot be negative.';
  }

  const incomplete =
    amount.blank || rate.blank || days.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const interestInBorrowed = calculateMarginInterestInBorrowed({
    amountBorrowed: amount.value!,
    interestRatePercent: rate.value!,
    numberOfDays: days.value!,
  });

  if (interestInBorrowed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  let marginInterestInResult = interestInBorrowed;
  if (input.resultCurrency !== input.currency) {
    if (!rates?.available) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    const converted = convertCurrency({
      amount: interestInBorrowed,
      from: input.currency,
      to: input.resultCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    marginInterestInResult = converted.amount;
  }

  const result: MarginInterestResult = {
    marginInterest: marginInterestInResult,
    marginInterestInBorrowed: interestInBorrowed,
    currency: input.resultCurrency,
    borrowedCurrency: input.currency,
    formattedMarginInterest: formatMarginInterestAmount(
      marginInterestInResult,
      input.resultCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
