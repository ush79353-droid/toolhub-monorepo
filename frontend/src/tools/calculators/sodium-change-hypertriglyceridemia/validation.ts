import { calculateSodiumChange, parseNumber } from './calculation';
import type {
  SodiumChangeFieldErrors,
  SodiumChangeInput,
  SodiumChangeResult,
} from './types';

export interface SodiumChangeValidation {
  errors: SodiumChangeFieldErrors;
  result: SodiumChangeResult | null;
}

function checkFinite(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!Number.isFinite(n)) return `${label} must be finite.`;
  return undefined;
}

function checkPositive(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be positive.`;
  return undefined;
}

export function validateSodiumChangeInput(
  input: SodiumChangeInput,
): SodiumChangeValidation {
  const errors: SodiumChangeFieldErrors = {};

  const naErr = checkFinite(input.measuredSodiumText, 'measured serum sodium');
  if (naErr) errors.measuredSodiumText = naErr;

  const tgErr = checkPositive(input.triglyceridesText, 'serum triglycerides');
  if (tgErr) errors.triglyceridesText = tgErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateSodiumChange(input) };
}
