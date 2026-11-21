import {
  AGE_MAX,
  ADOLESCENT_AGE_MIN,
  calculateBreastfeedingCalorie,
  getActivityOption,
  getStateOption,
  heightToMeters,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  ActivityId,
  BreastfeedingCalorieFieldErrors,
  BreastfeedingCalorieInput,
  BreastfeedingCalorieResult,
  HeightUnit,
  PhysiologicalStateId,
  WeightUnit,
} from './types';

const HEIGHT_UNITS: readonly HeightUnit[] = ['cm', 'm', 'in', 'ft'];
const WEIGHT_UNITS: readonly WeightUnit[] = ['kg', 'lb', 'st'];

export interface BreastfeedingCalorieValidation {
  isValid: boolean;
  errors: BreastfeedingCalorieFieldErrors;
  result: BreastfeedingCalorieResult | null;
}

export function collectFieldErrors(
  input: BreastfeedingCalorieInput,
): BreastfeedingCalorieFieldErrors {
  const errors: BreastfeedingCalorieFieldErrors = {};

  if (!getStateOption(input.state as PhysiologicalStateId)) {
    errors.state = 'Select your current state.';
  }
  if (!getActivityOption(input.activity as ActivityId)) {
    errors.activity = 'Select a physical activity level.';
  }
  if (!HEIGHT_UNITS.includes(input.heightUnit)) {
    errors.height = 'Select a height unit.';
  }
  if (!WEIGHT_UNITS.includes(input.weightUnit)) {
    errors.weight = 'Select a weight unit.';
  }

  const ageBlank = input.age.trim() === '';
  const heightBlank = input.height.trim() === '';
  const weightBlank = input.weight.trim() === '';

  if (!ageBlank) {
    const age = parseNumber(input.age);
    if (age == null) {
      errors.age = 'Enter a valid age in years.';
    } else if (age < ADOLESCENT_AGE_MIN) {
      errors.age = `This DRI model supports ages ${ADOLESCENT_AGE_MIN}–${AGE_MAX}.`;
    } else if (age > AGE_MAX) {
      errors.age = `Age must be at most ${AGE_MAX} years for this model.`;
    }
  }

  if (!heightBlank) {
    const heightVal = parseNumber(input.height);
    if (heightVal == null) {
      errors.height = 'Enter a valid height.';
    } else if (heightVal <= 0) {
      errors.height = 'Height must be greater than zero.';
    } else {
      const meters = heightToMeters(heightVal, input.heightUnit);
      if (!(meters > 0) || meters > 3.5) {
        errors.height = 'Height is out of a realistic range.';
      }
    }
  }

  if (!weightBlank) {
    const weightVal = parseNumber(input.weight);
    if (weightVal == null) {
      errors.weight = 'Enter a valid weight.';
    } else if (weightVal <= 0) {
      errors.weight = 'Weight must be greater than zero.';
    } else {
      const kg = weightToKg(weightVal, input.weightUnit);
      if (!(kg > 0) || kg > 500) {
        errors.weight = 'Weight is out of a realistic range.';
      }
    }
  }

  // Soft companion prompts when partially filled.
  const anyFilled = !ageBlank || !heightBlank || !weightBlank;
  if (anyFilled) {
    if (ageBlank) errors.age = errors.age ?? 'Enter age.';
    if (heightBlank) errors.height = errors.height ?? 'Enter height.';
    if (weightBlank) errors.weight = errors.weight ?? 'Enter weight.';
  }

  return errors;
}

export function hasFieldErrors(
  errors: BreastfeedingCalorieFieldErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

export function validateBreastfeedingCalorieInput(
  input: BreastfeedingCalorieInput,
): BreastfeedingCalorieValidation {
  const ageBlank = input.age.trim() === '';
  const heightBlank = input.height.trim() === '';
  const weightBlank = input.weight.trim() === '';

  if (ageBlank && heightBlank && weightBlank) {
    return { isValid: true, errors: {}, result: null };
  }

  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateBreastfeedingCalorie(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to estimate energy needs with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
