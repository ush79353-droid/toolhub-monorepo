import { calculateMelatoninDosage, parseDurationDays } from './calculation';
import {
  getIndication,
  getMedicationType,
  type MelatoninDosageFieldErrors,
  type MelatoninDosageInput,
  type MelatoninDosageResult,
} from './types';

export interface MelatoninDosageValidation {
  isValid: boolean;
  errors: MelatoninDosageFieldErrors;
  result: MelatoninDosageResult | null;
}

export function collectFieldErrors(
  input: MelatoninDosageInput
): MelatoninDosageFieldErrors {
  const errors: MelatoninDosageFieldErrors = {};
  if (!getIndication(input.indication)) {
    errors.indication = 'Choose a valid indication.';
  }
  if (!getMedicationType(input.medicationType)) {
    errors.medicationType = 'Choose a valid medication type.';
  }
  const duration = parseDurationDays(input.durationText, input.durationUnit);
  if (duration.error) {
    errors.durationText = duration.error;
  }
  return errors;
}

export function hasFieldErrors(errors: MelatoninDosageFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateMelatoninDosageInput(
  input: MelatoninDosageInput
): MelatoninDosageValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateMelatoninDosage(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to resolve label information for this combination.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
