import { calculateAnionGap, parseNumber } from './calculation';
import type {
  AnionGapFieldErrors,
  AnionGapInput,
  AnionGapResult,
} from './types';

export interface AnionGapValidation {
  errors: AnionGapFieldErrors;
  result: AnionGapResult | null;
}

function checkElectrolyte(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n >= 0)) return `${label} must be non-negative.`;
  return undefined;
}

export function validateAnionGapInput(input: AnionGapInput): AnionGapValidation {
  const errors: AnionGapFieldErrors = {};

  const naErr = checkElectrolyte(input.sodiumText, 'sodium');
  if (naErr) errors.sodiumText = naErr;
  const clErr = checkElectrolyte(input.chlorideText, 'chloride');
  if (clErr) errors.chlorideText = clErr;
  const hcoErr = checkElectrolyte(input.bicarbonateText, 'bicarbonate');
  if (hcoErr) errors.bicarbonateText = hcoErr;

  if (input.potassiumText.trim() !== '') {
    const k = parseNumber(input.potassiumText);
    if (k === null) errors.potassiumText = 'Enter a valid potassium.';
    else if (k < 0) errors.potassiumText = 'Potassium must be non-negative.';
  }

  if (input.albuminText.trim() !== '') {
    const a = parseNumber(input.albuminText);
    if (a === null) errors.albuminText = 'Enter a valid albumin.';
    else if (a < 0) errors.albuminText = 'Albumin must be non-negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAnionGap(input),
  };
}
