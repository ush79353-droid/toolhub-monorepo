/**
 * Warfarin dosing validation — UI stub.
 * Engine commit adds full field guards and wires calculateWarfarinDosing.
 */

import { calculateWarfarinDosing } from './calculation';
import type {
  WarfarinDosingFieldErrors,
  WarfarinDosingInput,
  WarfarinDosingResult,
} from './types';

export interface WarfarinDosingValidation {
  errors: WarfarinDosingFieldErrors;
  result: WarfarinDosingResult | null;
}

export function validateWarfarinDosingInput(
  input: WarfarinDosingInput,
): WarfarinDosingValidation {
  return {
    errors: {},
    result: calculateWarfarinDosing(input),
  };
}
