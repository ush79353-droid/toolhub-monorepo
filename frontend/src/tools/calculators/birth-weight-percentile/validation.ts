import {
  calculateBirthWeightPercentile,
  parseOptionalNumber,
  weightToGrams,
} from './calculation';
import type {
  BirthWeightPercentileFieldErrors,
  BirthWeightPercentileInput,
  BirthWeightPercentileResult,
} from './types';

export interface BirthWeightPercentileValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: BirthWeightPercentileFieldErrors;
  result: BirthWeightPercentileResult | null;
}

export function validateBirthWeightPercentileInput(
  input: BirthWeightPercentileInput,
): BirthWeightPercentileValidation {
  const errors: BirthWeightPercentileFieldErrors = {};
  const weeksRaw = input.weeks.trim();
  const daysRaw = input.days.trim();
  const weightRaw = input.weight.trim();

  const incomplete = weeksRaw === '' || weightRaw === '' || daysRaw === '';
  if (incomplete) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const weeks = parseOptionalNumber(weeksRaw);
  const days = parseOptionalNumber(daysRaw);
  const weight = parseOptionalNumber(weightRaw);

  if (weeks === null || !Number.isInteger(weeks) || weeks < 0 || weeks > 45) {
    errors.weeks = 'Enter whole weeks from 0 to 45.';
  }
  if (days === null || !Number.isInteger(days) || days < 0 || days > 6) {
    errors.days = 'Enter whole days from 0 to 6.';
  }
  if (weight === null || !(weight > 0)) {
    errors.weight = 'Enter a birth weight greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const weightGrams = weightToGrams(weight!, input.weightUnit);
  if (!(weightGrams > 0) || !Number.isFinite(weightGrams)) {
    return {
      isValid: false,
      incomplete: false,
      errors: { weight: 'Weight could not be converted.' },
      result: null,
    };
  }

  const result = calculateBirthWeightPercentile({
    weeks: weeks!,
    days: days!,
    weightGrams,
    weightUnit: input.weightUnit,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: { form: 'Could not calculate a percentile band.' },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
