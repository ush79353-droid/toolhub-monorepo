import type {
  ChildTaxCreditFieldErrors,
  ChildTaxCreditInput,
  ChildTaxCreditResult,
} from './types';

export interface ChildTaxCreditValidation {
  isValid: boolean;
  errors: ChildTaxCreditFieldErrors;
  result: ChildTaxCreditResult | null;
}

/** UI-shell stub — replaced by IRS-verified validation in the engine commit. */
export function validateChildTaxCreditInput(
  _input: ChildTaxCreditInput
): ChildTaxCreditValidation {
  return { isValid: false, errors: {}, result: null };
}
