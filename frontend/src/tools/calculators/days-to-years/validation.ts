import { MAX_ABS_VALUE, type DaysToYearsFieldErrors, type DaysToYearsInput } from './types';
import { isIncompleteNumber, parseOptionalNumber } from '../day-converter/validation';

export { isIncompleteNumber, parseOptionalNumber };

function durationProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateDaysToYears(input: DaysToYearsInput): {
  isValid: boolean;
  errors: DaysToYearsFieldErrors;
} {
  const errors: DaysToYearsFieldErrors = {};
  const key = input.source;
  const state = durationProblem(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[key] = 'Enter a valid duration.';
  } else if (state === 'negative') {
    errors[key] = 'Duration cannot be negative.';
  } else if (state === 'large') {
    errors[key] = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
