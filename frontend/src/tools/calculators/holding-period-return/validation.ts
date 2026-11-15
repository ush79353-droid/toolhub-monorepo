import { calculateHoldingPeriodReturn } from './calculation';
import type {
  HoldingPeriodReturnFieldErrors,
  HoldingPeriodReturnInput,
  HoldingPeriodReturnResult,
} from './types';

export interface HoldingPeriodReturnValidation {
  isValid: boolean;
  errors: HoldingPeriodReturnFieldErrors;
  result: HoldingPeriodReturnResult | null;
}

function parseNumber(raw: string): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateHoldingPeriodReturnInput(
  input: HoldingPeriodReturnInput
): HoldingPeriodReturnValidation {
  const errors: HoldingPeriodReturnFieldErrors = {};

  const bought = parseNumber(input.boughtPrice);
  const current = parseNumber(input.currentPrice);
  const dividend = parseNumber(input.dividendIncome);

  if (!bought.blank && (bought.invalid || bought.value === null)) {
    errors.boughtPrice = 'Enter a valid bought price.';
  } else if (!bought.blank && bought.value !== null && !(bought.value > 0)) {
    errors.boughtPrice = 'Bought price must be greater than zero.';
  }

  if (!current.blank && (current.invalid || current.value === null)) {
    errors.currentPrice = 'Enter a valid current price.';
  } else if (!current.blank && current.value !== null && current.value < 0) {
    errors.currentPrice = 'Current price cannot be negative.';
  }

  if (!dividend.blank && (dividend.invalid || dividend.value === null)) {
    errors.dividendIncome = 'Enter a valid dividend income.';
  } else if (!dividend.blank && dividend.value !== null && dividend.value < 0) {
    errors.dividendIncome = 'Dividend income cannot be negative.';
  }

  const incomplete =
    bought.blank ||
    current.blank ||
    dividend.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateHoldingPeriodReturn(
    bought.value!,
    current.value!,
    dividend.value!,
    input.currency
  );

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
