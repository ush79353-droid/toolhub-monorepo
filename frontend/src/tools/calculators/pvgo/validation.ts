import { buildPvgoResult } from './calculation';
import type { PvgoFieldErrors, PvgoInput, PvgoResult } from './types';

function isBlank(value: number): boolean {
  return !Number.isFinite(value);
}

export function validatePvgo(input: PvgoInput): {
  isValid: boolean;
  errors: PvgoFieldErrors;
  result: PvgoResult | null;
} {
  const errors: PvgoFieldErrors = {};

  if (!isBlank(input.earnings) && !Number.isFinite(input.earnings)) {
    errors.earnings = 'Enter a valid earnings amount';
  }

  if (!isBlank(input.sharesOutstanding)) {
    if (input.sharesOutstanding < 0) {
      errors.sharesOutstanding = 'Enter a valid non-negative number of shares';
    } else if (input.sharesOutstanding === 0) {
      errors.sharesOutstanding = 'Number of shares outstanding must be greater than zero';
    }
  }

  if (!isBlank(input.sharePrice) && input.sharePrice < 0) {
    errors.sharePrice = 'Enter a valid non-negative share price';
  }

  if (!isBlank(input.costOfEquityPercent)) {
    if (input.costOfEquityPercent < 0) {
      errors.costOfEquityPercent = 'Enter a valid non-negative cost of equity';
    } else if (input.costOfEquityPercent === 0) {
      errors.costOfEquityPercent = 'Cost of equity must be greater than zero';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = buildPvgoResult(
    input.earnings,
    input.sharesOutstanding,
    input.sharePrice,
    input.costOfEquityPercent,
    input.currency
  );

  const hasAny = result.eps !== null || result.pvgo !== null;
  return { isValid: hasAny, errors, result: hasAny ? result : null };
}
