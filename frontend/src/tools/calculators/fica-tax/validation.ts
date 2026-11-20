import { calculateFica } from './calculation';
import type { FicaFieldErrors, FicaInput, FicaResult } from './types';

export interface FicaValidation {
  isValid: boolean;
  errors: FicaFieldErrors;
  result: FicaResult | null;
}

function parseMoney(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function validateFicaInput(input: FicaInput): FicaValidation {
  const errors: FicaFieldErrors = {};
  const cleaned = input.income.trim().replace(/,/g, '');

  if (cleaned === '') {
    errors.income = 'Income is required.';
    return { isValid: false, errors, result: null };
  }

  const income = parseMoney(input.income);
  if (income === null) {
    errors.income = 'Income must be a valid number.';
    return { isValid: false, errors, result: null };
  }
  if (income < 0) {
    errors.income = 'Income cannot be negative.';
    return { isValid: false, errors, result: null };
  }
  if (!Number.isFinite(income)) {
    errors.income = 'Income must be a finite number.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateFica({
    employmentType: input.employmentType,
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    income,
  });

  return { isValid: true, errors: {}, result };
}
