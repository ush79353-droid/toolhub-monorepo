import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateInterestPerDay,
  formatDailyRatePercent,
  formatInterestMoney,
} from './calculation';
import type {
  InterestPerDayFieldErrors,
  InterestPerDayInput,
  InterestPerDayResult,
} from './types';

export interface InterestPerDayValidation {
  isValid: boolean;
  errors: InterestPerDayFieldErrors;
  result: InterestPerDayResult | null;
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
 * Validates inputs, computes daily interest in the loan-balance currency at full
 * precision, then converts that interest into `interestPerDayCurrency` before
 * display rounding. Percentage rates are never FX-converted.
 */
export function validateInterestPerDayInput(
  input: InterestPerDayInput,
  rates?: CurrencyRatesSnapshot | null
): InterestPerDayValidation {
  const errors: InterestPerDayFieldErrors = {};

  const balance = parseNumber(input.loanBalance);
  const rate = parseNumber(input.annualInterestRatePercent);

  if (!balance.blank && (balance.invalid || balance.value === null)) {
    errors.loanBalance = 'Enter a valid loan balance.';
  } else if (!balance.blank && balance.value !== null && balance.value < 0) {
    errors.loanBalance = 'Loan balance cannot be negative.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualInterestRatePercent = 'Enter a valid annual interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.annualInterestRatePercent = 'Annual interest rate cannot be negative.';
  }

  const incomplete =
    balance.blank || rate.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateInterestPerDay({
    loanBalance: balance.value!,
    annualInterestRatePercent: rate.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  let interestInResult = computed.interestPerDay;
  if (input.interestPerDayCurrency !== input.loanBalanceCurrency) {
    if (!rates?.available) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    const converted = convertCurrency({
      amount: computed.interestPerDay,
      from: input.loanBalanceCurrency,
      to: input.interestPerDayCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    interestInResult = converted.amount;
  }

  const result: InterestPerDayResult = {
    interestPerDayInLoanCurrency: computed.interestPerDay,
    interestPerDay: interestInResult,
    interestRatePerDayPercent: computed.interestRatePerDayPercent,
    loanBalanceCurrency: input.loanBalanceCurrency,
    interestPerDayCurrency: input.interestPerDayCurrency,
    formattedInterestPerDay: formatInterestMoney(
      interestInResult,
      input.interestPerDayCurrency
    ),
    formattedInterestRatePerDay: formatDailyRatePercent(
      computed.interestRatePerDayPercent
    ),
  };

  return { isValid: true, errors: {}, result };
}
