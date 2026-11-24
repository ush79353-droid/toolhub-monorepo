/**
 * Sodium in Salt Calculator — UI stub validation (engine commit replaces).
 */

import { calculateSodiumInSalt } from './calculation';
import type {
  SodiumInSaltFieldErrors,
  SodiumInSaltInput,
  SodiumInSaltResult,
} from './types';

export interface SodiumInSaltValidation {
  errors: SodiumInSaltFieldErrors;
  result: SodiumInSaltResult | null;
}

export function validateSodiumInSaltInput(
  input: SodiumInSaltInput,
): SodiumInSaltValidation {
  return { errors: {}, result: calculateSodiumInSalt(input) };
}
