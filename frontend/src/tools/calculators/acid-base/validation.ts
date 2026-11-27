import { calculateAcidBase, parseNumber } from './calculation';
import type {
  AcidBaseFieldErrors,
  AcidBaseInput,
  AcidBaseResult,
} from './types';

export interface AcidBaseValidation {
  errors: AcidBaseFieldErrors;
  result: AcidBaseResult | null;
}

function checkOptional(
  raw: string,
  label: string,
  opts?: { min?: number; max?: number },
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (opts?.min !== undefined && n < opts.min) {
    return `${label} must be ≥ ${opts.min}.`;
  }
  if (opts?.max !== undefined && n > opts.max) {
    return `${label} must be ≤ ${opts.max}.`;
  }
  return undefined;
}

export function validateAcidBaseInput(input: AcidBaseInput): AcidBaseValidation {
  const errors: AcidBaseFieldErrors = {};

  const phErr = checkOptional(input.phText, 'pH', { min: 6.5, max: 8.0 });
  if (phErr) errors.phText = phErr;

  const pco2Err = checkOptional(input.pco2Text, 'PCO₂', { min: 0 });
  if (pco2Err) errors.pco2Text = pco2Err;

  const hcoErr = checkOptional(input.bicarbonateText, 'bicarbonate', {
    min: 0,
  });
  if (hcoErr) errors.bicarbonateText = hcoErr;

  const clErr = checkOptional(input.chlorideText, 'chloride', { min: 0 });
  if (clErr) errors.chlorideText = clErr;

  const naErr = checkOptional(input.sodiumText, 'sodium', { min: 0 });
  if (naErr) errors.sodiumText = naErr;

  const albErr = checkOptional(input.albuminText, 'albumin', { min: 0 });
  if (albErr) errors.albuminText = albErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAcidBase(input),
  };
}
