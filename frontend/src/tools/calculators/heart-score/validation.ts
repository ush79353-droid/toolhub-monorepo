import { calculateHeartScore, parseAgeYears } from './calculation';
import type { HeartScoreFieldErrors, HeartScoreInput, HeartScoreResult } from './types';

export interface HeartScoreValidation {
  isValid: boolean;
  errors: HeartScoreFieldErrors;
  result: HeartScoreResult | null;
}

const MIN_AGE = 0;
const MAX_AGE = 120;

/** HEART total stays blank until a valid age is entered (screenshot-first). */
export function validateHeartScoreInput(input: HeartScoreInput): HeartScoreValidation {
  const errors: HeartScoreFieldErrors = {};
  const ageRaw = input.ageYears.trim();

  if (ageRaw === '') {
    return { isValid: false, errors, result: null };
  }

  const age = parseAgeYears(input.ageYears);
  if (age == null) {
    errors.ageYears = 'Enter age as a positive number of years.';
    return { isValid: false, errors, result: null };
  }
  if (age < MIN_AGE || age > MAX_AGE) {
    errors.ageYears = `Age should be between ${MIN_AGE} and ${MAX_AGE} years.`;
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateHeartScore(input, age),
  };
}