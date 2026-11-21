import { calculateAleveDosage } from './calculation';
import {
  getDrugType,
  getIndication,
  type AleveDosageFieldErrors,
  type AleveDosageInput,
  type AleveDosageResult,
} from './types';

export interface AleveDosageValidation {
  isValid: boolean;
  errors: AleveDosageFieldErrors;
  result: AleveDosageResult | null;
}

export function collectFieldErrors(
  input: AleveDosageInput
): AleveDosageFieldErrors {
  const errors: AleveDosageFieldErrors = {};
  if (!getIndication(input.indication)) {
    errors.indication = 'Choose a valid indication.';
  }
  if (!getDrugType(input.drugType)) {
    errors.drugType = 'Choose a valid drug type.';
  }
  return errors;
}

export function hasFieldErrors(errors: AleveDosageFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateAleveDosageInput(
  input: AleveDosageInput
): AleveDosageValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateAleveDosage(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to resolve a label schedule for this combination.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
