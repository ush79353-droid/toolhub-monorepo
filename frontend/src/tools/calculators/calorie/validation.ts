import { calculateCalorieFromInput, heightToCm, weightToKg } from './calculation';
import type {
  CalorieFieldErrors,
  CalorieInput,
  CalorieResult,
} from './types';

export interface CalorieValidation {
  isValid: boolean;
  errors: CalorieFieldErrors;
  result: CalorieResult | null;
}

function parsePositive(
  raw: string,
  blankMsg: string,
  invalidMsg: string
): { value: number | null; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, error: blankMsg };
  if (/infinity|nan/i.test(cleaned)) return { value: null, error: invalidMsg };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, error: invalidMsg };
  if (value <= 0) return { value: null, error: invalidMsg };
  return { value };
}

export function collectFieldErrors(input: CalorieInput): CalorieFieldErrors {
  const errors: CalorieFieldErrors = {};

  const age = parsePositive(
    input.ageYears,
    'Enter age in years.',
    'Enter a valid age greater than zero.'
  );
  if (age.error) errors.ageYears = age.error;
  else if (age.value != null && (age.value > 120 || age.value < 1)) {
    errors.ageYears = 'Enter an age between 1 and 120 years.';
  }

  const height = parsePositive(
    input.heightValue,
    'Enter height.',
    'Enter a valid height greater than zero.'
  );
  if (height.error) errors.heightValue = height.error;
  else if (height.value != null) {
    const cm = heightToCm(height.value, input.heightUnit);
    if (cm == null || cm < 50 || cm > 275) {
      errors.heightValue = 'Enter a realistic adult height.';
    }
  }

  const weight = parsePositive(
    input.weightValue,
    'Enter weight.',
    'Enter a valid weight greater than zero.'
  );
  if (weight.error) errors.weightValue = weight.error;
  else if (weight.value != null) {
    const kg = weightToKg(weight.value, input.weightUnit);
    if (kg == null || kg < 20 || kg > 400) {
      errors.weightValue = 'Enter a realistic adult weight.';
    }
  }

  return errors;
}

export function validateCalorieInput(input: CalorieInput): CalorieValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateCalorieFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
