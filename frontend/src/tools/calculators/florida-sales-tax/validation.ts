import {
  calculateFloridaSalesTax,
  isValidFloridaZipFormat,
} from './calculation';
import type {
  FloridaSalesTaxFieldErrors,
  FloridaSalesTaxInput,
  FloridaSalesTaxResult,
} from './types';

export interface FloridaSalesTaxValidation {
  isValid: boolean;
  errors: FloridaSalesTaxFieldErrors;
  result: FloridaSalesTaxResult | null;
}

function parseAmount(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateFloridaSalesTaxInput(
  input: FloridaSalesTaxInput
): FloridaSalesTaxValidation {
  const errors: FloridaSalesTaxFieldErrors = {};
  const amount = parseAmount(input.purchaseAmount);
  const zip = input.zipCode.trim();

  if (!input.purchaseAmount.trim()) {
    errors.purchaseAmount = 'Enter a purchase amount.';
  } else if (amount === null) {
    errors.purchaseAmount = 'Enter a valid purchase amount.';
  } else if (amount < 0) {
    errors.purchaseAmount = 'Purchase amount cannot be negative.';
  }

  if (!zip) {
    errors.zipCode = 'Enter a five-digit ZIP code.';
  } else if (!/^\d{5}$/.test(zip)) {
    errors.zipCode = 'Enter a five-digit ZIP code.';
  } else if (!isValidFloridaZipFormat(zip)) {
    errors.zipCode = 'Enter a Florida ZIP code (32003–34997).';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateFloridaSalesTax(
    amount!,
    zip,
    input.selectedCountyFips.trim()
  );
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate Florida sales tax for these inputs.' },
      result: null,
    };
  }

  // Ambiguous ZIP is a valid partial state — show UI county picker, not a field error.
  if (result.status === 'ambiguous' || result.status === 'county_required') {
    return { isValid: true, errors: {}, result };
  }

  if (result.status === 'zip_unknown') {
    return { isValid: true, errors: {}, result };
  }

  return { isValid: true, errors: {}, result };
}
