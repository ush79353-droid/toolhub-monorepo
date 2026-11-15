import { calculatePvifa } from './calculation';
import type { PvifaFieldErrors, PvifaInput, PvifaResult } from './types';

function parseNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validatePvifaInput(input: PvifaInput): {
  isValid: boolean;
  errors: PvifaFieldErrors;
  result: PvifaResult | null;
} {
  const errors: PvifaFieldErrors = {};

  const interestRatePercent = parseNumber(input.interestRatePercent);
  const periods = parseNumber(input.periods);

  if (interestRatePercent === null || periods === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(interestRatePercent)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (interestRatePercent <= -100) {
    errors.interestRatePercent = 'Interest rate must be greater than −100%.';
  }

  if (Number.isNaN(periods)) {
    errors.periods = 'Enter a valid number of periods.';
  } else if (!Number.isInteger(periods) || periods < 0) {
    errors.periods = 'Number of periods must be a non-negative integer.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculatePvifa({
    interestRatePercent,
    periods,
  });

  if (!result) {
    errors.form = 'Unable to calculate PVIFA for these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
