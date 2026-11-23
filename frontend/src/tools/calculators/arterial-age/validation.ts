import {
  MAX_AGE,
  MAX_CAC,
  MIN_AGE,
  calculateArterialAge,
} from './calculation';
import type {
  ArterialAgeFieldErrors,
  ArterialAgeInput,
  ArterialAgeResult,
} from './types';

export interface ArterialAgeValidation {
  isValid: boolean;
  errors: ArterialAgeFieldErrors;
  result: ArterialAgeResult | null;
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

/**
 * Result stays inactive until calcium score is a valid non-blank entry.
 * Chronologic age is optional comparison-only.
 */
export function validateArterialAgeInput(
  input: ArterialAgeInput
): ArterialAgeValidation {
  const errors: ArterialAgeFieldErrors = {};
  const cacParsed = parseNumber(input.calciumScore);
  const ageParsed = parseNumber(input.ageYears);

  if (!ageParsed.blank) {
    if (
      ageParsed.invalid ||
      ageParsed.value === null ||
      ageParsed.value < MIN_AGE ||
      ageParsed.value > MAX_AGE
    ) {
      errors.ageYears = `Enter a chronologic age between ${MIN_AGE} and ${MAX_AGE} years, or leave blank.`;
    }
  }

  if (cacParsed.blank) {
    return { isValid: false, errors, result: null };
  }

  if (cacParsed.invalid || cacParsed.value === null || cacParsed.value < 0) {
    errors.calciumScore = 'Enter a valid non-negative Agatston calcium score.';
    return { isValid: false, errors, result: null };
  }

  if (cacParsed.value > MAX_CAC) {
    errors.calciumScore = `Calcium score above ${MAX_CAC} is outside the supported entry range.`;
    return { isValid: false, errors, result: null };
  }

  if (errors.ageYears) {
    return { isValid: false, errors, result: null };
  }

  const chronologic =
    ageParsed.blank || ageParsed.value === null ? null : ageParsed.value;

  return {
    isValid: true,
    errors,
    result: calculateArterialAge(cacParsed.value, chronologic, input),
  };
}
