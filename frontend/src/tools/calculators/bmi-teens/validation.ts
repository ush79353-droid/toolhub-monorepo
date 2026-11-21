import {
  calculateBmiTeens,
  heightToMeters,
  parseNumber,
  TEEN_AGE_MAX,
  TEEN_AGE_MIN,
  weightToKg,
} from './calculation';
import type {
  BmiTeensFieldErrors,
  BmiTeensInput,
  BmiTeensResult,
  HeightUnit,
  WeightUnit,
} from './types';

const HEIGHT_UNITS: readonly HeightUnit[] = ['cm', 'm', 'in', 'ft'];
const WEIGHT_UNITS: readonly WeightUnit[] = ['kg', 'lb', 'st'];

export interface BmiTeensValidation {
  isValid: boolean;
  errors: BmiTeensFieldErrors;
  result: BmiTeensResult | null;
}

export function collectFieldErrors(input: BmiTeensInput): BmiTeensFieldErrors {
  const errors: BmiTeensFieldErrors = {};

  if (!HEIGHT_UNITS.includes(input.heightUnit)) {
    errors.height = 'Select a height unit.';
  }
  if (!WEIGHT_UNITS.includes(input.weightUnit)) {
    errors.weight = 'Select a weight unit.';
  }

  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);

  if (input.height.trim() === '') {
    errors.height = 'Enter height.';
  } else if (heightVal == null) {
    errors.height = 'Enter a valid height.';
  } else if (heightVal <= 0) {
    errors.height = 'Height must be greater than zero.';
  } else {
    const meters = heightToMeters(heightVal, input.heightUnit);
    if (!(meters > 0) || meters > 3.5) {
      errors.height = 'Height is out of a realistic range.';
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

  if (input.sex !== '' && input.sex !== 'female' && input.sex !== 'male') {
    errors.sex = 'Select Female or Male.';
  }

  if (input.age.trim() !== '') {
    const age = parseNumber(input.age);
    if (age == null) {
      errors.age = 'Enter a valid age in years.';
    } else if (age < TEEN_AGE_MIN || age > TEEN_AGE_MAX) {
      errors.age = `Age must be ${TEEN_AGE_MIN} to ${TEEN_AGE_MAX} years.`;
    }
  }

  return errors;
}

export function hasFieldErrors(errors: BmiTeensFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Height/weight must be valid to return BMI.
 * Sex/age are optional for BMI/Prime; required only for percentile interpretation
 * (engine returns needs_demographics when missing — not a field error).
 */
export function validateBmiTeensInput(
  input: BmiTeensInput,
): BmiTeensValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateBmiTeens(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate BMI with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
