import { calculateOptimalHedgeRatio } from './calculation';
import type {
  OptimalHedgeRatioFieldErrors,
  OptimalHedgeRatioInput,
  OptimalHedgeRatioResult,
} from './types';

export interface OptimalHedgeRatioValidation {
  isValid: boolean;
  errors: OptimalHedgeRatioFieldErrors;
  result: OptimalHedgeRatioResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateOptimalHedgeRatioInput(
  input: OptimalHedgeRatioInput
): OptimalHedgeRatioValidation {
  const errors: OptimalHedgeRatioFieldErrors = {};

  const spot = parseNumber(input.spotStdDev);
  const futures = parseNumber(input.futuresStdDev);
  const corr = parseNumber(input.correlation);

  if (!spot.blank && (spot.invalid || spot.value === null)) {
    errors.spotStdDev = 'Enter a valid spot-price standard deviation.';
  } else if (!spot.blank && spot.value !== null && spot.value < 0) {
    errors.spotStdDev = 'Spot-price standard deviation cannot be negative.';
  }

  if (!futures.blank && (futures.invalid || futures.value === null)) {
    errors.futuresStdDev = 'Enter a valid futures-price standard deviation.';
  } else if (!futures.blank && futures.value !== null && !(futures.value > 0)) {
    errors.futuresStdDev = 'Futures-price standard deviation must be greater than zero.';
  }

  if (!corr.blank && (corr.invalid || corr.value === null)) {
    errors.correlation = 'Enter a valid correlation coefficient.';
  } else if (!corr.blank && corr.value !== null && (corr.value < -1 || corr.value > 1)) {
    errors.correlation = 'Correlation coefficient must be between −1 and +1.';
  }

  const incomplete =
    spot.blank || futures.blank || corr.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateOptimalHedgeRatio({
    spotStdDev: spot.value!,
    futuresStdDev: futures.value!,
    correlation: corr.value!,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite hedge ratio.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
