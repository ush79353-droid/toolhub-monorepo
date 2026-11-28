import {
  calculateJeansSizeResults,
  convertLengthToCm,
} from './calculation';
import type {
  JeansSizeFieldErrors,
  JeansSizeInput,
  JeansSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateJeansInputs(input: JeansSizeInput): {
  errors: JeansSizeFieldErrors;
  result: JeansSizeResult | null;
} {
  const errors: JeansSizeFieldErrors = {};
  const waist = parseNumber(input.waist);
  const inseam = parseNumber(input.inseam);
  const hips = parseNumber(input.hips);

  if (waist == null) errors.waist = 'Enter waist measurement.';
  else if (waist <= 0) errors.waist = 'Waist must be greater than zero.';
  else if (
    (input.waistUnit === 'cm' && waist > 200) ||
    (input.waistUnit === 'in' && waist > 80)
  ) {
    errors.waist = 'Waist measurement looks unrealistically large.';
  }

  if (inseam == null) errors.inseam = 'Enter inseam length.';
  else if (inseam <= 0) errors.inseam = 'Inseam must be greater than zero.';
  else if (
    (input.inseamUnit === 'cm' && inseam > 150) ||
    (input.inseamUnit === 'in' && inseam > 60)
  ) {
    errors.inseam = 'Inseam measurement looks unrealistically large.';
  }

  if (hips != null && hips <= 0) {
    errors.hips = 'Hip circumference must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateJeansSizeResults({
    category: input.category,
    measurementMethod: input.measurementMethod,
    waistInputCm: convertLengthToCm(waist!, input.waistUnit),
    inseamCm: convertLengthToCm(inseam!, input.inseamUnit),
    hipsCm:
      hips != null ? convertLengthToCm(hips, input.hipsUnit) : null,
    preferredRegion: input.preferredRegion,
    fit: input.fit,
    rise: input.rise,
  });

  return { errors, result };
}
