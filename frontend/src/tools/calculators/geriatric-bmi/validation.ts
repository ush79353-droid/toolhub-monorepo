import {
  calculateGeriatricBmi,
  heightToMeters,
  weightToKg,
} from './calculation';
import type {
  GeriatricBmiFieldErrors,
  GeriatricBmiInput,
  GeriatricBmiResult,
} from './types';

export interface GeriatricBmiValidation {
  isValid: boolean;
  errors: GeriatricBmiFieldErrors;
  result: GeriatricBmiResult | null;
}

function parsePositive(
  raw: string,
  blank: string,
  bad: string
): { value: number | null; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, error: blank };
  if (/infinity|nan/i.test(cleaned)) return { value: null, error: bad };
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return { value: null, error: bad };
  return { value };
}

export function collectFieldErrors(
  input: GeriatricBmiInput
): GeriatricBmiFieldErrors {
  const errors: GeriatricBmiFieldErrors = {};
  const age = parsePositive(
    input.ageYears,
    'Enter age in years.',
    'Enter a valid age.'
  );
  if (age.error) errors.ageYears = age.error;
  else if (age.value != null && (age.value < 1 || age.value > 120)) {
    errors.ageYears = 'Enter an age between 1 and 120.';
  }

  const w = parsePositive(
    input.weightValue,
    'Enter weight.',
    'Enter a valid weight.'
  );
  if (w.error) errors.weightValue = w.error;
  else if (w.value != null) {
    const kg = weightToKg(w.value, input.weightUnit);
    if (kg == null || kg < 20 || kg > 400) {
      errors.weightValue = 'Enter a realistic weight.';
    }
  }

  const h = parsePositive(
    input.heightValue,
    'Enter height.',
    'Enter a valid height.'
  );
  if (h.error) errors.heightValue = h.error;
  else if (h.value != null) {
    const m = heightToMeters(h.value, input.heightUnit);
    if (m == null || m < 0.5 || m > 2.75) {
      errors.heightValue = 'Enter a realistic height.';
    }
  }

  return errors;
}

export function validateGeriatricBmiInput(
  input: GeriatricBmiInput
): GeriatricBmiValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateGeriatricBmi(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
