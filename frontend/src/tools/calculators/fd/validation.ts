import { calculateFd } from './calculation';
import {
  FD_COMPOUNDING_OPTIONS,
  type FdCompounding,
  type FdFieldErrors,
  type FdInput,
  type FdResult,
  type FdType,
} from './types';

function parseNumber(val: string): number | null {
  const trimmed = val.trim().replace(/,/g, '');
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateFdInput(input: FdInput): {
  isValid: boolean;
  errors: FdFieldErrors;
  result: FdResult | null;
} {
  const errors: FdFieldErrors = {};

  const principal = parseNumber(input.principal);
  const rate = parseNumber(input.interestRate);
  const years = parseNumber(input.termYears);

  if (principal === null || rate === null || years === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(principal) || principal < 0) {
    errors.principal = 'Enter a valid non-negative principal amount';
  }
  if (Number.isNaN(rate) || rate < 0) {
    errors.interestRate = 'Enter a valid non-negative interest rate';
  }
  if (Number.isNaN(years) || years <= 0) {
    errors.termYears = 'Enter a term greater than zero';
  }

  if (input.depositType !== 'simple' && input.depositType !== 'cumulative') {
    errors.form = 'Select a fixed deposit type';
  }

  const freqOk = FD_COMPOUNDING_OPTIONS.some((o) => o.value === input.compounding);
  if (!freqOk) {
    errors.compounding = 'Select a valid compounding frequency';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateFd({
    depositType: input.depositType as FdType,
    principal: principal as number,
    interestRatePercent: rate as number,
    termYears: years as number,
    compounding: input.compounding as FdCompounding,
    currency: input.currency,
  });

  return { isValid: result !== null, errors, result };
}
