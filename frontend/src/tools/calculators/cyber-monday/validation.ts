import { calculateCyberMondayFromInput } from './calculation';
import type {
  CyberMondayFieldErrors,
  CyberMondayInput,
  CyberMondayResult,
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

export interface CyberMondayValidation {
  isValid: boolean;
  errors: CyberMondayFieldErrors;
  result: CyberMondayResult | null;
}

function hasErrors(errors: CyberMondayFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

function requirePct(
  raw: string,
  field: keyof CyberMondayFieldErrors,
  label: string,
  errors: CyberMondayFieldErrors,
) {
  const p = parseNumber(raw);
  if (p.blank) errors[field] = `Enter ${label}.`;
  else if (p.invalid || p.value == null) errors[field] = `Enter a valid ${label}.`;
  else if (p.value < 0 || p.value > 100)
    errors[field] = `${label} must be between 0% and 100%.`;
}

export function collectFieldErrors(
  input: CyberMondayInput,
): CyberMondayFieldErrors {
  const errors: CyberMondayFieldErrors = {};

  const price = parseNumber(input.originalPrice);
  if (price.blank) errors.originalPrice = 'Please enter a valid original price.';
  else if (price.invalid || price.value == null)
    errors.originalPrice = 'Please enter a valid original price.';
  else if (price.value < 0)
    errors.originalPrice = 'Original price cannot be negative.';

  const qty = parseNumber(input.quantity);
  if (qty.blank) errors.quantity = 'Quantity must be a positive whole number.';
  else if (qty.invalid || qty.value == null)
    errors.quantity = 'Quantity must be a positive whole number.';
  else if (!Number.isInteger(qty.value) || qty.value <= 0)
    errors.quantity = 'Quantity must be a positive whole number.';

  switch (input.dealType) {
    case 'percentage':
      requirePct(
        input.discountPercentage,
        'discountPercentage',
        'discount percentage',
        errors,
      );
      break;
    case 'fixed': {
      const f = parseNumber(input.fixedDiscount);
      if (f.blank) errors.fixedDiscount = 'Enter the fixed discount amount.';
      else if (f.invalid || f.value == null)
        errors.fixedDiscount = 'Enter a valid fixed discount.';
      else if (f.value < 0)
        errors.fixedDiscount = 'Fixed discount cannot be negative.';
      break;
    }
    case 'double':
      requirePct(
        input.discountPercentage,
        'discountPercentage',
        'first discount percentage',
        errors,
      );
      requirePct(
        input.secondDiscountPercentage,
        'secondDiscountPercentage',
        'second discount percentage',
        errors,
      );
      break;
    case 'triple':
      requirePct(
        input.discountPercentage,
        'discountPercentage',
        'first discount percentage',
        errors,
      );
      requirePct(
        input.secondDiscountPercentage,
        'secondDiscountPercentage',
        'second discount percentage',
        errors,
      );
      requirePct(
        input.thirdDiscountPercentage,
        'thirdDiscountPercentage',
        'third discount percentage',
        errors,
      );
      break;
    case 'bogo-free':
      break;
    case 'bogo-discounted':
      requirePct(
        input.secondItemDiscountPercentage,
        'secondItemDiscountPercentage',
        'second-item discount percentage',
        errors,
      );
      break;
    case 'buy-x-get-y-free': {
      const x = parseNumber(input.buyQuantity);
      const y = parseNumber(input.freeQuantity);
      if (x.blank || x.invalid || x.value == null || !Number.isInteger(x.value) || x.value <= 0)
        errors.buyQuantity = 'Enter valid quantities for this promotion.';
      if (y.blank || y.invalid || y.value == null || !Number.isInteger(y.value) || y.value < 0)
        errors.freeQuantity = 'Enter valid quantities for this promotion.';
      break;
    }
    case 'buy-x-pay-y': {
      const x = parseNumber(input.buyQuantity);
      const y = parseNumber(input.payQuantity);
      if (x.blank || x.invalid || x.value == null || !Number.isInteger(x.value) || x.value <= 0)
        errors.buyQuantity = 'Enter valid quantities for this promotion.';
      if (y.blank || y.invalid || y.value == null || !Number.isInteger(y.value) || y.value < 0)
        errors.payQuantity = 'Enter valid quantities for this promotion.';
      else if (
        x.value != null &&
        y.value != null &&
        Number.isInteger(x.value) &&
        Number.isInteger(y.value) &&
        y.value > x.value
      ) {
        errors.payQuantity = 'Items charged (Y) cannot exceed items required (X).';
      }
      break;
    }
    case 'percentage-plus-coupon': {
      requirePct(
        input.discountPercentage,
        'discountPercentage',
        'discount percentage',
        errors,
      );
      const c = parseNumber(input.couponAmount);
      if (c.blank) errors.couponAmount = 'Enter the coupon amount.';
      else if (c.invalid || c.value == null)
        errors.couponAmount = 'Enter a valid coupon amount.';
      else if (c.value < 0)
        errors.couponAmount = 'Coupon amount cannot be negative.';
      break;
    }
    default:
      break;
  }

  if (input.applySalesTax) {
    const t = parseNumber(input.salesTaxRate);
    if (t.blank) errors.salesTaxRate = 'Enter a valid tax rate.';
    else if (t.invalid || t.value == null)
      errors.salesTaxRate = 'Enter a valid tax rate.';
    else if (t.value < 0 || t.value > 100)
      errors.salesTaxRate = 'Tax rate must be between 0% and 100%.';
  }

  const ship = parseNumber(input.shippingCost);
  if (!ship.blank) {
    if (ship.invalid || ship.value == null)
      errors.shippingCost = 'Enter a valid shipping cost.';
    else if (ship.value < 0)
      errors.shippingCost = 'Shipping cost cannot be negative.';
  }

  if (input.useFreeShippingThreshold) {
    const th = parseNumber(input.freeShippingThreshold);
    if (th.blank)
      errors.freeShippingThreshold = 'Enter a free-shipping threshold.';
    else if (th.invalid || th.value == null)
      errors.freeShippingThreshold = 'Enter a valid free-shipping threshold.';
    else if (th.value < 0)
      errors.freeShippingThreshold = 'Threshold cannot be negative.';
  }

  if (input.compareBlackFriday) {
    const bf = parseNumber(input.blackFridayCheckoutTotal);
    if (bf.blank)
      errors.blackFridayCheckoutTotal = 'Enter the Black Friday checkout total.';
    else if (bf.invalid || bf.value == null)
      errors.blackFridayCheckoutTotal = 'Enter a valid Black Friday total.';
    else if (bf.value < 0)
      errors.blackFridayCheckoutTotal = 'Black Friday total cannot be negative.';
  }

  return errors;
}

export function validateCyberMondayInput(
  input: CyberMondayInput,
): CyberMondayValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateCyberMondayFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
