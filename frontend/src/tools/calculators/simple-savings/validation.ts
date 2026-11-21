import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { parseMoneyInput } from '@/tools/shared/money-value';
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

function normalizeToResultCurrency(
  amount: number,
  from: string,
  to: string,
  rates: CurrencyRatesSnapshot | null | undefined
): { amount: number } | { error: string } {
  if (from === to) return { amount };
  if (!rates?.available) {
    return { error: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { error: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { amount: converted.amount };
}

export function validateSimpleSavingsDraft(
  draft: SavingsDraft,
  rates?: CurrencyRatesSnapshot | null
): SimpleSavingsValidation {
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

  let inflationVal = 0;
  let growthVal = 0;
  if (draft.adjustInflation) {
    const inflation = parseNumber(draft.inflationPercent, 'Inflation rate');
    const growth = parseNumber(draft.depositGrowthPercent, 'Deposit growth rate');
    if (inflation.blank) errors.inflationPercent = 'Enter an inflation rate.';
    else if (inflation.error) errors.inflationPercent = inflation.error;
    else inflationVal = inflation.value!;
    if (growth.blank) errors.depositGrowthPercent = 'Enter a deposit growth rate.';
    else if (growth.error) errors.depositGrowthPercent = growth.error;
    else growthVal = growth.value!;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const resultCurrency = draft.resultCurrency;
  const initialNorm = normalizeToResultCurrency(
    initial.value!,
    draft.initialCurrency,
    resultCurrency,
    rates
  );
  if ('error' in initialNorm) {
    errors.currency = initialNorm.error;
    return { errors, result: null };
  }
  const depositNorm = normalizeToResultCurrency(
    deposit.value!,
    draft.depositCurrency,
    resultCurrency,
    rates
  );
  if ('error' in depositNorm) {
    errors.currency = depositNorm.error;
    return { errors, result: null };
  }

  if (!Number.isFinite(parseMoneyInput(draft.initialSavings))) {
    errors.initialSavings = 'Enter initial savings.';
    return { errors, result: null };
  }

  const result = calculateSimpleSavings({
    knownRate: draft.knownRate,
    ratePercent: rate.value!,
    initialSavings: initialNorm.amount,
    termYears: yearsVal,
    termMonths: monthsVal,
    compounding: draft.compounding,
    depositAmount: depositNorm.amount,
    depositFrequency: draft.depositFrequency,
    depositTiming: draft.depositTiming,
    adjustInflation: draft.adjustInflation,
    inflationPercent: inflationVal,
    depositGrowthPercent: growthVal,
    resultCurrency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { errors, result: null };
  }

  return { errors: {}, result };
}
