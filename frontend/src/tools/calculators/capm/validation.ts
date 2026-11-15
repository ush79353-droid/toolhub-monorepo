import { calculateCapm } from './calculation';
import type { CapmFieldErrors, CapmInput, CapmResult } from './types';

export interface CapmValidation {
  isValid: boolean;
  errors: CapmFieldErrors;
  result: CapmResult | null;
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

export function validateCapmInput(input: CapmInput): CapmValidation {
  const errors: CapmFieldErrors = {};

  const rf = parseNumber(input.riskFreeRate);
  const rm = parseNumber(input.marketReturn);
  const beta = parseNumber(input.beta);

  if (!rf.blank && (rf.invalid || rf.value === null)) {
    errors.riskFreeRate = 'Enter a valid risk-free interest rate.';
  }
  if (!rm.blank && (rm.invalid || rm.value === null)) {
    errors.marketReturn = 'Enter a valid broad market return.';
  }
  if (!beta.blank && (beta.invalid || beta.value === null)) {
    errors.beta = 'Enter a valid beta.';
  }

  const allBlank = rf.blank && rm.blank && beta.blank;
  if (allBlank) {
    return { isValid: false, errors, result: null };
  }

  if (
    rf.blank ||
    rm.blank ||
    beta.blank ||
    Object.keys(errors).length > 0 ||
    rf.value === null ||
    rm.value === null ||
    beta.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCapm({
    riskFreeRatePercent: rf.value,
    marketReturnPercent: rm.value,
    beta: beta.value,
  });

  if (!result) {
    errors.form = 'Unable to calculate a finite CAPM result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
