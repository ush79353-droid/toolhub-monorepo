import {
  calculateTramadolDosage,
  parseNumber,
  TABLET_STRENGTHS,
} from './calculation';
import type {
  TramadolDosageFieldErrors,
  TramadolDosageInput,
  TramadolDosageResult,
} from './types';

export interface TramadolDosageValidation {
  isValid: boolean;
  errors: TramadolDosageFieldErrors;
  result: TramadolDosageResult;
}

export function collectFieldErrors(
  input: TramadolDosageInput,
): TramadolDosageFieldErrors {
  const errors: TramadolDosageFieldErrors = {};

  if (!TABLET_STRENGTHS.includes(input.tabletStrengthMg)) {
    errors.form = 'Select a tablet strength.';
  }

  if (input.dailyMg.trim() !== '') {
    const n = parseNumber(input.dailyMg);
    if (n == null) errors.dailyMg = 'Enter a valid daily amount in mg.';
    else if (!(n > 0)) errors.dailyMg = 'Daily amount must be greater than zero.';
    else if (n > 10000) errors.dailyMg = 'Daily amount is unrealistically high.';
  }

  if (input.tablets.trim() !== '') {
    const n = parseNumber(input.tablets);
    if (n == null) errors.tablets = 'Enter a valid tablet count.';
    else if (!(n > 0)) errors.tablets = 'Tablet count must be greater than zero.';
    else if (n > 40) errors.tablets = 'Tablet count is unrealistically high.';
  }

  return errors;
}

export function hasFieldErrors(errors: TramadolDosageFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateTramadolDosageInput(
  input: TramadolDosageInput,
): TramadolDosageValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return {
      isValid: false,
      errors,
      result: calculateTramadolDosage({
        ...input,
        dailyMg: errors.dailyMg ? '' : input.dailyMg,
        tablets: errors.tablets ? '' : input.tablets,
      }),
    };
  }
  return {
    isValid: true,
    errors: {},
    result: calculateTramadolDosage(input),
  };
}
