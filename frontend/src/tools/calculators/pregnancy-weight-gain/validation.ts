import {
  calculatePregnancyWeightGain,
  heightToMeters,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  HeightUnit,
  PregnancyWeightGainFieldErrors,
  PregnancyWeightGainInput,
  PregnancyWeightGainResult,
  WeightUnit,
} from './types';

const HEIGHT_UNITS: readonly HeightUnit[] = ['cm', 'in'];
const WEIGHT_UNITS: readonly WeightUnit[] = ['kg', 'lb'];

export interface PregnancyWeightGainValidation {
  isValid: boolean;
  errors: PregnancyWeightGainFieldErrors;
  result: PregnancyWeightGainResult | null;
}

export function collectFieldErrors(
  input: PregnancyWeightGainInput,
): PregnancyWeightGainFieldErrors {
  const errors: PregnancyWeightGainFieldErrors = {};

  if (!HEIGHT_UNITS.includes(input.heightUnit)) {
    errors.height = 'Select a height unit.';
  }
  if (!WEIGHT_UNITS.includes(input.weightUnit)) {
    errors.weight = 'Select a weight unit.';
  }

  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);
  const weekVal = parseNumber(input.week);

  if (input.height.trim() === '') {
    errors.height = 'Enter height.';
  } else if (heightVal == null) {
    errors.height = 'Enter a valid height.';
  } else if (heightVal <= 0) {
    errors.height = 'Height must be greater than zero.';
  } else {
    const meters = heightToMeters(heightVal, input.heightUnit);
    if (!(meters > 0) || meters > 3.5) {
      errors.height = 'Height is out of a realistic adult range.';
    }
  }

  if (input.weight.trim() === '') {
    errors.weight = 'Enter weight.';
  } else if (weightVal == null) {
    errors.weight = 'Enter a valid weight.';
  } else if (weightVal <= 0) {
    errors.weight = 'Weight must be greater than zero.';
  } else {
    const kg = weightToKg(weightVal, input.weightUnit);
    if (!(kg > 0) || kg > 500) {
      errors.weight = 'Weight is out of a realistic range.';
    }
  }

  if (input.week.trim() === '') {
    errors.week = 'Enter gestational week.';
  } else if (weekVal == null) {
    errors.week = 'Enter a valid week number.';
  } else if (weekVal < 1) {
    errors.week = 'Week must be at least 1.';
  } else if (weekVal > 45) {
    errors.week = 'Week must be at most 45.';
  }

  return errors;
}

export function hasFieldErrors(
  errors: PregnancyWeightGainFieldErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

export function validatePregnancyWeightGainInput(
  input: PregnancyWeightGainInput,
): PregnancyWeightGainValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculatePregnancyWeightGain(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
