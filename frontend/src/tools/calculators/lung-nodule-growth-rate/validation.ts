import { calculateLungNoduleGrowthRate, parseNumber, MIN_AGE } from './calculation';
import type {
  LungNoduleGrowthRateFieldErrors,
  LungNoduleGrowthRateInput,
  LungNoduleGrowthRateResult,
} from './types';

export interface LungNoduleGrowthRateValidation {
  errors: LungNoduleGrowthRateFieldErrors;
  result: LungNoduleGrowthRateResult | null;
}

export function validateLungNoduleGrowthRateInput(
  input: LungNoduleGrowthRateInput,
): LungNoduleGrowthRateValidation {
  const errors: LungNoduleGrowthRateFieldErrors = {};

  const ageRaw = input.ageText.trim();
  if (ageRaw !== '') {
    const age = parseNumber(input.ageText);
    if (age === null) errors.ageText = 'Enter a valid age.';
    else if (age < MIN_AGE) errors.ageText = 'Age must be at least 18.';
  }

  const countRaw = input.countText.trim();
  if (countRaw !== '') {
    const count = parseNumber(input.countText);
    if (count === null || count < 1) {
      errors.countText = 'Enter a nodule count ≥ 1.';
    }
  }

  const sizeRaw = input.sizeText.trim();
  if (sizeRaw !== '') {
    const size = parseNumber(input.sizeText);
    if (size === null || size <= 0) {
      errors.sizeText = 'Enter a size greater than 0 mm.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateLungNoduleGrowthRate(input) };
}
