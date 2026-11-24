import { calculateKatchMcardle, parseNumber } from './calculation';
import type {
  KatchMcardleFieldErrors,
  KatchMcardleInput,
  KatchMcardleResult,
} from './types';

export interface KatchMcardleValidation {
  errors: KatchMcardleFieldErrors;
  result: KatchMcardleResult | null;
}

export function validateKatchMcardleInput(
  input: KatchMcardleInput,
): KatchMcardleValidation {
  const errors: KatchMcardleFieldErrors = {};

  if (input.lbmMode === 'known_lbm') {
    if (input.leanMassText.trim() !== '') {
      const n = parseNumber(input.leanMassText);
      if (n === null) errors.leanMassText = 'Enter a valid lean body mass.';
      else if (!(n > 0)) errors.leanMassText = 'Lean body mass must be positive.';
    }
  }

  if (input.lbmMode === 'body_fat' || input.lbmMode === 'unknown') {
    if (input.weightText.trim() !== '') {
      const w = parseNumber(input.weightText);
      if (w === null) errors.weightText = 'Enter a valid weight.';
      else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
    }
  }

  if (input.lbmMode === 'unknown') {
    if (input.heightText.trim() !== '') {
      const h = parseNumber(input.heightText);
      if (h === null) errors.heightText = 'Enter a valid height.';
      else if (!(h > 0)) errors.heightText = 'Height must be positive.';
    }
  }

  if (input.lbmMode === 'body_fat') {
    if (input.bodyFatText.trim() !== '') {
      const f = parseNumber(input.bodyFatText);
      if (f === null) errors.bodyFatText = 'Enter a valid body fat %.';
      else if (!(f >= 0 && f < 100))
        errors.bodyFatText = 'Body fat must be ≥ 0 and < 100%.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateKatchMcardle(input) };
}
