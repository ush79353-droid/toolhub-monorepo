import {
  AGE_MAX,
  calculateBmiBodyMassIndex,
  heightToMeters,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  BmiBodyMassIndexFieldErrors,
  BmiBodyMassIndexInput,
  BmiBodyMassIndexResult,
  HeightUnit,
  WeightUnit,
} from './types';

const HEIGHT_UNITS: readonly HeightUnit[] = ['cm', 'm', 'in', 'ft'];
const WEIGHT_UNITS: readonly WeightUnit[] = ['kg', 'lb', 'st'];

export interface BmiBodyMassIndexValidation {
  isValid: boolean;
  errors: BmiBodyMassIndexFieldErrors;
  result: BmiBodyMassIndexResult | null;
}

export function collectFieldErrors(
  input: BmiBodyMassIndexInput,
): BmiBodyMassIndexFieldErrors {
  const errors: BmiBodyMassIndexFieldErrors = {};

  if (input.sex !== 'female' && input.sex !== 'male') {
    errors.form = 'Select Female or Male.';
  }

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

  if (input.age.trim() !== '') {
    const age = parseNumber(input.age);
    if (age == null) {
      errors.age = 'Enter a valid age in years.';
    } else if (age < 0) {
      errors.age = 'Age cannot be negative.';
    } else if (age > AGE_MAX) {
      errors.age = `Age must be at most ${AGE_MAX} years.`;
    }
  }

  return errors;
}

export function hasFieldErrors(errors: BmiBodyMassIndexFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateBmiBodyMassIndexInput(
  input: BmiBodyMassIndexInput,
): BmiBodyMassIndexValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateBmiBodyMassIndex(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate BMI with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
