/**
 * Protein Calculator — UI stub validation (engine commit replaces).
 */

import { calculateProtein } from './calculation';
import type { ProteinFieldErrors, ProteinInput, ProteinResult } from './types';

export interface ProteinValidation {
  errors: ProteinFieldErrors;
  result: ProteinResult | null;
}

export function validateProteinInput(input: ProteinInput): ProteinValidation {
  return { errors: {}, result: calculateProtein(input) };
}
