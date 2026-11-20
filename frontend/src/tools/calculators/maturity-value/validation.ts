import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateMaturityValue,
  formatMaturityMoney,
  roundMoneyAmount,
} from './calculation';
import type {
  MaturityValueFieldErrors,
  MaturityValueInput,
  MaturityValueResult,
} from './types';

export interface MaturityValueValidation {
  isValid: boolean;
  errors: MaturityValueFieldErrors;
  result: MaturityValueResult | null;
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

export function validateMaturityValueInput(
  input: MaturityValueInput
): MaturityValueValidation {
  const errors: MaturityValueFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasFieldError = false;

  const principal = parseNumber(input.principal);
  if (principal.blank) {
    errors.principal = 'Enter the principal amount.';
    hasFieldError = true;
  } else if (principal.invalid || principal.value === null) {
    errors.principal = 'Enter a valid principal amount.';
    hasFieldError = true;
  } else if (principal.value < 0) {
    errors.principal = 'Principal cannot be negative.';
    hasFieldError = true;
  }

  const rate = parseNumber(input.interestRate);
  if (rate.blank) {
    errors.interestRate = 'Enter the annual interest rate.';
    hasFieldError = true;
  } else if (rate.invalid || rate.value === null) {
    errors.interestRate = 'Enter a valid interest rate.';
    hasFieldError = true;
  } else if (rate.value < 0) {
    errors.interestRate = 'Interest rate cannot be negative.';
    hasFieldError = true;
  }

  const duration = parseNumber(input.duration);
  if (duration.blank) {
    errors.duration = 'Enter the investment duration.';
    hasFieldError = true;
  } else if (duration.invalid || duration.value === null) {
    errors.duration = 'Enter a valid investment duration.';
    hasFieldError = true;
  } else if (duration.value < 0) {
    errors.duration = 'Investment duration cannot be negative.';
    hasFieldError = true;
  }

  if (input.durationUnit !== 'years' && input.durationUnit !== 'months') {
    errors.duration = 'Select years or months.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    principal.value === null ||
    rate.value === null ||
    duration.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateMaturityValue({
    principal: principal.value,
    annualInterestRatePercent: rate.value,
    duration: duration.value,
    durationUnit: input.durationUnit,
  });

  if (math === null) {
    errors.form =
      'Unable to calculate maturity value with these inputs (check for overflow).';
    return { isValid: false, errors, result: null };
  }

  const maturityRounded = roundMoneyAmount(math.maturityValue, currency);
  const interestRounded = roundMoneyAmount(
    maturityRounded - principal.value,
    currency
  );

  const result: MaturityValueResult = {
    principal: principal.value,
    annualInterestRatePercent: rate.value,
    durationYears: math.durationYears,
    maturityValue: maturityRounded,
    interestEarned: interestRounded,
    currency,
    formattedMaturityValue: `${symbol}${formatMaturityMoney(maturityRounded, currency)}`,
    formattedInterestEarned: `${symbol}${formatMaturityMoney(interestRounded, currency)}`,
    warningMessage:
      'Uses annual compounding with a fixed rate and no extra deposits, withdrawals, fees, or taxes.',
  };

  return { isValid: true, errors, result };
}
