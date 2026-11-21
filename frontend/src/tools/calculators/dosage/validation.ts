import {
  calculateDosage,
  parseNumber,
  weightToKg,
} from './calculation';
import {
  FREQUENCY_OPTIONS,
  type DosageFieldErrors,
  type DosageInput,
  type DosageResult,
} from './types';

export interface DosageValidation {
  isValid: boolean;
  errors: DosageFieldErrors;
  result: DosageResult | null;
}

export function collectFieldErrors(input: DosageInput): DosageFieldErrors {
  const errors: DosageFieldErrors = {};

  if (
    input.dosageBasis !== 'per_day' &&
    input.dosageBasis !== 'per_administration'
  ) {
    errors.form = 'Select whether the dosage rate is per day or per administration.';
  }

  if (!FREQUENCY_OPTIONS.some((o) => o.id === input.frequencyId)) {
    errors.form = 'Select a valid frequency.';
  }

  const w = parseNumber(input.weight);
  if (input.weight.trim() === '') {
    errors.weight = 'Enter body weight.';
  } else if (w == null) {
    errors.weight = 'Enter a valid weight.';
  } else if (w <= 0) {
    errors.weight = 'Weight must be greater than zero.';
  } else if (weightToKg(w, input.weightUnit) > 500) {
    errors.weight = 'Weight is out of range.';
  }

  const d = parseNumber(input.dosagePerKg);
  if (input.dosagePerKg.trim() === '') {
    errors.dosagePerKg = 'Enter the prescribed dosage per kilogram.';
  } else if (d == null) {
    errors.dosagePerKg = 'Enter a valid dosage per kilogram.';
  } else if (d <= 0) {
    errors.dosagePerKg = 'Dosage per kilogram must be greater than zero.';
  }

  if (input.liquidOpen && input.concentration.trim() !== '') {
    const c = parseNumber(input.concentration);
    if (c == null) {
      errors.concentration = 'Enter a valid concentration.';
    } else if (c <= 0) {
      errors.concentration = 'Concentration must be greater than zero.';
    }
  }

  return errors;
}

export function hasFieldErrors(errors: DosageFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateDosageInput(input: DosageInput): DosageValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateDosage(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
