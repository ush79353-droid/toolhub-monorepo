import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateProratedRent,
  formatProratedRentMoney,
  parseCivilDate,
} from './calculation';
import type {
  ProratedRentFieldErrors,
  ProratedRentInput,
  ProratedRentResult,
} from './types';

export interface ProratedRentValidation {
  isValid: boolean;
  errors: ProratedRentFieldErrors;
  result: ProratedRentResult | null;
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
 * Validates inputs, computes prorated rent in the monthly-rent currency at full
 * precision, then converts into the independent result currency for display.
 */
export function validateProratedRentInput(
  input: ProratedRentInput,
  rates?: CurrencyRatesSnapshot | null
): ProratedRentValidation {
  const errors: ProratedRentFieldErrors = {};
  const calcCurrency = input.monthlyRentCurrency;

  const rent = parseNumber(input.monthlyRent);
  const civil = parseCivilDate(input.movingDate);

  if (!input.movingDate.trim()) {
    errors.movingDate = 'Enter a moving date.';
  } else if (!civil) {
    errors.movingDate = 'Enter a valid moving date.';
  }

  if (!rent.blank && (rent.invalid || rent.value === null)) {
    errors.monthlyRent = 'Enter a valid monthly rent.';
  } else if (!rent.blank && rent.value !== null && rent.value < 0) {
    errors.monthlyRent = 'Monthly rent cannot be negative.';
  }

  const incomplete =
    rent.blank || Boolean(errors.movingDate) || Object.keys(errors).length > 0;

  if (incomplete || !civil) {
    return { isValid: false, errors, result: null };
  }

  const calc = calculateProratedRent({
    monthlyRent: rent.value!,
    moveStatus: input.moveStatus,
    year: civil.year,
    month: civil.month,
    day: civil.day,
  });

  if (!calc) {
    errors.form = 'This combination does not produce a finite prorated rent.';
    return { isValid: false, errors, result: null };
  }

  let proratedInResult = calc.proratedRent;
  if (input.proratedRentCurrency !== calcCurrency) {
    if (!rates?.available) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    const converted = convertCurrency({
      amount: calc.proratedRent,
      from: calcCurrency,
      to: input.proratedRentCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    proratedInResult = converted.amount;
  }

  const result: ProratedRentResult = {
    daysInMonth: calc.daysInMonth,
    chargeableDays: calc.chargeableDays,
    dailyRent: calc.dailyRent,
    proratedRentInMonthly: calc.proratedRent,
    proratedRent: proratedInResult,
    calcCurrency,
    resultCurrency: input.proratedRentCurrency,
    formattedProratedRent: formatProratedRentMoney(
      proratedInResult,
      input.proratedRentCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
