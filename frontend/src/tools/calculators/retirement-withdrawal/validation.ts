import {
  calculateRetirementWithdrawal,
  type RetirementWithdrawalCanonicalInput,
} from './calculation';
import {
  COMPOUNDING_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  TIMING_OPTIONS,
  type CompoundingMethod,
  type PaymentFrequency,
  type RetirementWithdrawalFieldErrors,
  type RetirementWithdrawalInput,
  type RetirementWithdrawalResult,
  type WithdrawalTiming,
} from './types';

export interface RetirementWithdrawalValidation {
  isValid: boolean;
  errors: RetirementWithdrawalFieldErrors;
  result: RetirementWithdrawalResult | null;
}

function parseNumber(
  raw: string,
  opts?: { allowZero?: boolean; allowNegative?: boolean }
): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  if (!opts?.allowNegative && value < 0) {
    return { value: null, blank: false, invalid: true };
  }
  if (!opts?.allowZero && value === 0 && opts?.allowZero === false) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function isPaymentFrequency(v: string): v is PaymentFrequency {
  return PAYMENT_FREQUENCY_OPTIONS.some((o) => o.value === v);
}

function isCompounding(v: string): v is CompoundingMethod {
  return COMPOUNDING_OPTIONS.some((o) => o.value === v);
}

function isTiming(v: string): v is WithdrawalTiming {
  return TIMING_OPTIONS.some((o) => o.value === v);
}

export function validateRetirementWithdrawalInput(
  input: RetirementWithdrawalInput
): RetirementWithdrawalValidation {
  const errors: RetirementWithdrawalFieldErrors = {};

  if (input.mode !== 'withdrawal' && input.mode !== 'duration') {
    errors.mode = 'Choose what you would like to know.';
  }
  if (!isPaymentFrequency(input.paymentFrequency)) {
    errors.paymentFrequency = 'Select a payment frequency.';
  }
  if (!isCompounding(input.compounding)) {
    errors.compounding = 'Select a compounding method.';
  }
  if (!isTiming(input.timing)) {
    errors.timing = 'Select withdrawal timing.';
  }

  const balance = parseNumber(input.balanceAtRetirement, { allowZero: true });
  if (balance.blank || balance.invalid || balance.value == null) {
    errors.balanceAtRetirement = 'Enter a nonnegative balance.';
  }

  const ageNow = parseNumber(input.ageNow, { allowZero: true });
  if (ageNow.blank || ageNow.invalid || ageNow.value == null) {
    errors.ageNow = 'Enter your current age.';
  } else if (ageNow.value > 120) {
    errors.ageNow = 'Age must be 120 or less.';
  }

  const retireAge = parseNumber(input.retireAge, { allowZero: true });
  if (retireAge.blank || retireAge.invalid || retireAge.value == null) {
    errors.retireAge = 'Enter planned retirement age.';
  } else if (retireAge.value > 120) {
    errors.retireAge = 'Retirement age must be 120 or less.';
  } else if (
    ageNow.value != null &&
    !ageNow.invalid &&
    retireAge.value < ageNow.value
  ) {
    errors.retireAge = 'Retirement age must be ≥ age now.';
  }

  const rate = parseNumber(input.annualInterestRate, {
    allowZero: true,
    allowNegative: true,
  });
  if (rate.blank || rate.invalid || rate.value == null) {
    errors.annualInterestRate = 'Enter an annual interest rate.';
  } else if (rate.value < -99 || rate.value > 100) {
    errors.annualInterestRate = 'Rate must be between −99% and 100%.';
  }

  const inflB = parseNumber(input.inflationBefore, {
    allowZero: true,
    allowNegative: true,
  });
  if (inflB.blank || inflB.invalid || inflB.value == null) {
    errors.inflationBefore = 'Enter pre-retirement inflation.';
  } else if (inflB.value < -50 || inflB.value > 100) {
    errors.inflationBefore = 'Inflation must be between −50% and 100%.';
  }

  const inflA = parseNumber(input.inflationAfter, {
    allowZero: true,
    allowNegative: true,
  });
  if (inflA.blank || inflA.invalid || inflA.value == null) {
    errors.inflationAfter = 'Enter post-retirement inflation.';
  } else if (inflA.value < -50 || inflA.value > 100) {
    errors.inflationAfter = 'Inflation must be between −50% and 100%.';
  }

  const endBal = parseNumber(input.endBalance, { allowZero: true });
  if (endBal.blank || endBal.invalid || endBal.value == null) {
    errors.endBalance = 'Enter a nonnegative ending balance.';
  }

  let yearsInRetirement = 0;
  let withdrawalAmount = 0;

  if (input.mode === 'withdrawal') {
    const years = parseNumber(input.yearsInRetirement);
    if (years.blank || years.invalid || years.value == null) {
      errors.yearsInRetirement = 'Enter planned years in retirement.';
    } else if (years.value <= 0 || years.value > 120) {
      errors.yearsInRetirement = 'Years must be between 0 and 120.';
    } else {
      yearsInRetirement = years.value;
    }
  } else {
    const w = parseNumber(input.withdrawalAmount);
    if (w.blank || w.invalid || w.value == null) {
      errors.withdrawalAmount = 'Enter a withdrawal amount per period.';
    } else if (!(w.value > 0)) {
      errors.withdrawalAmount = 'Withdrawal must be greater than zero.';
    } else {
      withdrawalAmount = w.value;
    }
    // Optional hint years ignored as solve target
    const years = parseNumber(input.yearsInRetirement, { allowZero: true });
    if (!years.blank && !years.invalid && years.value != null) {
      yearsInRetirement = years.value;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const canonical: RetirementWithdrawalCanonicalInput = {
    mode: input.mode,
    currency: input.currency,
    balanceAtRetirement: balance.value!,
    ageNow: ageNow.value!,
    retireAge: retireAge.value!,
    yearsInRetirement,
    withdrawalAmount,
    annualInterestRatePercent: rate.value!,
    inflationBeforePercent: inflB.value!,
    inflationAfterPercent: inflA.value!,
    paymentFrequency: input.paymentFrequency,
    compounding: input.compounding,
    timing: input.timing,
    endBalance: endBal.value!,
    baseCalendarYear: new Date().getFullYear(),
  };

  const result = calculateRetirementWithdrawal(canonical);
  if (!result) {
    errors.balanceAtRetirement =
      'Unable to solve with these inputs — check rates, timeline, and ending balance.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
