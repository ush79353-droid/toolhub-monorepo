import { calculateRoce } from './calculation';
import type { RoceFieldErrors, RoceInput, RoceResult } from './types';

export interface RoceValidation {
  isValid: boolean;
  errors: RoceFieldErrors;
  result: RoceResult | null;
}

function parseNumber(raw: string): {
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

export function validateRoceInput(input: RoceInput): RoceValidation {
  const errors: RoceFieldErrors = {};

  const ebit = parseNumber(input.ebit);
  if (!ebit.blank && (ebit.invalid || ebit.value === null)) {
    errors.ebit = 'Enter a valid EBIT.';
  }

  let balanceA = { value: null as number | null, blank: true, invalid: false };
  let balanceB = { value: null as number | null, blank: true, invalid: false };

  if (input.method === 'assets') {
    balanceA = parseNumber(input.totalAssets);
    balanceB = parseNumber(input.currentLiabilities);
    if (!balanceA.blank && (balanceA.invalid || balanceA.value === null)) {
      errors.totalAssets = 'Enter a valid total assets amount.';
    }
    if (!balanceB.blank && (balanceB.invalid || balanceB.value === null)) {
      errors.currentLiabilities = 'Enter a valid current liabilities amount.';
    }
  } else {
    balanceA = parseNumber(input.totalEquity);
    balanceB = parseNumber(input.nonCurrentLiabilities);
    if (!balanceA.blank && (balanceA.invalid || balanceA.value === null)) {
      errors.totalEquity = 'Enter a valid total equity amount.';
    }
    if (!balanceB.blank && (balanceB.invalid || balanceB.value === null)) {
      errors.nonCurrentLiabilities = 'Enter a valid non-current liabilities amount.';
    }
  }

  const incomplete =
    ebit.blank ||
    balanceA.blank ||
    balanceB.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateRoce({
    method: input.method,
    ebit: ebit.value!,
    totalAssets: input.method === 'assets' ? balanceA.value! : 0,
    currentLiabilities: input.method === 'assets' ? balanceB.value! : 0,
    totalEquity: input.method === 'equity' ? balanceA.value! : 0,
    nonCurrentLiabilities: input.method === 'equity' ? balanceB.value! : 0,
    currency: input.currency,
  });

  if (!result) {
    errors.form =
      'Capital employed must be greater than zero to calculate ROCE.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
