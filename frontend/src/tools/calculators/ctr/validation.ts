import type { CtrFieldErrors, CtrInput } from './types';

export function validateCtrInput(input: CtrInput): {
  isValid: boolean;
  errors: CtrFieldErrors;
  parsedValues: { impressions: number; clicks: number } | null;
} {
  const errors: CtrFieldErrors = {};

  const parseField = (val: string): number | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : Number.NaN;
  };

  const impressions = parseField(input.impressions);
  const clicks = parseField(input.clicks);

  if (impressions === null || clicks === null) {
    return { isValid: false, errors, parsedValues: null };
  }

  if (Number.isNaN(impressions) || impressions < 0) {
    errors.impressions = 'Enter a valid non-negative number of impressions';
  } else if (impressions === 0) {
    errors.impressions = 'Ad impressions must be greater than zero';
  }

  if (Number.isNaN(clicks) || clicks < 0) {
    errors.clicks = 'Enter a valid non-negative number of clicks';
  }

  if (Object.keys(errors).length === 0 && clicks > impressions) {
    errors.clicks = 'Clicks cannot exceed ad impressions';
  }

  const isValid = Object.keys(errors).length === 0;
  return {
    isValid,
    errors,
    parsedValues: isValid ? { impressions, clicks } : null,
  };
}
