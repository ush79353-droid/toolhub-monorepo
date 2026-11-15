import { buildMvaResult } from './calculation';
import type { MvaFieldErrors, MvaInput, MvaResult } from './types';

function isBlank(value: number): boolean {
  return !Number.isFinite(value);
}

export function validateMva(input: MvaInput): {
  isValid: boolean;
  errors: MvaFieldErrors;
  result: MvaResult | null;
} {
  const errors: MvaFieldErrors = {};

  if (!isBlank(input.currentSharePrice) && input.currentSharePrice < 0) {
    errors.currentSharePrice = 'Enter a valid non-negative share price';
  }

  if (!isBlank(input.sharesOutstanding)) {
    if (input.sharesOutstanding < 0) {
      errors.sharesOutstanding = 'Enter a valid non-negative number of shares';
    } else if (!Number.isInteger(input.sharesOutstanding)) {
      errors.sharesOutstanding = 'Shares outstanding must be a whole number';
    }
  }

  if (!isBlank(input.capitalInvested) && input.capitalInvested < 0) {
    errors.capitalInvested = 'Enter a valid non-negative capital invested amount';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = buildMvaResult(
    input.currentSharePrice,
    input.sharesOutstanding,
    input.capitalInvested,
    input.currency
  );

  const hasAny = result.currentMarketValue !== null || result.mva !== null;
  return { isValid: hasAny, errors, result: hasAny ? result : null };
}
