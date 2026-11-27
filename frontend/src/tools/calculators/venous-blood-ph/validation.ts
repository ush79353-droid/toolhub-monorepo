import { calculateVenousBloodPh, parseNumber } from './calculation';
import type {
  VenousBloodPhFieldErrors,
  VenousBloodPhInput,
  VenousBloodPhResult,
} from './types';

export interface VenousBloodPhValidation {
  errors: VenousBloodPhFieldErrors;
  result: VenousBloodPhResult | null;
}

function checkPositive(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be positive.`;
  return undefined;
}

export function validateVenousBloodPhInput(
  input: VenousBloodPhInput,
): VenousBloodPhValidation {
  const errors: VenousBloodPhFieldErrors = {};

  const hcoErr = checkPositive(input.bicarbonateText, 'bicarbonate');
  if (hcoErr) errors.bicarbonateText = hcoErr;

  const pcoErr = checkPositive(input.paco2Text, 'PaCO₂');
  if (pcoErr) errors.paco2Text = pcoErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateVenousBloodPh(input),
  };
}
