import { calculateHedgeRatio } from './calculation';
import type { HedgeRatioFieldErrors, HedgeRatioInput, HedgeRatioResult } from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateHedgeRatioInput(input: HedgeRatioInput): {
  isValid: boolean;
  errors: HedgeRatioFieldErrors;
  result: HedgeRatioResult | null;
} {
  const errors: HedgeRatioFieldErrors = {};
  const totalExposure = parseField(input.totalExposure);
  const hedgePosition = parseField(input.hedgePosition);

  if (totalExposure === null || hedgePosition === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(totalExposure) || totalExposure < 0) {
    errors.totalExposure = 'Enter a valid total exposure (≥ 0).';
  } else if (totalExposure === 0) {
    errors.totalExposure = 'Total exposure must be greater than zero.';
  }

  if (Number.isNaN(hedgePosition) || hedgePosition < 0) {
    errors.hedgePosition = 'Enter a valid hedge position (≥ 0).';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateHedgeRatio(totalExposure, hedgePosition);
  if (!result) {
    errors.form = 'Unable to calculate hedge ratio for these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
