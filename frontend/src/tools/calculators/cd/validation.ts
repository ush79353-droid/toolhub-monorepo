import { calculateCd } from './calculation';
import {
  CD_COMPOUNDING_OPTIONS,
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

function parseOptionalInt(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num)) return Number.NaN;
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
  const tax = parseNumber(input.marginalTaxRate);
  const yearsRaw = input.depositYears.trim();
  const monthsRaw = input.depositMonths.trim();

  if (
    deposit === null ||
    rate === null ||
    tax === null ||
    (yearsRaw === '' && monthsRaw === '')
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(deposit) || !(deposit > 0)) {
    errors.initialDeposit = 'Enter a deposit greater than zero';
  }

  if (Number.isNaN(rate) || rate < 0) {
    errors.interestRate = 'Enter a valid non-negative interest rate';
  } else if (rate > 1000) {
    errors.interestRate = 'Interest rate is too large';
  }

  if (Number.isNaN(tax) || tax < 0 || tax > 100) {
    errors.marginalTaxRate = 'Enter a tax rate between 0 and 100';
  }

  const yearsParsed = yearsRaw === '' ? 0 : parseOptionalInt(input.depositYears);
  const monthsParsed = monthsRaw === '' ? 0 : parseOptionalInt(input.depositMonths);

  if (yearsRaw !== '' && (Number.isNaN(yearsParsed as number) || (yearsParsed as number) < 0)) {
    errors.depositYears = 'Enter whole years (0 or more)';
  }
  if (
    monthsRaw !== '' &&
    (Number.isNaN(monthsParsed as number) ||
      (monthsParsed as number) < 0 ||
      (monthsParsed as number) > 11)
  ) {
    errors.depositMonths = 'Enter whole months from 0 to 11';
  }

  const y = Number.isFinite(yearsParsed as number) ? (yearsParsed as number) : 0;
  const m = Number.isFinite(monthsParsed as number) ? (monthsParsed as number) : 0;
  if (!errors.depositYears && !errors.depositMonths && y + m / 12 <= 0) {
    errors.depositYears = 'Deposit length must be greater than zero';
  }

  if (!CD_COMPOUNDING_OPTIONS.some((o) => o.value === input.compounding)) {
    errors.compounding = 'Select a valid compounding frequency';
  }

  if (input.rateConvention !== 'nominal' && input.rateConvention !== 'apy') {
    errors.form = 'Select a valid rate convention';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCd({
    initialDeposit: deposit as number,
    interestRatePercent: rate as number,
    rateConvention: input.rateConvention,
    compounding: input.compounding,
    depositYears: y,
    depositMonths: m,
    marginalTaxRatePercent: tax as number,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors, result };
}
