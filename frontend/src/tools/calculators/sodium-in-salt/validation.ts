/**
 * Sodium in Salt Calculator — pure input validation (ADR-018).
 */

import { calculateSodiumInSalt, parseNumber } from './calculation';
import type {
  SodiumInSaltFieldErrors,
  SodiumInSaltInput,
  SodiumInSaltResult,
} from './types';

export interface SodiumInSaltValidation {
  errors: SodiumInSaltFieldErrors;
  result: SodiumInSaltResult | null;
}

function validateNonNegative(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label} value.`;
  if (n < 0) return `${label} must be non-negative.`;
  return undefined;
}

export function validateSodiumInSaltInput(
  input: SodiumInSaltInput,
): SodiumInSaltValidation {
  const errors: SodiumInSaltFieldErrors = {};

  if (input.source === 'salt') {
    const err = validateNonNegative(input.saltAmountText, 'salt amount');
    if (err) errors.saltAmountText = err;
  } else if (input.source === 'sodium') {
    const err = validateNonNegative(input.sodiumAmountText, 'sodium amount');
    if (err) errors.sodiumAmountText = err;
  } else {
    const err = validateNonNegative(input.pureSaltText, 'pure salt (NaCl)');
    if (err) errors.pureSaltText = err;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateSodiumInSalt(input) };
}
