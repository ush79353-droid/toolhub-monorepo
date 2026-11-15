import type { ExitRateFieldErrors, ExitRateInput } from './types';

export function validateExitRateInput(input: ExitRateInput): {
  isValid: boolean;
  errors: ExitRateFieldErrors;
  parsedValues: { pageviews: number; exits: number } | null;
} {
  const errors: ExitRateFieldErrors = {};

  const parseField = (val: string): number | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : Number.NaN;
  };

  const pageviews = parseField(input.pageviews);
  const exits = parseField(input.exits);

  if (pageviews === null || exits === null) {
    return { isValid: false, errors, parsedValues: null };
  }

  if (Number.isNaN(pageviews) || pageviews < 0) {
    errors.pageviews = 'Enter a valid non-negative number of pageviews';
  } else if (pageviews === 0) {
    errors.pageviews = 'Number of pageviews must be greater than zero';
  }

  if (Number.isNaN(exits) || exits < 0) {
    errors.exits = 'Enter a valid non-negative number of exits';
  }

  if (Object.keys(errors).length === 0 && exits > pageviews) {
    errors.exits = 'Exits cannot exceed pageviews';
  }

  const isValid = Object.keys(errors).length === 0;
  return {
    isValid,
    errors,
    parsedValues: isValid ? { pageviews, exits } : null,
  };
}
