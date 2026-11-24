import { calculateAlbuminCreatinineRatio, parseNumber } from './calculation';
import type {
  AlbuminCreatinineRatioFieldErrors,
  AlbuminCreatinineRatioInput,
  AlbuminCreatinineRatioResult,
} from './types';

export interface AlbuminCreatinineRatioValidation {
  errors: AlbuminCreatinineRatioFieldErrors;
  result: AlbuminCreatinineRatioResult | null;
}

export function validateAlbuminCreatinineRatioInput(
  input: AlbuminCreatinineRatioInput,
): AlbuminCreatinineRatioValidation {
  const errors: AlbuminCreatinineRatioFieldErrors = {};

  if (input.albuminText.trim() !== '') {
    const a = parseNumber(input.albuminText);
    if (a === null) errors.albuminText = 'Enter a valid albumin value.';
    else if (a < 0) errors.albuminText = 'Albumin must be non-negative.';
  }

  if (input.creatinineText.trim() !== '') {
    const c = parseNumber(input.creatinineText);
    if (c === null) errors.creatinineText = 'Enter a valid creatinine value.';
    else if (!(c > 0))
      errors.creatinineText = 'Creatinine must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAlbuminCreatinineRatio(input),
  };
}
