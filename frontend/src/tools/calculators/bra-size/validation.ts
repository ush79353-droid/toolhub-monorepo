import { calculateBraSizeResults, convertLengthToCm } from './calculation';
import type { BraFieldErrors, BraInput, BraResult } from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateBraMeasurements(input: BraInput): {
  errors: BraFieldErrors;
  result: BraResult | null;
} {
  const errors: BraFieldErrors = {};
  const underbust = parseNumber(input.underbust);
  const bust = parseNumber(input.bust);

  if (underbust == null) errors.underbust = 'Enter underbust circumference.';
  else if (underbust <= 0)
    errors.underbust = 'Underbust must be greater than zero.';

  if (bust == null) errors.bust = 'Enter bust circumference.';
  else if (bust <= 0) errors.bust = 'Bust must be greater than zero.';

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const underbustCm = convertLengthToCm(underbust!, input.unit);
  const bustCm = convertLengthToCm(bust!, input.unit);

  const result = calculateBraSizeResults({
    underbustCm,
    bustCm,
    region: input.region,
    bandMethod: input.bandMethod,
  });

  return { errors, result };
}

export const validateBraInputs = validateBraMeasurements;
