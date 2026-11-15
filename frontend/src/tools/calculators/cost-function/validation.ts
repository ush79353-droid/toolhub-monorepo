import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  CALCULATION_METHODS,
  isFixedVariableMethod,
  type CostFunctionFieldErrors,
  type CostFunctionInput,
} from './types';

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

export function validateCostFunctionInput(input: CostFunctionInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: CostFunctionFieldErrors;
  parsed:
    | {
        method: 'fixed-variable';
        fixedCost: number;
        variableCostPerUnit: number;
        quantity: number;
        currency: CostFunctionInput['currency'];
      }
    | {
        method: 'two-points';
        quantity1: number;
        totalCost1: number;
        quantity2: number;
        totalCost2: number;
        currency: CostFunctionInput['currency'];
      }
    | null;
} {
  const errors: CostFunctionFieldErrors = {};

  if (!CALCULATION_METHODS.includes(input.method)) {
    errors.method = 'Choose a calculation method';
  }
  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, parsed: null };
  }

  if (isFixedVariableMethod(input)) {
    const fixed = parseNumber(input.fixedCost);
    const variable = parseNumber(input.variableCostPerUnit);
    const quantity = parseNumber(input.quantity);

    if (fixed.blank || variable.blank || quantity.blank) {
      return { isValid: false, incomplete: true, errors, parsed: null };
    }

    if (fixed.invalid || fixed.value === null) {
      errors.fixedCost = 'Enter a valid fixed cost';
    } else if (fixed.value < 0) {
      errors.fixedCost = 'Fixed cost cannot be negative';
    }

    if (variable.invalid || variable.value === null) {
      errors.variableCostPerUnit = 'Enter a valid variable cost per unit';
    } else if (variable.value < 0) {
      errors.variableCostPerUnit = 'Variable cost per unit cannot be negative';
    }

    if (quantity.invalid || quantity.value === null) {
      errors.quantity = 'Enter a valid quantity';
    } else if (quantity.value < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }

    if (Object.keys(errors).length > 0) {
      return { isValid: false, incomplete: false, errors, parsed: null };
    }

    return {
      isValid: true,
      incomplete: false,
      errors,
      parsed: {
        method: 'fixed-variable',
        fixedCost: fixed.value!,
        variableCostPerUnit: variable.value!,
        quantity: quantity.value!,
        currency: input.currency,
      },
    };
  }

  const q1 = parseNumber(input.quantity1);
  const c1 = parseNumber(input.totalCost1);
  const q2 = parseNumber(input.quantity2);
  const c2 = parseNumber(input.totalCost2);

  if (q1.blank || c1.blank || q2.blank || c2.blank) {
    return { isValid: false, incomplete: true, errors, parsed: null };
  }

  if (q1.invalid || q1.value === null) {
    errors.quantity1 = 'Enter a valid quantity at point 1';
  }
  if (c1.invalid || c1.value === null) {
    errors.totalCost1 = 'Enter a valid total cost at point 1';
  } else if (c1.value < 0) {
    errors.totalCost1 = 'Total cost cannot be negative';
  }
  if (q2.invalid || q2.value === null) {
    errors.quantity2 = 'Enter a valid quantity at point 2';
  }
  if (c2.invalid || c2.value === null) {
    errors.totalCost2 = 'Enter a valid total cost at point 2';
  } else if (c2.value < 0) {
    errors.totalCost2 = 'Total cost cannot be negative';
  }

  if (
    q1.value !== null &&
    q2.value !== null &&
    !q1.invalid &&
    !q2.invalid &&
    q1.value === q2.value
  ) {
    errors.form =
      'Quantities at point 1 and point 2 must differ so variable cost can be calculated.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, parsed: null };
  }

  return {
    isValid: true,
    incomplete: false,
    errors,
    parsed: {
      method: 'two-points',
      quantity1: q1.value!,
      totalCost1: c1.value!,
      quantity2: q2.value!,
      totalCost2: c2.value!,
      currency: input.currency,
    },
  };
}
