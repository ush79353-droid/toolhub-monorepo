import { calculateAppreciation } from './calculation';
import type {
  AppreciationFieldErrors,
  AppreciationInput,
  AppreciationResult,
} from './types';

export interface AppreciationValidation {
  isValid: boolean;
  errors: AppreciationFieldErrors;
  result: AppreciationResult | null;
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

function parseNonNegativeDuration(
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

export function validateAppreciationInput(input: AppreciationInput): AppreciationValidation {
  const errors: AppreciationFieldErrors = {};

  const start = parseNumber(input.startingValue);
  const rate = parseNumber(input.appreciationRate);
  const years = parseNonNegativeDuration(input.years, 'Years');
  const months = parseNonNegativeDuration(input.months, 'Months');

  if (!start.blank && (start.invalid || start.value === null)) {
    errors.startingValue = 'Enter a valid starting value.';
  } else if (!start.blank && start.value !== null && !(start.value > 0)) {
    errors.startingValue = 'Starting value must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.appreciationRate = 'Enter a valid appreciation rate.';
  } else if (!rate.blank && rate.value !== null && !(rate.value > -100)) {
    errors.appreciationRate = 'Appreciation rate must be greater than −100%.';
  }

  if (years.error) errors.years = years.error;
  if (months.error) errors.months = months.error;

  const durationBlank = years.blank && months.blank;
  const incomplete =
    start.blank || rate.blank || durationBlank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateAppreciation(
    start.value!,
    rate.value!,
    years.value!,
    months.value!,
    input.ratePeriod,
    input.currency
  );

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
