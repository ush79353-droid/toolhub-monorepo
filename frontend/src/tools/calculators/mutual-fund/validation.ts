import { calculateMutualFund } from './calculation';
import type {
  MutualFundFieldErrors,
  MutualFundInput,
  MutualFundResult,
} from './types';

export interface MutualFundValidation {
  isValid: boolean;
  errors: MutualFundFieldErrors;
  result: MutualFundResult | null;
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

function parseNonNegative(
  raw: string,
  label: string
): { value: number | null; blank: boolean; error?: string } {
  const parsed = parseNumber(raw);
  if (parsed.blank) return { value: 0, blank: true };
  if (parsed.invalid || parsed.value === null) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (parsed.value < 0) {
    return { value: null, blank: false, error: `${label} cannot be negative.` };
  }
  return { value: parsed.value, blank: false };
}

export function validateMutualFundInput(input: MutualFundInput): MutualFundValidation {
  const errors: MutualFundFieldErrors = {};

  const amount = parseNonNegative(input.investmentAmount, 'Investment amount');
  const rate = parseNumber(input.expectedAnnualReturn);
  const years = parseNonNegative(input.years, 'Years');
  const months = parseNonNegative(input.months, 'Months');

  if (amount.error) errors.investmentAmount = amount.error;

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.expectedAnnualReturn = 'Enter a valid expected annual return.';
  }

  if (years.error) errors.years = years.error;
  if (months.error) errors.months = months.error;

  const amountBlank = amount.blank;
  const rateBlank = rate.blank;
  const durationBlank = years.blank && months.blank;
  const incomplete =
    amountBlank || rateBlank || durationBlank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateMutualFund(
    input.mode,
    amount.value!,
    rate.value!,
    years.value!,
    months.value!,
    input.currency
  );

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
