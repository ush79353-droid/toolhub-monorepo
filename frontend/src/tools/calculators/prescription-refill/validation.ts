/**
 * Prescription Refill Calculator — UI stub validation (engine commit replaces).
 */

import { calculatePrescriptionRefill } from './calculation';
import type {
  PrescriptionRefillFieldErrors,
  PrescriptionRefillInput,
  PrescriptionRefillResult,
} from './types';

export interface PrescriptionRefillValidation {
  isValid: boolean;
  errors: PrescriptionRefillFieldErrors;
  result: PrescriptionRefillResult | null;
}

export function validatePrescriptionRefillInput(
  input: PrescriptionRefillInput,
): PrescriptionRefillValidation {
  return {
    isValid: false,
    errors: {},
    result: calculatePrescriptionRefill(input),
  };
}
