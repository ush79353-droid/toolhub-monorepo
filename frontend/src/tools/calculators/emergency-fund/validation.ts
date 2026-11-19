import { calculateEmergencyFundResults } from './calculation';
import {
  EMERGENCY_FUND_MAX_MONTHS,
  type EmergencyFundFieldErrors,
  type EmergencyFundInput,
  type EmergencyFundResult,
} from './types';

function parsePositive(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function parseNonNeg(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateEmergencyFundInput(input: EmergencyFundInput): {
  isValid: boolean;
  errors: EmergencyFundFieldErrors;
  result: EmergencyFundResult | null;
  incomplete: boolean;
} {
  const errors: EmergencyFundFieldErrors = {};

  const expenses = parsePositive(input.monthlyExpenses);
  const months = parsePositive(input.monthsDesired);

  if (expenses === null || months === null) {
    return {
      isValid: false,
      errors: {},
      result: null,
      incomplete: true,
    };
  }

  if (Number.isNaN(expenses) || (expenses as number) <= 0) {
    errors.monthlyExpenses =
      'Please enter a valid monthly expense amount greater than zero.';
  }

  if (Number.isNaN(months) || (months as number) <= 0) {
    errors.monthsDesired =
      'Please enter at least one month of emergency fund coverage.';
  } else if ((months as number) > EMERGENCY_FUND_MAX_MONTHS) {
    errors.monthsDesired = `Coverage must be ${EMERGENCY_FUND_MAX_MONTHS} months or less.`;
  }

  let currentSavings: number | null = null;
  if (input.additionalOpen) {
    const savings = parseNonNeg(input.currentSavings);
    if (savings === null) {
      currentSavings = 0;
    } else if (Number.isNaN(savings) || (savings as number) < 0) {
      errors.currentSavings = 'Enter a valid nonnegative current savings amount';
    } else {
      currentSavings = savings as number;
    }
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null, incomplete: false };
  }

  // Round fractional months up so coverage is never short of a full month.
  const monthsDesired = Math.ceil(months as number);

  const result = calculateEmergencyFundResults({
    monthlyExpenses: expenses as number,
    monthsDesired,
    currentSavings,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate the emergency fund with the current inputs.' },
      result: null,
      incomplete: false,
    };
  }

  return { isValid: true, errors, result, incomplete: false };
}
