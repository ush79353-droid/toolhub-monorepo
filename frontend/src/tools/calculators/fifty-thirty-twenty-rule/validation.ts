import { calculateBudgetAllocation } from './calculation';
import type {
  FiftyThirtyTwentyFieldErrors,
  FiftyThirtyTwentyInput,
  FiftyThirtyTwentyResult,
} from './types';

function parseNumber(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateFiftyThirtyTwentyInput(input: FiftyThirtyTwentyInput): {
  isValid: boolean;
  errors: FiftyThirtyTwentyFieldErrors;
  result: FiftyThirtyTwentyResult | null;
} {
  const errors: FiftyThirtyTwentyFieldErrors = {};
  const income = parseNumber(input.monthlyAfterTaxIncome);

  if (income === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(income) || income < 0) {
    errors.monthlyAfterTaxIncome = 'Enter a valid nonnegative monthly after-tax income';
    return { isValid: false, errors, result: null };
  }

  const result = calculateBudgetAllocation(income, input.currency);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate the 50/30/20 budget with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors, result };
}
