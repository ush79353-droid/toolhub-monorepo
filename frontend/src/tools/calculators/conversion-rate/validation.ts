import { calculateConversionRate } from './calculation';
import {
  CONVERSION_MODES,
  type ConversionRateFieldErrors,
  type ConversionRateInput,
  type ConversionRateResult,
} from './types';

export interface ConversionRateDraftStrings {
  mode: ConversionRateInput['mode'];
  totalConversions: string;
  totalClicksOrVisits: string;
}

export interface ConversionRateValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: ConversionRateFieldErrors;
  result: ConversionRateResult | null;
}

function parseNonNegative(raw: string, label: string): {
  value: number | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (!/^\+?\d+(\.\d+)?$/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: `${label} must be a non-negative number.`,
    };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) {
    return { value: null, blank: false, error: `${label} cannot be negative.` };
  }
  return { value, blank: false };
}

export function validateConversionRateDraft(
  draft: ConversionRateDraftStrings
): ConversionRateValidation {
  const errors: ConversionRateFieldErrors = {};

  if (!CONVERSION_MODES.includes(draft.mode)) {
    errors.mode = 'Choose ads/posts/links or websites';
  }

  const denomLabel = draft.mode === 'websites' ? 'Website visits' : 'Number of clicks';
  const conversions = parseNonNegative(draft.totalConversions, 'Total conversions');
  const clicks = parseNonNegative(draft.totalClicksOrVisits, denomLabel);
  const anyBlank = conversions.blank || clicks.blank;

  if (!conversions.blank && conversions.error) errors.totalConversions = conversions.error;
  if (!clicks.blank && clicks.error) errors.totalClicksOrVisits = clicks.error;

  if (!clicks.blank && clicks.value !== null && clicks.value <= 0) {
    errors.totalClicksOrVisits = `${denomLabel} must be greater than zero.`;
  }

  if (
    !anyBlank &&
    conversions.value !== null &&
    clicks.value !== null &&
    !errors.totalConversions &&
    !errors.totalClicksOrVisits &&
    conversions.value > clicks.value
  ) {
    errors.totalConversions = `Total conversions cannot exceed ${denomLabel.toLowerCase()}.`;
  }

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const input: ConversionRateInput = {
    mode: draft.mode,
    totalConversions: conversions.value!,
    totalClicksOrVisits: clicks.value!,
  };
  const result = calculateConversionRate(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
