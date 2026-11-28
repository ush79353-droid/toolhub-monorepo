import { calculateDressSizeResults, convertToCm } from './calculation';
import type {
  DressSizeFieldErrors,
  DressSizeInput,
  DressSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateDressMeasurements(input: DressSizeInput): {
  errors: DressSizeFieldErrors;
  result: DressSizeResult | null;
} {
  const errors: DressSizeFieldErrors = {};
  const bust = parseNumber(input.bust);
  const waist = parseNumber(input.waist);
  const hips = parseNumber(input.hips);

  if (bust == null) errors.bust = 'Enter bust circumference.';
  else if (bust <= 0) errors.bust = 'Bust must be greater than zero.';
  if (waist == null) errors.waist = 'Enter waist circumference.';
  else if (waist <= 0) errors.waist = 'Waist must be greater than zero.';
  if (hips == null) errors.hips = 'Enter hip circumference.';
  else if (hips <= 0) errors.hips = 'Hips must be greater than zero.';

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateDressSizeResults({
    bustCm: convertToCm(bust!, input.unit),
    waistCm: convertToCm(waist!, input.unit),
    hipsCm: convertToCm(hips!, input.unit),
    fitPreference: input.fitPreference,
  });

  return { errors, result };
}
