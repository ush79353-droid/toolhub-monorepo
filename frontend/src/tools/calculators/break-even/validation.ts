import { isSupportedCurrency } from '@/tools/shared/currency';
import type { BreakEvenFieldErrors, BreakEvenInput } from './types';

function parseNumber(raw: string): { blank: boolean; value: number | null; invalid: boolean } {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, value: null, invalid: false };
  if (/infinity|nan/i.test(trimmed)) {
    return { blank: false, value: null, invalid: true };
  }
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) {
    return { blank: false, value: null, invalid: true };
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { blank: false, value: null, invalid: true };
  }
  return { blank: false, value, invalid: false };
}

export function validateBreakEvenInput(input: BreakEvenInput): {
  isValid: boolean;
  errors: BreakEvenFieldErrors;
  parsed:
    | {
        revenuePerUnit: number;
        costPerUnit: number;
        fixedCosts: number;
        currency: BreakEvenInput['currency'];
      }
    | null;
} {
  const errors: BreakEvenFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  const revenue = parseNumber(input.revenuePerUnit);
  const cost = parseNumber(input.costPerUnit);
  const fixed = parseNumber(input.fixedCosts);

  if (revenue.blank || cost.blank || fixed.blank) {
    return { isValid: false, errors, parsed: null };
  }

  if (revenue.invalid || revenue.value === null) {
    errors.revenuePerUnit = 'Enter a valid revenue per unit';
  } else if (revenue.value < 0) {
    errors.revenuePerUnit = 'Revenue per unit cannot be negative';
  }

  if (cost.invalid || cost.value === null) {
    errors.costPerUnit = 'Enter a valid cost per unit';
  } else if (cost.value < 0) {
    errors.costPerUnit = 'Cost per unit cannot be negative';
  }

  if (fixed.invalid || fixed.value === null) {
    errors.fixedCosts = 'Enter a valid fixed costs amount';
  } else if (fixed.value < 0) {
    errors.fixedCosts = 'Fixed costs cannot be negative';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, parsed: null };
  }

  return {
    isValid: true,
    errors,
    parsed: {
      revenuePerUnit: revenue.value!,
      costPerUnit: cost.value!,
      fixedCosts: fixed.value!,
      currency: input.currency,
    },
  };
}
