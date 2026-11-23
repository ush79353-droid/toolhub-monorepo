import {
  MAX_AGE_YEARS,
  MAX_MATURE_EGGS,
  MIN_AGE_YEARS,
  calculateEggFreezing,
  parseInteger,
} from './calculation';
import type {
  EggFreezingFieldErrors,
  EggFreezingInput,
  EggFreezingResult,
} from './types';

export interface EggFreezingValidation {
  isValid: boolean;
  errors: EggFreezingFieldErrors;
  result: EggFreezingResult | null;
}

export function validateEggFreezingInput(
  input: EggFreezingInput,
): EggFreezingValidation {
  const errors: EggFreezingFieldErrors = {};
  const ageRaw = input.ageYears.trim();
  const eggsRaw = input.matureEggs.trim();

  if (ageRaw === '' && eggsRaw === '') {
    return { isValid: false, errors, result: null };
  }

  const age = parseInteger(input.ageYears);
  if (ageRaw === '' || age === null) {
    errors.ageYears = 'Enter age at freezing as a whole number of years.';
  } else if (age < MIN_AGE_YEARS || age > MAX_AGE_YEARS) {
    errors.ageYears = `Goldman 2017 tables support ages ${MIN_AGE_YEARS}–${MAX_AGE_YEARS} years. Prediction suppressed outside that band.`;
  }

  const eggs = parseInteger(input.matureEggs);
  if (eggsRaw === '' || eggs === null) {
    errors.matureEggs = 'Enter the number of frozen mature eggs as a whole number.';
  } else if (eggs < 0) {
    errors.matureEggs = 'Egg count cannot be negative.';
  } else if (eggs > MAX_MATURE_EGGS) {
    errors.matureEggs = `Enter at most ${MAX_MATURE_EGGS} mature eggs (published counseling table range).`;
  }

  if (errors.ageYears || errors.matureEggs) {
    return { isValid: false, errors, result: null };
  }

  if (age == null || eggs == null) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateEggFreezing(input, age, eggs),
  };
}
