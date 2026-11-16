import { getHistoricalProgramNotice } from './calculation';
import type {
  StudentLoanForgivenessFieldErrors,
  StudentLoanForgivenessInput,
  StudentLoanForgivenessResult,
} from './types';

export interface StudentLoanForgivenessValidation {
  isValid: boolean;
  errors: StudentLoanForgivenessFieldErrors;
  result: StudentLoanForgivenessResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

/**
 * Validates screenshot inputs only. Never invents a forgiveness amount.
 * A valid form still returns the historical-program notice as the sole “result”.
 */
export function validateStudentLoanForgivenessInput(
  input: StudentLoanForgivenessInput
): StudentLoanForgivenessValidation {
  const errors: StudentLoanForgivenessFieldErrors = {};

  const income = parseNumber(input.annualIncome);
  const debt = parseNumber(input.outstandingStudentDebt);

  if (!income.blank && (income.invalid || income.value === null)) {
    errors.annualIncome = 'Enter a valid annual income.';
  } else if (!income.blank && income.value !== null && income.value < 0) {
    errors.annualIncome = 'Annual income cannot be negative.';
  }

  if (!debt.blank && (debt.invalid || debt.value === null)) {
    errors.outstandingStudentDebt = 'Enter a valid outstanding student debt amount.';
  } else if (!debt.blank && debt.value !== null && debt.value < 0) {
    errors.outstandingStudentDebt = 'Outstanding student debt cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: { historicalNotice: getHistoricalProgramNotice() },
  };
}
