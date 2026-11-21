import {
  calculateCalorieIntakeSimpleFromInput,
  heightToCm,
  weightToKg,
} from './calculation';
import type {
  CalorieIntakeSimpleFieldErrors,
  CalorieIntakeSimpleInput,
  CalorieIntakeSimpleResult,
} from './types';

export interface CalorieIntakeSimpleValidation {
  isValid: boolean;
  errors: CalorieIntakeSimpleFieldErrors;
  result: CalorieIntakeSimpleResult | null;
}

function parsePositive(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function collectFieldErrors(
  input: CalorieIntakeSimpleInput,
): CalorieIntakeSimpleFieldErrors {
  const errors: CalorieIntakeSimpleFieldErrors = {};
  if (input.ageYears.trim() === '') {
    errors.ageYears = 'Enter age in years.';
  } else {
    const age = parsePositive(input.ageYears);
    if (age == null || !Number.isInteger(age) || age < 15 || age > 120) {
      errors.ageYears = 'Enter a whole-number adult age from 15 to 120.';
    }
  }

  if (input.heightValue.trim() === '') {
    errors.heightValue = 'Enter height.';
  } else {
    const h = parsePositive(input.heightValue);
    const cm = h == null ? null : heightToCm(h, input.heightUnit);
    if (cm == null || cm < 100 || cm > 250) {
      errors.heightValue = 'Enter a plausible adult height.';
    }
  }

  if (input.weightValue.trim() === '') {
    errors.weightValue = 'Enter weight.';
  } else {
    const w = parsePositive(input.weightValue);
    const kg = w == null ? null : weightToKg(w, input.weightUnit);
    if (kg == null || kg < 30 || kg > 300) {
      errors.weightValue = 'Enter a plausible adult weight.';
    }
  }

  return errors;
}

export function validateCalorieIntakeSimpleInput(
  input: CalorieIntakeSimpleInput,
): CalorieIntakeSimpleValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateCalorieIntakeSimpleFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
