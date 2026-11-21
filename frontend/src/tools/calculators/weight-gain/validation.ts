import { calculateWeightGain, heightToCm, weightToKg } from './calculation';
import type {
  WeightGainFieldErrors,
  WeightGainInput,
  WeightGainResult,
} from './types';

export interface WeightGainValidation {
  isValid: boolean;
  errors: WeightGainFieldErrors;
  result: WeightGainResult | null;
}

function parsePositive(
  raw: string,
  blank: string,
  bad: string
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

export function collectFieldErrors(
  input: WeightGainInput
): WeightGainFieldErrors {
  const errors: WeightGainFieldErrors = {};

  const age = parsePositive(
    input.ageYears,
    'Enter age in years.',
    'Enter a valid age.'
  );
  if (age.error) errors.ageYears = age.error;
  else if (age.value != null && (age.value < 18 || age.value > 120)) {
    errors.ageYears = 'This tool is for adults ages 18–120.';
  }

  const h = parsePositive(
    input.heightValue,
    'Enter height.',
    'Enter a valid height.'
  );
  if (h.error) errors.heightValue = h.error;
  else if (h.value != null) {
    const cm = heightToCm(h.value, input.heightUnit);
    if (cm == null || cm < 50 || cm > 300) {
      errors.heightValue = 'Enter a realistic height.';
    }
  }

  const w = parsePositive(
    input.weightValue,
    'Enter weight.',
    'Enter a valid weight.'
  );
  if (w.error) errors.weightValue = w.error;
  else if (w.value != null) {
    const kg = weightToKg(w.value, input.weightUnit);
    if (kg == null || kg < 15 || kg > 700) {
      errors.weightValue = 'Enter a realistic weight.';
    }
  }

  const tRaw = input.targetWeightValue.trim();
  if (tRaw !== '') {
    const t = parsePositive(
      input.targetWeightValue,
      'Enter target weight.',
      'Enter a valid target weight.'
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

export function validateWeightGainInput(
  input: WeightGainInput
): WeightGainValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateWeightGain(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
