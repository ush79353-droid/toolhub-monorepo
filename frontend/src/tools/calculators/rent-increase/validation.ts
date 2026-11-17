import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateRentIncrease,
  formatRentIncreaseMoney,
} from './calculation';
import type {
  RentIncreaseFieldErrors,
  RentIncreaseInput,
  RentIncreaseResult,
} from './types';

export interface RentIncreaseValidation {
  isValid: boolean;
  errors: RentIncreaseFieldErrors;
  result: RentIncreaseResult | null;
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
 * Validates inputs, computes future rent in the current-rent currency at full
 * precision, then converts into `futureRentCurrency` before display rounding.
 */
export function validateRentIncreaseInput(
  input: RentIncreaseInput,
  rates?: CurrencyRatesSnapshot | null
): RentIncreaseValidation {
  const errors: RentIncreaseFieldErrors = {};

  const rent = parseNumber(input.currentAnnualRent);
  const change = parseNumber(input.averageRentChangePercent);
  const years = parseNumber(input.numberOfYears);

  if (!rent.blank && (rent.invalid || rent.value === null)) {
    errors.currentAnnualRent = 'Enter a valid current annual rent.';
  } else if (!rent.blank && rent.value !== null && rent.value < 0) {
    errors.currentAnnualRent = 'Current annual rent cannot be negative.';
  }

  if (!change.blank && (change.invalid || change.value === null)) {
    errors.averageRentChangePercent = 'Enter a valid average rent change.';
  } else if (!change.blank && change.value !== null && !(change.value >= -100)) {
    errors.averageRentChangePercent =
      'Average rent change must be greater than or equal to −100%.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.numberOfYears = 'Enter a valid number of years.';
  } else if (!years.blank && years.value !== null && years.value < 0) {
    errors.numberOfYears = 'Number of years cannot be negative.';
  }

  const incomplete =
    rent.blank || change.blank || years.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const futureInCurrent = calculateRentIncrease({
    currentAnnualRent: rent.value!,
    averageRentChangePercent: change.value!,
    numberOfYears: years.value!,
  });

  if (futureInCurrent === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  let futureInResult = futureInCurrent;
  if (input.futureRentCurrency !== input.currentRentCurrency) {
    if (!rates?.available) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    const converted = convertCurrency({
      amount: futureInCurrent,
      from: input.currentRentCurrency,
      to: input.futureRentCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    futureInResult = converted.amount;
  }

  const result: RentIncreaseResult = {
    futureAnnualRentInCurrent: futureInCurrent,
    futureAnnualRent: futureInResult,
    currentRentCurrency: input.currentRentCurrency,
    futureRentCurrency: input.futureRentCurrency,
    formattedFutureAnnualRent: formatRentIncreaseMoney(
      futureInResult,
      input.futureRentCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
