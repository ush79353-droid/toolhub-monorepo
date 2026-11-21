import { calculatePercentOffFromInput } from './calculation';
import type {
  PercentOffFieldErrors,
  PercentOffInput,
  PercentOffResult,
} from './types';

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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export interface PercentOffValidation {
  isValid: boolean;
  errors: PercentOffFieldErrors;
  result: PercentOffResult | null;
}

function hasErrors(errors: PercentOffFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

function validatePct(
  raw: string,
  field: 'discountPercent' | 'additionalDiscountPercent',
  errors: PercentOffFieldErrors,
  opts?: { allow100?: boolean; forReverse?: boolean },
) {
  const p = parseNumber(raw);
  if (p.blank) {
    errors[field] = 'Please enter a valid percent off.';
    return;
  }
  if (p.invalid || p.value == null) {
    errors[field] = 'Please enter a valid percent off.';
    return;
  }
  if (p.value < 0) {
    errors[field] = 'Discount cannot be negative.';
    return;
  }
  if (opts?.forReverse && p.value >= 100) {
    errors[field] =
      'A 100% discount cannot uniquely recover the original price.';
    return;
  }
  if (!opts?.forReverse && p.value > 100) {
    errors[field] = 'Percent off cannot exceed 100%.';
  }
}

export function collectFieldErrors(
  input: PercentOffInput,
): PercentOffFieldErrors {
  const errors: PercentOffFieldErrors = {};

  if (input.solveMode === 'finalPrice') {
    const o = parseNumber(input.originalPrice);
    if (!o.blank) {
      if (o.invalid || o.value == null) {
        errors.originalPrice = 'Please enter a valid original price.';
      } else if (o.value < 0) {
        errors.originalPrice = 'Original price cannot be negative.';
      }
    }
    if (!parseNumber(input.discountPercent).blank) {
      validatePct(input.discountPercent, 'discountPercent', errors);
    }
    if (input.enableAdditionalDiscount) {
      if (!parseNumber(input.additionalDiscountPercent).blank) {
        validatePct(
          input.additionalDiscountPercent,
          'additionalDiscountPercent',
          errors,
        );
      }
    }
  } else if (input.solveMode === 'originalPrice') {
    const s = parseNumber(input.salePrice);
    if (!s.blank) {
      if (s.invalid || s.value == null) {
        errors.salePrice = 'Please enter a valid sale price.';
      } else if (s.value < 0) {
        errors.salePrice = 'Sale price cannot be negative.';
      }
    }
    if (!parseNumber(input.discountPercent).blank) {
      validatePct(input.discountPercent, 'discountPercent', errors, {
        forReverse: true,
      });
    }
  } else {
    const o = parseNumber(input.originalPrice);
    const s = parseNumber(input.salePrice);
    if (!o.blank) {
      if (o.invalid || o.value == null) {
        errors.originalPrice = 'Please enter a valid original price.';
      } else if (o.value < 0) {
        errors.originalPrice = 'Original price cannot be negative.';
      } else if (o.value === 0) {
        errors.originalPrice =
          'Original price must be greater than zero to find percent off.';
      }
    }
    if (!s.blank) {
      if (s.invalid || s.value == null) {
        errors.salePrice = 'Please enter a valid sale price.';
      } else if (s.value < 0) {
        errors.salePrice = 'Sale price cannot be negative.';
      } else if (
        o.value != null &&
        !o.blank &&
        !o.invalid &&
        s.value > o.value
      ) {
        errors.salePrice = 'Sale price cannot exceed the original price.';
      }
    }
  }

  if (input.showSalesTaxSection && input.applySalesTax) {
    const t = parseNumber(input.salesTaxRate);
    if (t.blank) {
      errors.salesTaxRate = 'Please enter a valid sales tax rate.';
    } else if (t.invalid || t.value == null || t.value < 0) {
      errors.salesTaxRate = 'Sales tax rate cannot be negative.';
    }
  }

  return errors;
}

export function validatePercentOffInput(
  input: PercentOffInput,
): PercentOffValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const needs =
    input.solveMode === 'finalPrice'
      ? [
          input.originalPrice,
          input.discountPercent,
          ...(input.enableAdditionalDiscount
            ? [input.additionalDiscountPercent]
            : []),
        ]
      : input.solveMode === 'originalPrice'
        ? [input.salePrice, input.discountPercent]
        : [input.originalPrice, input.salePrice];

  if (needs.some((v) => v.trim() === '')) {
    return { isValid: false, errors: {}, result: null };
  }

  const result = calculatePercentOffFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form:
          input.solveMode === 'originalPrice' &&
          parseNumber(input.discountPercent).value === 100
            ? 'A 100% discount cannot uniquely recover the original price.'
            : 'The selected inputs do not produce a valid result.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
