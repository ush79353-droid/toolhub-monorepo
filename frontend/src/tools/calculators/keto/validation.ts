import {
  calculateKeto,
  heightToCm,
  macroPercentsTotalOk,
  weightToKg,
} from './calculation';
import type { KetoFieldErrors, KetoInput, KetoResult } from './types';

export interface KetoValidation {
  isValid: boolean;
  errors: KetoFieldErrors;
  result: KetoResult | null;
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

function parseNonNegPct(
  raw: string,
  blank: string,
  bad: string,
): { value: number | null; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, error: blank };
  if (/infinity|nan/i.test(cleaned)) return { value: null, error: bad };
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    return { value: null, error: bad };
  }
  return { value };
}

export function collectFieldErrors(input: KetoInput): KetoFieldErrors {
  const errors: KetoFieldErrors = {};

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
    'Enter current weight.',
    'Enter a valid weight.',
  );
  if (w.error) errors.weightValue = w.error;
  else if (w.value != null) {
    const kg = weightToKg(w.value, input.weightUnit);
    if (kg == null || kg < 30 || kg > 300) {
      errors.weightValue = 'Enter a realistic weight.';
    }
  }

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

  const fat = parseNonNegPct(
    input.fatPct,
    'Enter fat %.',
    'Enter a valid fat %.',
  );
  if (fat.error) errors.fatPct = fat.error;

  const carb = parseNonNegPct(
    input.carbPct,
    'Enter carbohydrate %.',
    'Enter a valid carbohydrate %.',
  );
  if (carb.error) errors.carbPct = carb.error;

  const protein = parseNonNegPct(
    input.proteinPct,
    'Enter protein %.',
    'Enter a valid protein %.',
  );
  if (protein.error) errors.proteinPct = protein.error;

  if (
    fat.value != null &&
    carb.value != null &&
    protein.value != null &&
    !macroPercentsTotalOk(fat.value, carb.value, protein.value)
  ) {
    errors.macrosTotal =
      'Fat, carbohydrate, and protein percentages must total 100%.';
  }

  return errors;
}

export function validateKetoInput(input: KetoInput): KetoValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateKeto(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
