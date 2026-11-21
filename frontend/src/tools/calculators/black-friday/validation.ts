import { calculateBlackFridayFromInput } from './calculation';
import type {
  BlackFridayFieldErrors,
  BlackFridayInput,
  BlackFridayResult,
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

export interface BlackFridayValidation {
  isValid: boolean;
  errors: BlackFridayFieldErrors;
  result: BlackFridayResult | null;
}

export function collectFieldErrors(
  input: BlackFridayInput,
): BlackFridayFieldErrors {
  const errors: BlackFridayFieldErrors = {};
  const { solveTarget } = input;

  if (solveTarget === 'finalPrice') {
    const orig = parseNumber(input.originalPrice);
    if (orig.blank) errors.originalPrice = 'Enter the original price.';
    else if (orig.invalid || orig.value == null)
      errors.originalPrice = 'Enter a valid original price.';
    else if (orig.value < 0)
      errors.originalPrice = 'Original price cannot be negative.';

    if (input.discountKind === 'percentage') {
      const d = parseNumber(input.discountPercentage);
      if (d.blank) errors.discountPercentage = 'Enter the discount percentage.';
      else if (d.invalid || d.value == null)
        errors.discountPercentage = 'Enter a valid discount percentage.';
      else if (d.value < 0 || d.value > 100)
        errors.discountPercentage = 'Discount must be between 0% and 100%.';

      if (input.enableSecondDiscount) {
        const s = parseNumber(input.secondDiscountPercentage);
        if (s.blank)
          errors.secondDiscountPercentage = 'Enter the second discount (%).';
        else if (s.invalid || s.value == null)
          errors.secondDiscountPercentage = 'Enter a valid second discount.';
        else if (s.value < 0 || s.value > 100)
          errors.secondDiscountPercentage =
            'Second discount must be between 0% and 100%.';
      }
    } else {
      const f = parseNumber(input.fixedDiscount);
      if (f.blank) errors.fixedDiscount = 'Enter the fixed discount amount.';
      else if (f.invalid || f.value == null)
        errors.fixedDiscount = 'Enter a valid fixed discount.';
      else if (f.value < 0)
        errors.fixedDiscount = 'Fixed discount cannot be negative.';
      else if (
        orig.value != null &&
        !orig.blank &&
        f.value > orig.value
      ) {
        errors.fixedDiscount =
          'Fixed discount cannot exceed the original price.';
      }
    }

    if (input.applySalesTax) {
      const t = parseNumber(input.salesTaxRate);
      if (t.blank) errors.salesTaxRate = 'Enter the sales tax rate.';
      else if (t.invalid || t.value == null)
        errors.salesTaxRate = 'Enter a valid sales tax rate.';
      else if (t.value < 0)
        errors.salesTaxRate = 'Sales tax rate cannot be negative.';
    }
  } else if (solveTarget === 'originalPrice') {
    const disc = parseNumber(input.discountedPrice);
    if (disc.blank)
      errors.discountedPrice = 'Enter the discounted (pre-tax) price.';
    else if (disc.invalid || disc.value == null)
      errors.discountedPrice = 'Enter a valid discounted price.';
    else if (disc.value < 0)
      errors.discountedPrice = 'Discounted price cannot be negative.';

    const d = parseNumber(input.discountPercentage);
    if (d.blank) errors.discountPercentage = 'Enter the discount percentage.';
    else if (d.invalid || d.value == null)
      errors.discountPercentage = 'Enter a valid discount percentage.';
    else if (d.value < 0 || d.value >= 100) {
      errors.discountPercentage =
        d.value === 100
          ? 'Original price cannot be recovered from a 100% discount (division by zero).'
          : 'Discount must be at least 0% and less than 100% for reverse original price.';
    }
  } else {
    const orig = parseNumber(input.originalPrice);
    if (orig.blank) errors.originalPrice = 'Enter the original price.';
    else if (orig.invalid || orig.value == null)
      errors.originalPrice = 'Enter a valid original price.';
    else if (!(orig.value > 0))
      errors.originalPrice = 'Original price must be greater than zero.';

    const disc = parseNumber(input.discountedPrice);
    if (disc.blank)
      errors.discountedPrice = 'Enter the discounted (pre-tax) price.';
    else if (disc.invalid || disc.value == null)
      errors.discountedPrice = 'Enter a valid discounted price.';
    else if (disc.value < 0)
      errors.discountedPrice = 'Discounted price cannot be negative.';
    else if (
      orig.value != null &&
      !orig.blank &&
      disc.value > orig.value
    ) {
      errors.discountedPrice =
        'Discounted price cannot exceed the original price.';
    }
  }

  return errors;
}

export function hasFieldErrors(errors: BlackFridayFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateBlackFridayInput(
  input: BlackFridayInput,
): BlackFridayValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateBlackFridayFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
