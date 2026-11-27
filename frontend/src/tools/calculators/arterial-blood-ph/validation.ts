import { calculateArterialBloodPh, parseNumber } from './calculation';
import type {
  ArterialBloodPhFieldErrors,
  ArterialBloodPhInput,
  ArterialBloodPhResult,
} from './types';

export interface ArterialBloodPhValidation {
  errors: ArterialBloodPhFieldErrors;
  result: ArterialBloodPhResult | null;
}

function checkPositive(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be positive.`;
  return undefined;
}

export function validateArterialBloodPhInput(
  input: ArterialBloodPhInput,
): ArterialBloodPhValidation {
  const errors: ArterialBloodPhFieldErrors = {};

  const hcoErr = checkPositive(input.bicarbonateText, 'bicarbonate');
  if (hcoErr) errors.bicarbonateText = hcoErr;

  const pcoErr = checkPositive(input.paco2Text, 'PaCO₂');
  if (pcoErr) errors.paco2Text = pcoErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateArterialBloodPh(input),
  };
}
