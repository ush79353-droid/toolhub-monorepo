import { calculateAlbuminGlobulinRatio, parseNumber } from './calculation';
import type {
  AlbuminGlobulinRatioFieldErrors,
  AlbuminGlobulinRatioInput,
  AlbuminGlobulinRatioResult,
} from './types';

export interface AlbuminGlobulinRatioValidation {
  errors: AlbuminGlobulinRatioFieldErrors;
  result: AlbuminGlobulinRatioResult | null;
}

export function validateAlbuminGlobulinRatioInput(
  input: AlbuminGlobulinRatioInput,
): AlbuminGlobulinRatioValidation {
  const errors: AlbuminGlobulinRatioFieldErrors = {};

  if (input.albuminText.trim() !== '') {
    const a = parseNumber(input.albuminText);
    if (a === null) errors.albuminText = 'Enter a valid albumin value.';
    else if (a < 0) errors.albuminText = 'Albumin must be non-negative.';
  }

  if (input.totalProteinText.trim() !== '') {
    const t = parseNumber(input.totalProteinText);
    if (t === null) errors.totalProteinText = 'Enter a valid total protein value.';
    else if (t < 0) errors.totalProteinText = 'Total protein must be non-negative.';
  }

  const albumin = parseNumber(input.albuminText);
  const total = parseNumber(input.totalProteinText);
  if (
    albumin !== null &&
    total !== null &&
  !errors.albuminText &&
    !errors.totalProteinText &&
    total < albumin
  ) {
    errors.totalProteinText = 'Total protein must be ≥ albumin.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAlbuminGlobulinRatio(input),
  };
}