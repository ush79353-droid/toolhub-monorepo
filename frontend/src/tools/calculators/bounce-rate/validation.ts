import type { BounceRateFieldErrors, BounceRateInput } from './types';

export function validateBounceRateInput(input: BounceRateInput): {
  isValid: boolean;
  errors: BounceRateFieldErrors;
  parsedValues: { websiteVisits: number; onePageVisits: number } | null;
} {
  const errors: BounceRateFieldErrors = {};

  const parseField = (val: string): number | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : NaN;
  };

  const websiteVisits = parseField(input.websiteVisits);
  const onePageVisits = parseField(input.onePageVisits);

  // Keep fields blank until both are entered — no premature errors.
  if (websiteVisits === null || onePageVisits === null) {
    return { isValid: false, errors, parsedValues: null };
  }

  if (Number.isNaN(websiteVisits) || websiteVisits < 0) {
    errors.websiteVisits = 'Enter a valid non-negative number of visits';
  } else if (websiteVisits === 0) {
    errors.websiteVisits = 'Total website visits must be greater than zero';
  }

  if (Number.isNaN(onePageVisits) || onePageVisits < 0) {
    errors.onePageVisits = 'Enter a valid non-negative number of one-page visits';
  }

  if (
    Object.keys(errors).length === 0 &&
    onePageVisits > websiteVisits
  ) {
    errors.onePageVisits = 'One-page visits cannot exceed total website visits';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    parsedValues: isValid ? { websiteVisits, onePageVisits } : null,
  };
}
