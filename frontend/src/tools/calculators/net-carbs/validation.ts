/**
 * Net Carbs Calculator — UI stub validation (engine commit replaces).
 */

import { calculateNetCarbs } from './calculation';
import type { NetCarbsFieldErrors, NetCarbsInput, NetCarbsResult } from './types';

export interface NetCarbsValidation {
  errors: NetCarbsFieldErrors;
  result: NetCarbsResult | null;
}

export function validateNetCarbsInput(input: NetCarbsInput): NetCarbsValidation {
  return { errors: {}, result: calculateNetCarbs(input) };
}
