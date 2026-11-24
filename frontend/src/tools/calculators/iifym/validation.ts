import { calculateIifym, heightToCm, weightToKg } from './calculation';
import type {
  IifymFieldErrors,
  IifymInput,
  IifymResult,
} from './types';

export interface IifymValidation {
  isValid: boolean;
  errors: IifymFieldErrors;
  result: IifymResult | null;
}

function parsePositive(
  raw: string,
  blank: string,
  bad: string,
): { value: number | null; error?: string; blank: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, error: blank, blank: true };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, error: bad, blank: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) {
    return { value: null, error: bad, blank: false };
  }
  return { value, blank: false };
}

export function collectFieldErrors(input: IifymInput): IifymFieldErrors {
  const errors: IifymFieldErrors = {};

  const age = parsePositive(
    input.ageYears,
    'Enter age in years.',
    'Enter a valid age.',
  );
  if (age.error) errors.ageYears = age.error;
  else if (age.value != null && (age.value < 15 || age.value > 100)) {
    errors.ageYears = 'Age must be 15–100 years for this estimate.';
  }

  const h = parsePositive(
    input.heightValue,
    'Enter height.',
    'Enter a valid height.',
  );
  if (h.error) errors.heightValue = h.error;
  else if (h.value != null) {
    const cm = heightToCm(h.value, input.heightUnit);
    if (cm == null || cm < 100 || cm > 250) {
      errors.heightValue = 'Enter a realistic height.';
    }
  }

  const w = parsePositive(
    input.weightValue,
    'Enter weight.',
    'Enter a valid weight.',
  );
  if (w.error) errors.weightValue = w.error;
  else if (w.value != null) {
    const kg = weightToKg(w.value, input.weightUnit);
    if (kg == null || kg < 30 || kg > 300) {
      errors.weightValue = 'Enter a realistic weight.';
    }
  }

  if (input.goalMode === 'change') {
    const t = parsePositive(
      input.targetWeightValue,
      'Enter target weight.',
      'Enter a valid target weight.',
    );
    if (t.error) errors.targetWeightValue = t.error;
    else if (t.value != null) {
      const kg = weightToKg(t.value, input.targetWeightUnit);
      if (kg == null || kg < 20 || kg > 300) {
        errors.targetWeightValue = 'Enter a realistic target weight.';
      }
    }
  }

  return errors;
}

export function validateIifymInput(input: IifymInput): IifymValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateIifym(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
