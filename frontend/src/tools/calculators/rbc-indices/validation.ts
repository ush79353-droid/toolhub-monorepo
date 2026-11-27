import { calculateRbcIndices, parseNumber } from './calculation';
import type {
  RbcIndicesFieldErrors,
  RbcIndicesInput,
  RbcIndicesResult,
} from './types';

export interface RbcIndicesValidation {
  errors: RbcIndicesFieldErrors;
  result: RbcIndicesResult | null;
}

function checkPositive(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be greater than zero.`;
  return undefined;
}

export function validateRbcIndicesInput(
  input: RbcIndicesInput,
): RbcIndicesValidation {
  const errors: RbcIndicesFieldErrors = {};

  const hbErr = checkPositive(input.hemoglobinText, 'Hemoglobin');
  if (hbErr) errors.hemoglobinText = hbErr;
  const hctErr = checkPositive(input.hematocritText, 'Hematocrit');
  if (hctErr) errors.hematocritText = hctErr;
  const rbcErr = checkPositive(input.rbcText, 'RBC count');
  if (rbcErr) errors.rbcText = rbcErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateRbcIndices(input),
  };
}
