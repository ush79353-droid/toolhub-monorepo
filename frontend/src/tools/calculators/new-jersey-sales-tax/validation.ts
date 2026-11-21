import { calculateNewJerseySalesTax, isValidNewJerseyZip } from './calculation';
import type {
  NewJerseySalesTaxFieldErrors,
  NewJerseySalesTaxInput,
  NewJerseySalesTaxResult,
} from './types';

export interface NewJerseySalesTaxValidation {
  isValid: boolean;
  errors: NewJerseySalesTaxFieldErrors;
  result: NewJerseySalesTaxResult | null;
}

function parsePurchaseAmount(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

/**
 * Nonnegative purchase amount + valid NJ ZIP (string, 07001–08989).
 * Empty fields are soft (no result) unless partially filled with invalid data.
 */
export function validateNewJerseySalesTaxInput(
  input: NewJerseySalesTaxInput,
): NewJerseySalesTaxValidation {
  const errors: NewJerseySalesTaxFieldErrors = {};
  const purchase = parsePurchaseAmount(input.purchaseAmount);
  const zip = input.zipCode.trim();

  const purchaseEmpty = purchase.blank;
  const zipEmpty = zip === '';

  if (purchaseEmpty && zipEmpty) {
    return { isValid: false, errors: {}, result: null };
  }

  if (!purchaseEmpty) {
    if (purchase.invalid || purchase.value === null) {
      errors.purchaseAmount = 'Enter a valid purchase amount.';
    } else if (purchase.value < 0) {
      errors.purchaseAmount = 'Purchase amount cannot be negative.';
    }
  } else {
    errors.purchaseAmount = 'Enter a purchase amount.';
  }

  if (!zipEmpty) {
    if (!/^\d{5}$/.test(zip)) {
      errors.zipCode = 'Enter a five-digit ZIP code.';
    } else if (!isValidNewJerseyZip(zip)) {
      errors.zipCode = 'Enter a valid New Jersey ZIP code (07001–08989).';
    }
  } else {
    errors.zipCode = 'Enter a New Jersey ZIP code.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateNewJerseySalesTax(purchase.value!, zip);
  if (!result) {
    errors.form = 'Unable to calculate sales tax with the given inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
