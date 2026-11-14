import { calculateInformationRatio } from './calculation';
import type {
  InformationRatioFieldErrors,
  InformationRatioInput,
  InformationRatioResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateInformationRatioInput(input: InformationRatioInput): {
  isValid: boolean;
  errors: InformationRatioFieldErrors;
  result: InformationRatioResult | null;
} {
  const errors: InformationRatioFieldErrors = {};

  const beginningValue = parseField(input.beginningValue);
  const endingValue = parseField(input.endingValue);
  const benchmarkReturn = parseField(input.benchmarkReturn);
  const trackingError = parseField(input.trackingError);

  if (
    beginningValue === null ||
    endingValue === null ||
    benchmarkReturn === null ||
    trackingError === null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(beginningValue) || beginningValue < 0) {
    errors.beginningValue = 'Enter a valid beginning value (≥ 0).';
  } else if (beginningValue === 0) {
    errors.beginningValue = 'Beginning portfolio value must be greater than zero.';
  }

  if (Number.isNaN(endingValue)) {
    errors.endingValue = 'Enter a valid ending portfolio value.';
  }

  if (Number.isNaN(benchmarkReturn)) {
    errors.benchmarkReturn = 'Enter a valid benchmark return.';
  }

  if (Number.isNaN(trackingError) || trackingError < 0) {
    errors.trackingError = 'Enter a valid tracking error (≥ 0).';
  } else if (trackingError === 0) {
    errors.trackingError = 'Tracking error must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateInformationRatio({
    beginningValue,
    endingValue,
    benchmarkReturnPercent: benchmarkReturn,
    trackingErrorPercent: trackingError,
  });

  if (!result) {
    errors.form = 'Unable to calculate information ratio for these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
