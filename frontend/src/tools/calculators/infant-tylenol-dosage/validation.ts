import {
  ageToYears,
  calculateInfantTylenolDosage,
  parseNumber,
  weightToLb,
} from './calculation';
import { PRODUCT_OPTIONS } from './products';
import type {
  InfantTylenolDosageFieldErrors,
  InfantTylenolDosageInput,
  InfantTylenolDosageResult,
  InfantTylenolProductId,
} from './types';

const PRODUCT_IDS = new Set(
  PRODUCT_OPTIONS.map((p) => p.id),
) as Set<InfantTylenolProductId>;

export interface InfantTylenolValidation {
  isValid: boolean;
  errors: InfantTylenolDosageFieldErrors;
  result: InfantTylenolDosageResult | null;
}

export function validateInfantTylenolDosageInput(
  input: InfantTylenolDosageInput,
): InfantTylenolValidation {
  const errors: InfantTylenolDosageFieldErrors = {};

  if (input.ageText.trim() !== '') {
    const age = parseNumber(input.ageText);
    if (age == null) {
      errors.ageText = 'Enter a valid age.';
    } else if (age < 0) {
      errors.ageText = 'Age cannot be negative.';
    } else {
      const years = ageToYears(age, input.ageUnit);
      if (years > 18) {
        errors.ageText = 'This pediatric chart supports ages through childhood only.';
      }
    }
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w == null) {
      errors.weightText = 'Enter a valid weight.';
    } else if (w <= 0) {
      errors.weightText = 'Weight must be greater than zero.';
    } else {
      const lb = weightToLb(w, input.weightUnit);
      if (lb > 250) {
        errors.weightText = 'Weight is outside the supported pediatric range.';
      }
    }
  }

  if (
    input.productId != null &&
    !PRODUCT_IDS.has(input.productId)
  ) {
    errors.productId = 'Select a valid medication type.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateInfantTylenolDosage(input);
  return { isValid: true, errors: {}, result };
}
