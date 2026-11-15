import { isSupportedCurrency } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateLernerIndex } from './calculation';
import type { LernerIndexFieldErrors, LernerIndexInput, LernerIndexResult } from './types';

function parseOptionalNumber(value: string): number | null | typeof Number.NaN {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateLernerIndexInput(input: LernerIndexInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: LernerIndexFieldErrors;
  result: LernerIndexResult | null;
} {
  const errors: LernerIndexFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  const price = parseOptionalNumber(input.price);
  const marginalCost = parseOptionalNumber(input.marginalCost);

  if (price === null || marginalCost === null) {
    return {
      isValid: false,
      incomplete: Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  if (Number.isNaN(price) || price <= 0) {
    errors.price = 'Price must be greater than zero';
  }
  if (Number.isNaN(marginalCost) || marginalCost < 0) {
    errors.marginalCost = 'Enter a valid non-negative marginal cost';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateLernerIndex(price, marginalCost, input.currency as SupportedCurrency);
  if (!result) {
    errors.form = 'This combination does not produce a finite Lerner index.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
