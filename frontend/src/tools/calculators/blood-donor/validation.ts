import { calculateBloodDonor } from './calculation';
import type {
  BloodDonorFieldErrors,
  BloodDonorInput,
  BloodDonorResult,
} from './types';

export interface BloodDonorValidation {
  errors: BloodDonorFieldErrors;
  result: BloodDonorResult | null;
}

export function validateBloodDonorInput(
  input: BloodDonorInput,
): BloodDonorValidation {
  const errors: BloodDonorFieldErrors = {};
  if (input.bloodType === '') {
    return {
      errors,
      result: calculateBloodDonor(input),
    };
  }
  return {
    errors,
    result: calculateBloodDonor(input),
  };
}