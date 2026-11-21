import {
  AGE_YEARS_MAX,
  calculateBmiKids,
  heightToMeters,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  BmiKidsFieldErrors,
  BmiKidsInput,
  BmiKidsResult,
  HeightUnit,
  WeightUnit,
} from './types';

const HEIGHT_UNITS: readonly HeightUnit[] = ['cm', 'm', 'in', 'ft'];
const WEIGHT_UNITS: readonly WeightUnit[] = ['kg', 'lb', 'st'];

export interface BmiKidsValidation {
  isValid: boolean;
  errors: BmiKidsFieldErrors;
  result: BmiKidsResult | null;
}

export function collectFieldErrors(input: BmiKidsInput): BmiKidsFieldErrors {
  const errors: BmiKidsFieldErrors = {};

  if (!HEIGHT_UNITS.includes(input.heightUnit)) {
    errors.height = 'Select a height unit.';
  }
  if (!WEIGHT_UNITS.includes(input.weightUnit)) {
    errors.weight = 'Select a weight unit.';
  }

  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);

  if (input.height.trim() === '') {
    // Blank is the screenshot default — not an error until the user types.
  } else if (heightVal == null) {
    errors.height = 'Enter a valid height.';
  } else if (heightVal <= 0) {
    errors.height = 'Height must be greater than zero.';
  } else {
    const meters = heightToMeters(heightVal, input.heightUnit);
    if (!(meters > 0) || meters > 2.5) {
      errors.height = 'Height is out of a realistic child range.';
    }
  }

  if (input.weight.trim() === '') {
    // Blank default — no error.
  } else if (weightVal == null) {
    errors.weight = 'Enter a valid weight.';
  } else if (weightVal <= 0) {
    errors.weight = 'Weight must be greater than zero.';
  } else {
    const kg = weightToKg(weightVal, input.weightUnit);
    if (!(kg > 0) || kg > 250) {
      errors.weight = 'Weight is out of a realistic child range.';
    }
  }

  if (input.healthOpen && input.ageYears.trim() !== '') {
    const age = parseNumber(input.ageYears);
    if (age == null) {
      errors.ageYears = 'Enter a valid age in years.';
    } else if (age < 0) {
      errors.ageYears = 'Age cannot be negative.';
    } else if (age > AGE_YEARS_MAX) {
      errors.ageYears = `Age must be at most ${AGE_YEARS_MAX} years.`;
    }
  }

  if (input.sex !== 'female' && input.sex !== 'male') {
    errors.form = 'Select Female or Male.';
  }

  return errors;
}

export function hasFieldErrors(errors: BmiKidsFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateBmiKidsInput(input: BmiKidsInput): BmiKidsValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const heightBlank = input.height.trim() === '';
  const weightBlank = input.weight.trim() === '';
  if (heightBlank || weightBlank) {
    return { isValid: false, errors: {}, result: null };
  }

  const result = calculateBmiKids(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate BMI with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
