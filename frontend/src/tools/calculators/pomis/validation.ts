import { calculatePomisFromInput } from './calculation';
import {
  DEFAULT_POMIS_SCHEME,
  accountLimit,
  type PomisFieldErrors,
  type PomisInput,
  type PomisResult,
  type PomisSchemeConfig,
} from './types';

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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function parseIsoDate(raw: string): boolean {
  const t = raw.trim();
  if (t === '') return true;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === mo - 1 &&
    dt.getUTCDate() === d
  );
}

export interface PomisValidation {
  isValid: boolean;
  errors: PomisFieldErrors;
  result: PomisResult | null;
}

function hasErrors(errors: PomisFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: PomisInput,
  scheme: PomisSchemeConfig = DEFAULT_POMIS_SCHEME,
): PomisFieldErrors {
  const errors: PomisFieldErrors = {};
  const limit = accountLimit(input.accountType, scheme);
  const accountLabel =
    input.accountType === 'joint' ? 'Joint' : 'Individual';

  const amount = parseNumber(input.investmentAmount);
  if (!amount.blank) {
    if (amount.invalid || amount.value == null) {
      errors.investmentAmount = 'Please enter a valid investment amount.';
    } else if (amount.value <= 0) {
      errors.investmentAmount = 'Investment amount must be greater than zero.';
    } else if (amount.value < scheme.minimumInvestment) {
      errors.investmentAmount = `Minimum investment is ₹${scheme.minimumInvestment.toLocaleString('en-IN')}.`;
    } else if (amount.value > limit) {
      errors.investmentAmount = `The investment amount exceeds the configured limit for an ${accountLabel} POMIS account (₹${limit.toLocaleString('en-IN')}).`;
    } else if (
      scheme.investmentIncrement > 0 &&
      Math.round(amount.value * 100) %
        Math.round(scheme.investmentIncrement * 100) !==
        0
    ) {
      errors.investmentAmount = `Investment should be in multiples of ₹${scheme.investmentIncrement.toLocaleString('en-IN')}.`;
    }
  }

  const rate = parseNumber(input.annualInterestRate);
  if (!rate.blank) {
    if (rate.invalid || rate.value == null) {
      errors.annualInterestRate = 'Please enter a valid annual interest rate.';
    } else if (rate.value < 0) {
      errors.annualInterestRate = 'Interest rate cannot be negative.';
    } else if (rate.value > 50) {
      errors.annualInterestRate =
        'Interest rate above 50% is outside the supported range.';
    }
  }

  if (input.investmentStartDate.trim() !== '') {
    if (!parseIsoDate(input.investmentStartDate)) {
      errors.investmentStartDate = 'The selected investment date is invalid.';
    }
  }

  return errors;
}

export function validatePomisInput(
  input: PomisInput,
  scheme: PomisSchemeConfig = DEFAULT_POMIS_SCHEME,
): PomisValidation {
  const errors = collectFieldErrors(input, scheme);
  const amount = parseNumber(input.investmentAmount);
  const rate = parseNumber(input.annualInterestRate);

  if (amount.blank || rate.blank || hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculatePomisFromInput(input, scheme);
  if (!result) {
    return {
      isValid: false,
      errors: {
        ...errors,
        form: 'Unable to calculate POMIS income with the current inputs.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
