import { calculateTylenolDosage } from './calculation';
import {
  getProduct,
  getSymptom,
  type TylenolDosageFieldErrors,
  type TylenolDosageInput,
  type TylenolDosageResult,
  TYLENOL_PRODUCTS,
  TYLENOL_SYMPTOMS,
} from './types';

export interface TylenolDosageValidation {
  isValid: boolean;
  errors: TylenolDosageFieldErrors;
  result: TylenolDosageResult | null;
}

export function validateTylenolDosageInput(
  input: TylenolDosageInput,
): TylenolDosageValidation {
  const errors: TylenolDosageFieldErrors = {};

  if (!TYLENOL_SYMPTOMS.some((s) => s.id === input.symptom)) {
    errors.symptom = 'Choose a symptom.';
  }
  if (!TYLENOL_PRODUCTS.some((p) => p.id === input.product)) {
    errors.product = 'Choose a Tylenol product.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  // Ensure getters succeed
  getSymptom(input.symptom);
  getProduct(input.product);

  return {
    isValid: true,
    errors: {},
    result: calculateTylenolDosage(input),
  };
}
