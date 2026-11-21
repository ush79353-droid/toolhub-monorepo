import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculatePensionComparison,
  toPensionResult,
} from './calculation';
import type {
  PensionFieldErrors,
  PensionInput,
  PensionResult,
} from './types';

export interface PensionValidation {
  isValid: boolean;
  errors: PensionFieldErrors;
  result: PensionResult | null;
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

export function validatePensionInput(input: PensionInput): PensionValidation {
  const errors: PensionFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasFieldError = false;

  const age = parseNumber(input.retirementAge);
  if (age.blank) {
    errors.retirementAge = 'Enter your retirement age.';
    hasFieldError = true;
  } else if (age.invalid || age.value === null) {
    errors.retirementAge = 'Enter a valid retirement age.';
    hasFieldError = true;
  } else if (age.value < 18 || age.value > 100) {
    errors.retirementAge = 'Retirement age must be between 18 and 100.';
    hasFieldError = true;
  } else if (!Number.isInteger(age.value)) {
    errors.retirementAge = 'Use a whole-number retirement age.';
    hasFieldError = true;
  }

  const lump = parseNumber(input.lumpSum);
  if (lump.blank) {
    errors.lumpSum = 'Enter the lump sum payment amount.';
    hasFieldError = true;
  } else if (lump.invalid || lump.value === null) {
    errors.lumpSum = 'Enter a valid lump sum amount.';
    hasFieldError = true;
  } else if (lump.value < 0) {
    errors.lumpSum = 'Lump sum cannot be negative.';
    hasFieldError = true;
  }

  const ret = parseNumber(input.investmentReturn);
  if (ret.blank) {
    errors.investmentReturn = 'Enter the expected annual investment return.';
    hasFieldError = true;
  } else if (ret.invalid || ret.value === null) {
    errors.investmentReturn = 'Enter a valid investment return.';
    hasFieldError = true;
  } else if (ret.value < -99.999) {
    errors.investmentReturn = 'Return cannot be −100% or lower.';
    hasFieldError = true;
  }

  const pension = parseNumber(input.monthlyPension);
  if (pension.blank) {
    errors.monthlyPension = 'Enter the monthly pension income.';
    hasFieldError = true;
  } else if (pension.invalid || pension.value === null) {
    errors.monthlyPension = 'Enter a valid monthly pension amount.';
    hasFieldError = true;
  } else if (pension.value < 0) {
    errors.monthlyPension = 'Monthly pension cannot be negative.';
    hasFieldError = true;
  }

  const cola = parseNumber(input.cola);
  if (cola.blank) {
    errors.cola = 'Enter the annual cost-of-living adjustment.';
    hasFieldError = true;
  } else if (cola.invalid || cola.value === null) {
    errors.cola = 'Enter a valid COLA percent.';
    hasFieldError = true;
  } else if (cola.value < -99.999) {
    errors.cola = 'COLA cannot be −100% or lower.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    age.value === null ||
    lump.value === null ||
    ret.value === null ||
    pension.value === null ||
    cola.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const mathInput = {
    retirementAge: age.value,
    lumpSum: lump.value,
    annualReturnPercent: ret.value,
    monthlyPension: pension.value,
    colaPercent: cola.value,
  };

  const math = calculatePensionComparison(mathInput);
  if (math === null) {
    errors.form = 'Unable to project with these inputs.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: toPensionResult(math, mathInput, currency, symbol),
  };
}
