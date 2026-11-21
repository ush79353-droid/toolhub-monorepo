import {
  calculateForwardRate,
  parseNumber,
  toYears,
} from './calculation';
import type {
  ForwardRateFieldErrors,
  ForwardRateInput,
  ForwardRateResult,
} from './types';

const MAX_ABS_RATE = 1e6;
const MAX_YEARS = 1e6;

export interface ForwardRateValidation {
  isValid: boolean;
  errors: ForwardRateFieldErrors;
  result: ForwardRateResult | null;
}

export function collectFieldErrors(
  input: ForwardRateInput,
): ForwardRateFieldErrors {
  const errors: ForwardRateFieldErrors = {};

  if (input.n1Unit !== 'years' && input.n1Unit !== 'months') {
    errors.n1 = 'Select years or months for time period 1.';
  }
  if (input.n2Unit !== 'years' && input.n2Unit !== 'months') {
    errors.n2 = 'Select years or months for time period 2.';
  }

  const n1 = parseNumber(input.n1);
  const n2 = parseNumber(input.n2);
  const s1 = parseNumber(input.s1Percent);
  const s2 = parseNumber(input.s2Percent);

  if (input.n1.trim() === '') {
    errors.n1 = 'Enter time period 1 (n₁).';
  } else if (n1 == null) {
    errors.n1 = 'Enter a valid time period 1.';
  } else if (n1 < 0) {
    errors.n1 = 'Time period 1 cannot be negative.';
  } else if (toYears(n1, input.n1Unit) > MAX_YEARS) {
    errors.n1 = 'Time period 1 is out of range.';
  }

  if (input.n2.trim() === '') {
    errors.n2 = 'Enter time period 2 (n₂).';
  } else if (n2 == null) {
    errors.n2 = 'Enter a valid time period 2.';
  } else if (n2 < 0) {
    errors.n2 = 'Time period 2 cannot be negative.';
  } else if (toYears(n2, input.n2Unit) > MAX_YEARS) {
    errors.n2 = 'Time period 2 is out of range.';
  }

  if (
    !errors.n1 &&
    !errors.n2 &&
    n1 != null &&
    n2 != null &&
    toYears(n2, input.n2Unit) <= toYears(n1, input.n1Unit)
  ) {
    errors.n2 = 'Time period 2 (n₂) must be greater than time period 1 (n₁).';
  }

  if (input.s1Percent.trim() === '') {
    errors.s1Percent = 'Enter spot rate S₁ (%).';
  } else if (s1 == null) {
    errors.s1Percent = 'Enter a valid spot rate S₁.';
  } else if (Math.abs(s1) > MAX_ABS_RATE) {
    errors.s1Percent = 'Spot rate S₁ is out of range.';
  } else if (1 + s1 / 100 <= 0) {
    errors.s1Percent =
      'S₁ must be greater than −100% for annual compounding (1+S₁ > 0).';
  }

  if (input.s2Percent.trim() === '') {
    errors.s2Percent = 'Enter spot rate S₂ (%).';
  } else if (s2 == null) {
    errors.s2Percent = 'Enter a valid spot rate S₂.';
  } else if (Math.abs(s2) > MAX_ABS_RATE) {
    errors.s2Percent = 'Spot rate S₂ is out of range.';
  } else if (1 + s2 / 100 <= 0) {
    errors.s2Percent =
      'S₂ must be greater than −100% for annual compounding (1+S₂ > 0).';
  }

  return errors;
}

export function hasFieldErrors(errors: ForwardRateFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateForwardRateInput(
  input: ForwardRateInput,
): ForwardRateValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateForwardRate(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
