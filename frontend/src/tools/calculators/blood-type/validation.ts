import { calculateBloodType } from './calculation';
import type {
  BloodTypeFieldErrors,
  BloodTypeInput,
  BloodTypeResult,
} from './types';

export interface BloodTypeValidation {
  errors: BloodTypeFieldErrors;
  result: BloodTypeResult | null;
}

export function validateBloodTypeInput(
  input: BloodTypeInput,
): BloodTypeValidation {
  const errors: BloodTypeFieldErrors = {};

  if (input.motherBloodType === '') {
    errors.motherBloodType = 'Select mother’s blood type.';
  }
  if (input.fatherBloodType === '') {
    errors.fatherBloodType = 'Select father’s blood type.';
  }

  return {
    errors,
    result: calculateBloodType(input),
  };
}