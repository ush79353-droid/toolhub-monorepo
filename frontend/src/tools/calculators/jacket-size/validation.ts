import {
  calculateJacketSizeResults,
  convertCircumferenceToCm,
  convertHeightToCm,
} from './calculation';
import type {
  JacketSizeFieldErrors,
  JacketSizeInput,
  JacketSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateJacketInputs(input: JacketSizeInput): {
  errors: JacketSizeFieldErrors;
  result: JacketSizeResult | null;
} {
  const errors: JacketSizeFieldErrors = {};
  const chest = parseNumber(input.chest);
  const height = parseNumber(input.height);
  const inchesPart = parseNumber(input.heightInchesPart) ?? 0;
  const hips = parseNumber(input.hips);

  if (chest == null) errors.chest = 'Enter chest circumference.';
  else if (chest <= 0) errors.chest = 'Chest must be greater than zero.';
  else if (
    (input.chestUnit === 'cm' && chest > 200) ||
    (input.chestUnit === 'in' && chest > 80)
  ) {
    errors.chest = 'Chest measurement looks unrealistically large.';
  }

  if (height != null) {
    if (height <= 0) errors.height = 'Height must be greater than zero.';
    else if (input.heightUnit === 'ft' && (inchesPart < 0 || inchesPart >= 12)) {
      errors.height = 'Inches part must be between 0 and 11.';
    }
  }

  if (hips != null && hips <= 0) {
    errors.hips = 'Hip circumference must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const heightCm =
    height != null
      ? convertHeightToCm(
          height,
          input.heightUnit,
          input.heightUnit === 'ft' ? inchesPart : 0,
        )
      : null;

  const result = calculateJacketSizeResults({
    category: input.category,
    chestCm: convertCircumferenceToCm(chest!, input.chestUnit),
    heightCm,
    hipsCm:
      hips != null ? convertCircumferenceToCm(hips, input.hipsUnit) : null,
    fitPreference: input.fitPreference,
    jacketStyle: input.jacketStyle,
    preferredRegion: input.preferredRegion,
  });

  return { errors, result };
}
