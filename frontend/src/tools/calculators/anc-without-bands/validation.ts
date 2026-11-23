import { calculateAncWithoutBands, parseNumber } from './calculation';
import type {
  AncWithoutBandsFieldErrors,
  AncWithoutBandsInput,
  AncWithoutBandsResult,
} from './types';
import { modeUsesBands } from './types';

export interface AncWithoutBandsValidation {
  errors: AncWithoutBandsFieldErrors;
  result: AncWithoutBandsResult | null;
}

export function validateAncWithoutBandsInput(
  input: AncWithoutBandsInput,
): AncWithoutBandsValidation {
  const errors: AncWithoutBandsFieldErrors = {};

  if (input.wbcText.trim() !== '') {
    const wbc = parseNumber(input.wbcText);
    if (wbc === null) errors.wbcText = 'Enter a valid WBC.';
    else if (!(wbc > 0)) errors.wbcText = 'WBC must be positive.';
  }

  if (input.primaryPercentText.trim() !== '') {
    const p = parseNumber(input.primaryPercentText);
    if (p === null) errors.primaryPercentText = 'Enter a valid percentage.';
    else if (!(p >= 0 && p <= 100)) {
      errors.primaryPercentText = 'Percentage must be between 0 and 100.';
    }
  }

  if (modeUsesBands(input.labReportMode) && input.bandsPercentText.trim() !== '') {
    const b = parseNumber(input.bandsPercentText);
    if (b === null) errors.bandsPercentText = 'Enter a valid percentage.';
    else if (!(b >= 0 && b <= 100)) {
      errors.bandsPercentText = 'Band percentage must be between 0 and 100.';
    } else if (input.primaryPercentText.trim() !== '') {
      const primary = parseNumber(input.primaryPercentText);
      if (primary !== null && primary + b > 100) {
        errors.bandsPercentText = 'Combined segs/POLY and bands must not exceed 100%.';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAncWithoutBands(input),
  };
}