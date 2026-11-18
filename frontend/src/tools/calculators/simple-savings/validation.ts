import { calculateSimpleSavings } from './calculation';
import type { SavingsDraft, SavingsFieldErrors, SavingsResult } from './types';

export interface SimpleSavingsValidation {
  errors: SavingsFieldErrors;
  result: SavingsResult | null;
}

function parseNumber(
  raw: string,
  label: string,
  opts?: { integer?: boolean }
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

/** UI-phase validation: field checks only; engine is stubbed. */
export function validateSimpleSavingsDraft(draft: SavingsDraft): SimpleSavingsValidation {
  const errors: SavingsFieldErrors = {};

  const initial = parseNumber(draft.initialSavings, 'Initial savings');
  const rate = parseNumber(draft.ratePercent, 'Rate');
  const years = parseNumber(draft.termYears, 'Years', { integer: true });
  const months = parseNumber(draft.termMonths, 'Months', { integer: true });
  const deposit = parseNumber(draft.depositAmount, 'Deposit amount');

  if (initial.blank) errors.initialSavings = 'Enter initial savings.';
  else if (initial.error) errors.initialSavings = initial.error;

  if (rate.blank) errors.ratePercent = 'Enter a rate.';
  else if (rate.error) errors.ratePercent = rate.error;

  const yearsVal = years.blank ? 0 : years.value!;
  const monthsVal = months.blank ? 0 : months.value!;
  if (!years.blank && years.error) errors.termYears = years.error;
  if (!months.blank && months.error) errors.termMonths = months.error;
  if (monthsVal >= 12) errors.termMonths = 'Months must be between 0 and 11.';
  if (yearsVal + monthsVal / 12 <= 0) {
    errors.termYears = 'Time length must be greater than zero.';
  }

  if (deposit.blank) errors.depositAmount = 'Enter a deposit amount.';
  else if (deposit.error) errors.depositAmount = deposit.error;

  if (draft.adjustInflation) {
    const inflation = parseNumber(draft.inflationPercent, 'Inflation rate');
    const growth = parseNumber(draft.depositGrowthPercent, 'Deposit growth rate');
    if (inflation.blank) errors.inflationPercent = 'Enter an inflation rate.';
    else if (inflation.error) errors.inflationPercent = inflation.error;
    if (growth.blank) errors.depositGrowthPercent = 'Enter a deposit growth rate.';
    else if (growth.error) errors.depositGrowthPercent = growth.error;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateSimpleSavings({
    knownRate: draft.knownRate,
    ratePercent: rate.value!,
    initialSavings: initial.value!,
    termYears: yearsVal,
    termMonths: monthsVal,
    compounding: draft.compounding,
    depositAmount: deposit.value!,
    depositFrequency: draft.depositFrequency,
    depositTiming: draft.depositTiming,
    adjustInflation: draft.adjustInflation,
    inflationPercent: draft.adjustInflation
      ? Number(draft.inflationPercent.trim().replace(/,/g, ''))
      : 0,
    depositGrowthPercent: draft.adjustInflation
      ? Number(draft.depositGrowthPercent.trim().replace(/,/g, ''))
      : 0,
    resultCurrency: draft.resultCurrency,
  });

  return { errors: {}, result };
}
