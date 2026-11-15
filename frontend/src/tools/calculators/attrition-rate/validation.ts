import type { AttritionRateFieldErrors, AttritionRateInput } from './types';

export function validateAttritionRateInput(input: AttritionRateInput): {
  isValid: boolean;
  errors: AttritionRateFieldErrors;
  parsedValues: { start: number; end: number; left: number } | null;
} {
  const errors: AttritionRateFieldErrors = {};

  const parseField = (val: string): number | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : NaN;
  };

  const start = parseField(input.startEmployees);
  const end = parseField(input.endEmployees);
  const left = parseField(input.leftEmployees);

  if (start === null || end === null || left === null) {
    return { isValid: false, errors, parsedValues: null };
  }

  if (Number.isNaN(start) || start < 0) {
    errors.startEmployees = 'Enter a valid non-negative number of employees';
  }
  if (Number.isNaN(end) || end < 0) {
    errors.endEmployees = 'Enter a valid non-negative number of employees';
  }
  if (Number.isNaN(left) || left < 0) {
    errors.leftEmployees = 'Enter a valid non-negative number of employees';
  }

  if (Object.keys(errors).length === 0) {
    const avg = (start + end) / 2;
    if (avg <= 0) {
      errors.general = 'Average number of employees must be greater than zero';
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    parsedValues: isValid ? { start, end, left } : null,
  };
}
