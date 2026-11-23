import {
  calculateAncAbsoluteNeutrophilCount,
  parseNumber,
} from './calculation';
import type {
  AncAbsoluteNeutrophilCountFieldErrors,
  AncAbsoluteNeutrophilCountInput,
  AncAbsoluteNeutrophilCountResult,
} from './types';

export interface AncAbsoluteNeutrophilCountValidation {
  errors: AncAbsoluteNeutrophilCountFieldErrors;
  result: AncAbsoluteNeutrophilCountResult | null;
}

function percentRangeError(field: 'segs' | 'bands'): string {
  return field === 'segs'
    ? 'Segs percentage must be between 0 and 100.'
    : 'Bands percentage must be between 0 and 100.';
}

export function validateAncAbsoluteNeutrophilCountInput(
  input: AncAbsoluteNeutrophilCountInput,
): AncAbsoluteNeutrophilCountValidation {
  const errors: AncAbsoluteNeutrophilCountFieldErrors = {};
  let segs: number | null = null;
  let bands: number | null = null;

  if (input.wbcText.trim() !== '') {
    const wbc = parseNumber(input.wbcText);
    if (wbc === null) errors.wbcText = 'Enter a valid WBC.';
    else if (!(wbc > 0)) errors.wbcText = 'WBC must be positive.';
  }

  if (input.segsPercentText.trim() !== '') {
    segs = parseNumber(input.segsPercentText);
    if (segs === null) errors.segsPercentText = 'Enter a valid percentage.';
    else if (!(segs >= 0 && segs <= 100)) {
      errors.segsPercentText = percentRangeError('segs');
    }
  }

  if (input.bandsPercentText.trim() !== '') {
    bands = parseNumber(input.bandsPercentText);
    if (bands === null) errors.bandsPercentText = 'Enter a valid percentage.';
    else if (!(bands >= 0 && bands <= 100)) {
      errors.bandsPercentText = percentRangeError('bands');
    }
  }

  if (
    segs != null &&
    bands != null &&
    !errors.segsPercentText &&
    !errors.bandsPercentText &&
    segs + bands > 100
  ) {
    const msg = 'Segs and bands combined must not exceed 100%.';
    errors.segsPercentText = msg;
    errors.bandsPercentText = msg;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAncAbsoluteNeutrophilCount(input),
  };
}