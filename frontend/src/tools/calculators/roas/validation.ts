import { calculateRoas } from './calculation';
import type { RoasFieldErrors, RoasInput, RoasResult } from './types';

function parseOptional(raw: string): number | null | typeof Number.NaN {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return Number.NaN;
  return num;
}

export function validateRoasInput(input: RoasInput): {
  isValid: boolean;
  errors: RoasFieldErrors;
  result: RoasResult | null;
} {
  const errors: RoasFieldErrors = {};
  const spend = parseOptional(input.adSpend);

  if (spend === null) {
    return { isValid: false, errors, result: null };
  }
  if (Number.isNaN(spend)) {
    errors.adSpend = 'Enter a valid ad spend';
  } else if (!(spend > 0)) {
    errors.adSpend = 'Ad spend must be greater than zero';
  }

  if (input.knowRevenue !== 'yes') {
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    // No invented revenue estimators — ROAS needs known revenue.
    return { isValid: false, errors, result: null };
  }

  const revenue = parseOptional(input.adRevenue);
  if (revenue === null) {
    return {
      isValid: false,
      errors: Object.keys(errors).length > 0 ? errors : {},
      result: null,
    };
  }
  if (Number.isNaN(revenue)) {
    errors.adRevenue = 'Enter a valid ad revenue';
  } else if (revenue < 0) {
    errors.adRevenue = 'Ad revenue cannot be negative';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateRoas(spend as number, revenue as number, input.currency);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate ROAS from the current values.' },
      result: null,
    };
  }

  return { isValid: true, errors, result };
}
