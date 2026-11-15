import { calculateCompoundInterest } from './calculation';
import type {
  CompoundInterestDraft,
  CompoundInterestFieldErrors,
  CompoundInterestResult,
} from './types';

export interface CompoundInterestValidation {
  errors: CompoundInterestFieldErrors;
  result: CompoundInterestResult | null;
}

function parseNumber(
  raw: string,
  label: string,
  opts?: { allowBlank?: boolean; integer?: boolean }
): { value: number | null; blank: boolean; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (opts?.integer) {
    if (!/^\+?\d+$/.test(cleaned)) {
      return { value: null, blank: false, error: `${label} must be a whole number.` };
    }
  } else if (!/^\+?\d+(\.\d+)?$/.test(cleaned)) {
    return { value: null, blank: false, error: `${label} must be a non-negative number.` };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (value < 0) {
    return { value: null, blank: false, error: `${label} cannot be negative.` };
  }
  return { value, blank: false };
}

export function validateCompoundInterestDraft(
  draft: CompoundInterestDraft
): CompoundInterestValidation {
  const errors: CompoundInterestFieldErrors = {};

  const initial = parseNumber(draft.initialBalance, 'Initial balance');
  const rate = parseNumber(draft.interestRate, 'Interest rate');
  const years = parseNumber(draft.termYears, 'Years', { integer: true });
  const months = parseNumber(draft.termMonths, 'Months', { integer: true });

  if (initial.blank) errors.initialBalance = 'Enter an initial balance.';
  else if (initial.error) errors.initialBalance = initial.error;

  if (rate.blank) errors.interestRate = 'Enter an interest rate.';
  else if (rate.error) errors.interestRate = rate.error;

  const yearsVal = years.blank ? 0 : years.value!;
  const monthsVal = months.blank ? 0 : months.value!;
  if (!years.blank && years.error) errors.termYears = years.error;
  if (!months.blank && months.error) errors.termMonths = months.error;
  if (monthsVal >= 12) {
    errors.termMonths = 'Months must be between 0 and 11.';
  }
  if (yearsVal + monthsVal / 12 <= 0) {
    errors.termYears = 'Term must be greater than zero.';
  }

  let depositAmount = 0;
  if (draft.depositFrequency !== 'never') {
    const dep = parseNumber(draft.depositAmount, 'Deposit amount');
    if (dep.blank) errors.depositAmount = 'Enter a deposit amount.';
    else if (dep.error) errors.depositAmount = dep.error;
    else depositAmount = dep.value!;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateCompoundInterest({
    initialBalance: initial.value!,
    interestRatePercent: rate.value!,
    termYears: yearsVal,
    termMonths: monthsVal,
    compounding: draft.compounding,
    depositFrequency: draft.depositFrequency,
    depositAmount,
    depositTiming: draft.depositTiming,
    currency: draft.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { errors, result: null };
  }

  return { errors: {}, result };
}
