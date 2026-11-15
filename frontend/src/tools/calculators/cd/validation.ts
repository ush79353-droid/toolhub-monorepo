import { calculateCd } from './calculation';
import {
  CD_COMPOUNDING_OPTIONS,
  type CdCompounding,
  type CdFieldErrors,
  type CdInput,
  type CdResult,
} from './types';

function parseNumber(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function parseOptionalWhole(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num) || num < 0) return Number.NaN;
  return num;
}

export function validateCdInput(input: CdInput): {
  isValid: boolean;
  errors: CdFieldErrors;
  result: CdResult | null;
} {
  const errors: CdFieldErrors = {};

  const deposit = parseNumber(input.initialDeposit);
  const rate = parseNumber(input.interestRate);
  const yearsRaw = input.termYears.trim();
  const monthsRaw = input.termMonths.trim();

  if (deposit === null || rate === null || (yearsRaw === '' && monthsRaw === '')) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(deposit) || deposit < 0) {
    errors.initialDeposit = 'Enter a valid non-negative deposit';
  }

  if (Number.isNaN(rate) || rate < 0) {
    errors.interestRate = 'Enter a valid non-negative interest rate';
  }

  const yearsParsed = yearsRaw === '' ? 0 : parseOptionalWhole(input.termYears);
  const monthsParsed = monthsRaw === '' ? 0 : parseOptionalWhole(input.termMonths);

  if (yearsRaw !== '' && Number.isNaN(yearsParsed as number)) {
    errors.termYears = 'Enter whole years (0 or more)';
  }
  if (monthsRaw !== '' && Number.isNaN(monthsParsed as number)) {
    errors.termMonths = 'Enter whole months (0 or more)';
  }

  const y = Number.isFinite(yearsParsed as number) ? (yearsParsed as number) : 0;
  const m = Number.isFinite(monthsParsed as number) ? (monthsParsed as number) : 0;
  if (!errors.termYears && !errors.termMonths && y + m / 12 <= 0) {
    errors.termYears = 'Term must be greater than zero';
  }

  if (!CD_COMPOUNDING_OPTIONS.some((o) => o.value === input.compounding)) {
    errors.compounding = 'Select a valid compounding frequency';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCd(
    deposit as number,
    rate as number,
    y,
    m,
    input.compounding as CdCompounding,
    input.currency
  );
  return { isValid: result !== null, errors, result };
}
