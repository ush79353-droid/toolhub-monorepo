import { calculateBenadrylDosage, parseAgeYears } from './calculation';
import type {
  BenadrylDosageFieldErrors,
  BenadrylDosageInput,
  BenadrylDosageResult,
} from './types';
import { BENADRYL_PRODUCTS } from './products';

export interface BenadrylDosageValidation {
  isValid: boolean;
  errors: BenadrylDosageFieldErrors;
  result: BenadrylDosageResult | null;
}

export function validateBenadrylDosageInput(
  input: BenadrylDosageInput,
): BenadrylDosageValidation {
  const errors: BenadrylDosageFieldErrors = {};

  if (!BENADRYL_PRODUCTS.some((p) => p.id === input.productId)) {
    errors.productId = 'Select a supported Benadryl® product.';
  }

  const parsed = parseAgeYears(input.ageYearsText);
  if (parsed === 'invalid') {
    errors.ageYearsText = 'Enter a valid age from 0 to 120 years.';
  }

  if (Object.keys(errors).length > 0) {
    // Still show product indication / max-dose note when only age is invalid.
    const shell = calculateBenadrylDosage({
      ...input,
      ageYearsText: '',
      productId: errors.productId ? 'ultratab' : input.productId,
    });
    return { isValid: false, errors, result: shell };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateBenadrylDosage(input),
  };
}
