import {
  ageToYears,
  AGE_YEARS_MAX,
  calculateParacetamolDosage,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  AgeUnit,
  ParacetamolDosageFieldErrors,
  ParacetamolDosageInput,
  ParacetamolDosageResult,
  WeightUnit,
} from './types';

const AGE_UNITS: readonly AgeUnit[] = ['yrs', 'mos'];
const WEIGHT_UNITS: readonly WeightUnit[] = ['kg', 'lb'];

export interface ParacetamolDosageValidation {
  isValid: boolean;
  errors: ParacetamolDosageFieldErrors;
  result: ParacetamolDosageResult;
}

export function collectFieldErrors(
  input: ParacetamolDosageInput,
): ParacetamolDosageFieldErrors {
  const errors: ParacetamolDosageFieldErrors = {};

  if (!AGE_UNITS.includes(input.ageUnit)) {
    errors.age = 'Select an age unit.';
  }
  if (!WEIGHT_UNITS.includes(input.weightUnit)) {
    errors.weight = 'Select a weight unit.';
  }

  const ageBlank = input.age.trim() === '';
  const weightBlank = input.weight.trim() === '';

  if (!ageBlank) {
    const age = parseNumber(input.age);
    if (age == null) errors.age = 'Enter a valid age.';
    else if (age < 0) errors.age = 'Age cannot be negative.';
    else if (ageToYears(age, input.ageUnit) > AGE_YEARS_MAX + 0.001) {
      // Allow entry; engine explains adult path — soft warning only above max+margin
      if (ageToYears(age, input.ageUnit) > 120) {
        errors.age = 'Age is out of range.';
      }
    }
  }

  if (!weightBlank) {
    const w = parseNumber(input.weight);
    if (w == null) errors.weight = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weight = 'Weight must be greater than zero.';
    else {
      const kg = weightToKg(w, input.weightUnit);
      if (!(kg > 0) || kg > 200) {
        errors.weight = 'Weight is out of a realistic pediatric range.';
      }
    }
  }

  if (!ageBlank && weightBlank) errors.weight = 'Enter weight.';
  if (ageBlank && !weightBlank) errors.age = 'Enter age.';

  return errors;
}

export function hasFieldErrors(errors: ParacetamolDosageFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateParacetamolDosageInput(
  input: ParacetamolDosageInput,
): ParacetamolDosageValidation {
  const ageBlank = input.age.trim() === '';
  const weightBlank = input.weight.trim() === '';

  if (ageBlank && weightBlank) {
    return {
      isValid: true,
      errors: {},
      result: calculateParacetamolDosage(input),
    };
  }

  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return {
      isValid: false,
      errors,
      result: calculateParacetamolDosage({
        ...input,
        age: errors.age ? '' : input.age,
        weight: errors.weight ? '' : input.weight,
      }),
    };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateParacetamolDosage(input),
  };
}
