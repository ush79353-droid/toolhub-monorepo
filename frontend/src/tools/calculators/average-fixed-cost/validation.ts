import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateAverageFixedCost } from './calculation';
import type { AverageFixedCostFieldErrors, AverageFixedCostInput } from './types';

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

export function validateAverageFixedCostInput(input: AverageFixedCostInput): {
  isValid: boolean;
  errors: AverageFixedCostFieldErrors;
  parsed:
    | { totalFixedCost: number; numberOfUnits: number; currency: AverageFixedCostInput['currency'] }
    | null;
} {
  const errors: AverageFixedCostFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  const cost = parseNumber(input.totalFixedCost);
  const units = parseNumber(input.numberOfUnits);

  if (cost.blank || units.blank) {
    return { isValid: false, errors, parsed: null };
  }

  if (cost.invalid || cost.value === null) {
    errors.totalFixedCost = 'Enter a valid total fixed cost';
  } else if (cost.value < 0) {
    errors.totalFixedCost = 'Total fixed cost cannot be negative';
  }

  if (units.invalid || units.value === null) {
    errors.numberOfUnits = 'Enter a valid number of units';
  } else if (units.value <= 0) {
    errors.numberOfUnits = 'Number of units must be greater than zero';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, parsed: null };
  }

  const average = calculateAverageFixedCost(cost.value!, units.value!);
  if (!Number.isFinite(average)) {
    errors.form = 'This combination does not produce a finite average fixed cost.';
    return { isValid: false, errors, parsed: null };
  }

  return {
    isValid: true,
    errors,
    parsed: {
      totalFixedCost: cost.value!,
      numberOfUnits: units.value!,
      currency: input.currency,
    },
  };
}
