import {
  COMPOUNDING_OPTIONS,
  type CompoundInterestRateFieldErrors,
  type CompoundInterestRateInput,
  type CompoundingFrequency,
} from './types';

export function parseOptionalNumber(raw: string): number {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return Number.NaN;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function parseNonNegativeInt(raw: string): number {
  const value = parseOptionalNumber(raw);
  if (!Number.isFinite(value)) return Number.NaN;
  if (!Number.isInteger(value) || value < 0) return Number.NaN;
  return value;
}

export function isCompoundingFrequency(value: string): value is CompoundingFrequency {
  return COMPOUNDING_OPTIONS.some((o) => o.value === value);
}

export function validateCompoundInterestRate(
  input: CompoundInterestRateInput
): CompoundInterestRateFieldErrors {
  const errors: CompoundInterestRateFieldErrors = {};

  if (!Number.isFinite(input.initialBalance)) {
    errors.initialBalance = 'Enter a valid initial balance.';
  } else if (input.initialBalance <= 0) {
    errors.initialBalance = 'Initial balance must be greater than zero.';
  }

  if (!Number.isFinite(input.finalBalance)) {
    errors.finalBalance = 'Enter a valid final balance.';
  } else if (input.finalBalance <= 0) {
    errors.finalBalance = 'Final balance must be greater than zero.';
  }

  if (!COMPOUNDING_OPTIONS.some((o) => o.value === input.compounding)) {
    errors.compounding = 'Choose a compounding frequency.';
  }

  if (!Number.isFinite(input.termYears) || input.termYears < 0 || !Number.isInteger(input.termYears)) {
    errors.termYears = 'Enter whole years (0 or more).';
  }
  if (
    !Number.isFinite(input.termMonths) ||
    input.termMonths < 0 ||
    !Number.isInteger(input.termMonths)
  ) {
    errors.termMonths = 'Enter whole months (0 or more).';
  }

  const term =
    (Number.isFinite(input.termYears) ? input.termYears : 0) +
    (Number.isFinite(input.termMonths) ? input.termMonths : 0) / 12;
  if (
    !errors.termYears &&
    !errors.termMonths &&
    Number.isFinite(term) &&
    term <= 0
  ) {
    errors.termYears = 'Term must be greater than zero.';
  }

  return errors;
}
