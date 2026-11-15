import { calculateContinuousCompoundInterest } from './calculation';
import {
  DEPOSIT_FREQUENCY_OPTIONS,
  type ContinuousCompoundInterestFieldErrors,
  type ContinuousCompoundInterestInput,
  type ContinuousCompoundInterestResult,
  type DepositFrequency,
  type DepositTiming,
} from './types';

function parseNumber(val: string): number | null {
  const trimmed = val.trim().replace(/,/g, '');
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function parseWhole(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num) || num < 0) return Number.NaN;
  return num;
}

export function validateContinuousCompoundInterestInput(
  input: ContinuousCompoundInterestInput,
): {
  isValid: boolean;
  errors: ContinuousCompoundInterestFieldErrors;
  result: ContinuousCompoundInterestResult | null;
} {
  const errors: ContinuousCompoundInterestFieldErrors = {};

  const balance = parseNumber(input.initialBalance);
  const rate = parseNumber(input.interestRate);
  const yearsRaw = input.termYears.trim();
  const monthsRaw = input.termMonths.trim();

  if (balance === null || rate === null || (yearsRaw === '' && monthsRaw === '')) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(balance) || balance < 0) {
    errors.initialBalance = 'Enter a valid non-negative initial balance';
  }
  if (Number.isNaN(rate)) {
    errors.interestRate = 'Enter a valid interest rate';
  }

  const yearsParsed = yearsRaw === '' ? 0 : parseWhole(input.termYears);
  const monthsParsed = monthsRaw === '' ? 0 : parseWhole(input.termMonths);
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

  const freqOk = DEPOSIT_FREQUENCY_OPTIONS.some((o) => o.value === input.depositFrequency);
  if (!freqOk) {
    errors.form = 'Select a valid deposit frequency';
  }

  let depositAmount = 0;
  if (input.depositFrequency !== 'never') {
    const dep = parseNumber(input.depositAmount);
    if (dep === null) {
      return { isValid: false, errors, result: null };
    }
    if (Number.isNaN(dep) || dep < 0) {
      errors.depositAmount = 'Enter a valid non-negative deposit amount';
    } else {
      depositAmount = dep;
    }
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateContinuousCompoundInterest({
    initialBalance: balance as number,
    interestRatePercent: rate as number,
    termYears: y,
    termMonths: m,
    depositFrequency: input.depositFrequency as DepositFrequency,
    depositAmount,
    depositTiming: input.depositTiming as DepositTiming,
    currency: input.currency,
  });

  return { isValid: result !== null, errors, result };
}
