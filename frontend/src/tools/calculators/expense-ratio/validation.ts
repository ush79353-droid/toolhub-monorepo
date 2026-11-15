import { calculateExpenseRatio } from './calculation';
import type {
  ExpenseRatioFieldErrors,
  ExpenseRatioInput,
  ExpenseRatioResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateExpenseRatioInput(input: ExpenseRatioInput): {
  isValid: boolean;
  errors: ExpenseRatioFieldErrors;
  result: ExpenseRatioResult | null;
} {
  const errors: ExpenseRatioFieldErrors = {};

  const initialInvestment = parseField(input.initialInvestment);
  const yearlyInvestment = parseField(input.yearlyInvestment);
  const durationYears = parseField(input.durationYears);
  const expectedReturn = parseField(input.expectedReturn);
  const expenseRatio = parseField(input.expenseRatio);

  if (
    initialInvestment === null ||
    yearlyInvestment === null ||
    durationYears === null ||
    expectedReturn === null ||
    expenseRatio === null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(initialInvestment) || initialInvestment < 0) {
    errors.initialInvestment = 'Enter a valid initial investment (≥ 0).';
  }
  if (Number.isNaN(yearlyInvestment) || yearlyInvestment < 0) {
    errors.yearlyInvestment = 'Enter a valid yearly investment (≥ 0).';
  }
  if (
    Number.isNaN(durationYears) ||
    !Number.isInteger(durationYears) ||
    durationYears <= 0
  ) {
    errors.durationYears = 'Enter a whole number of years (1 or more).';
  }
  if (Number.isNaN(expectedReturn) || expectedReturn <= -100) {
    errors.expectedReturn = 'Enter an expected return greater than −100%.';
  }
  if (Number.isNaN(expenseRatio) || expenseRatio < 0 || expenseRatio > 100) {
    errors.expenseRatio = 'Enter an expense ratio between 0 and 100%.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateExpenseRatio({
    initialInvestment,
    yearlyInvestment,
    durationYears,
    expectedReturnPercent: expectedReturn,
    expenseRatioPercent: expenseRatio,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'Unable to calculate with these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
