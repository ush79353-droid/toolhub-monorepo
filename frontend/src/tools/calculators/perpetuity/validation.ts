import { calculatePerpetuity } from './calculation';
import type {
  PerpetuityFieldErrors,
  PerpetuityInput,
  PerpetuityResult,
} from './types';

export interface PerpetuityValidation {
  isValid: boolean;
  errors: PerpetuityFieldErrors;
  result: PerpetuityResult | null;
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

export function validatePerpetuityInput(input: PerpetuityInput): PerpetuityValidation {
  const errors: PerpetuityFieldErrors = {};

  const dividend = parseNumber(input.dividend);
  const discount = parseNumber(input.discountRatePercent);
  const growth = parseNumber(input.growthRatePercent);

  if (!dividend.blank && (dividend.invalid || dividend.value === null)) {
    errors.dividend = 'Enter a valid dividend.';
  } else if (!dividend.blank && dividend.value !== null && dividend.value < 0) {
    errors.dividend = 'Dividend cannot be negative.';
  }

  if (!discount.blank && (discount.invalid || discount.value === null)) {
    errors.discountRatePercent = 'Enter a valid discount rate.';
  }

  if (!growth.blank && (growth.invalid || growth.value === null)) {
    errors.growthRatePercent = 'Enter a valid growth rate.';
  }

  if (
    !discount.blank &&
    !growth.blank &&
    !errors.discountRatePercent &&
    !errors.growthRatePercent &&
    discount.value !== null &&
    growth.value !== null &&
    discount.value <= growth.value
  ) {
    errors.discountRatePercent = 'Discount rate must be greater than growth rate.';
  }

  const incomplete =
    dividend.blank ||
    discount.blank ||
    growth.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculatePerpetuity({
    dividend: dividend.value!,
    discountRatePercent: discount.value!,
    growthRatePercent: growth.value!,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite present value.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
