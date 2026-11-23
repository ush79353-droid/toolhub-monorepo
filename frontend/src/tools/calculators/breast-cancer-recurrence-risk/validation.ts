import { calculateBreastCancerRecurrenceRisk } from './calculation';
import type {
  BreastCancerRecurrenceFieldErrors,
  BreastCancerRecurrenceInput,
  BreastCancerRecurrenceResult,
} from './types';

export interface BreastCancerRecurrenceValidation {
  isValid: boolean;
  errors: BreastCancerRecurrenceFieldErrors;
  result: BreastCancerRecurrenceResult | null;
  incomplete: boolean;
}

export function validateBreastCancerRecurrenceInput(
  input: BreastCancerRecurrenceInput
): BreastCancerRecurrenceValidation {
  const errors: BreastCancerRecurrenceFieldErrors = {};
  const incomplete =
    input.grade === null ||
    input.lymphNodes === null ||
    input.lvi === null;

  if (incomplete) {
    return {
      isValid: false,
      errors,
      result: null,
      incomplete: true,
    };
  }

  const result = calculateBreastCancerRecurrenceRisk(input);
  if (!result) {
    errors.form = 'Unable to map this combination to a published risk.';
    return { isValid: false, errors, result: null, incomplete: false };
  }

  return { isValid: true, errors, result, incomplete: false };
}
