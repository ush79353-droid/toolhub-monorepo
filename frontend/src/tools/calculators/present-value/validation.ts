import { calculatePresentValue } from './calculation';
import type {
  PresentValueFieldErrors,
  PresentValueInput,
  PresentValueResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validatePresentValueInput(input: PresentValueInput): {
  isValid: boolean;
  errors: PresentValueFieldErrors;
  result: PresentValueResult | null;
} {
  const errors: PresentValueFieldErrors = {};

  const fv = parseField(input.futureValue);
  const periods = parseField(input.periods);
  const rate = parseField(input.interestRatePercent);

  if (fv === null) {
    // blank — wait
  } else if (Number.isNaN(fv) || fv < 0) {
    errors.futureValue = 'Enter a valid non-negative future value.';
  }

  if (periods === null) {
    // blank — wait
  } else if (Number.isNaN(periods) || periods < 0 || !Number.isInteger(periods)) {
    errors.periods = 'Enter a non-negative whole number of periods.';
  }

  if (rate === null) {
    // blank — wait
  } else if (Number.isNaN(rate)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!(1 + rate / 100 > 0)) {
    errors.interestRatePercent = 'Interest rate must be greater than −100%.';
  }

  if (
    fv === null ||
    periods === null ||
    rate === null ||
    Object.keys(errors).length > 0
  ) {
    return { isValid: false, errors, result: null };
  }

  const result = calculatePresentValue({
    futureValue: fv,
    periods: periods,
    interestRatePercent: rate,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite present value.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
