/**
 * Tylenol Overdose Calculator — UI stub validation (engine commit replaces).
 */

import { calculateTylenolOverdose } from './calculation';
import type {
  TylenolOverdoseFieldErrors,
  TylenolOverdoseInput,
  TylenolOverdoseResult,
} from './types';

export interface TylenolOverdoseValidation {
  errors: TylenolOverdoseFieldErrors;
  result: TylenolOverdoseResult | null;
}

export function validateTylenolOverdoseInput(
  input: TylenolOverdoseInput,
): TylenolOverdoseValidation {
  return { errors: {}, result: calculateTylenolOverdose(input) };
}
