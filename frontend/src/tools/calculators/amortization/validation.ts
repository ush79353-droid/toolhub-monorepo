import type {
  AmortizationFieldErrors,
  AmortizationInput,
  AmortizationValidationResult,
  CompoundingFrequency,
  PaymentFrequency,
} from './types';
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
} from './types';

export const MIN_LOAN_AMOUNT = 1;
export const MAX_LOAN_AMOUNT = 100_000_000;
export const MAX_TERM_YEARS = 100;
export const MAX_INTEREST_RATE = 100;

export function getCompoundingPeriodsPerYear(frequency: CompoundingFrequency): number {
  const match = COMPOUNDING_FREQUENCY_OPTIONS.find((opt) => opt.value === frequency);
  return match ? match.periodsPerYear : 12;
}

export function getPaymentPeriodsPerYear(frequency: PaymentFrequency): number {
  const match = PAYMENT_FREQUENCY_OPTIONS.find((opt) => opt.value === frequency);
  return match ? match.periodsPerYear : 12;
}

export function resolveScheduledPeriods(
  termYears: number,
  termMonths: number,
  paymentFrequency: PaymentFrequency
): { numberOfPayments: number; isValidWholePeriods: boolean } {
  if (termYears < 0 || termMonths < 0) {
    return { numberOfPayments: 0, isValidWholePeriods: false };
  }
  const totalYears = termYears + termMonths / 12;
  if (totalYears <= 0) {
    return { numberOfPayments: 0, isValidWholePeriods: false };
  }
  const p = getPaymentPeriodsPerYear(paymentFrequency);
  const exactPayments = totalYears * p;
  const roundedPayments = Math.round(exactPayments);
  const isWhole = Math.abs(exactPayments - roundedPayments) < 1e-4;
  return {
    numberOfPayments: roundedPayments,
    isValidWholePeriods: isWhole && roundedPayments > 0,
  };
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [yearStr, monthStr, dayStr] = value.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateAmortizationInput(input: AmortizationInput): AmortizationValidationResult {
  const errors: AmortizationFieldErrors = {};

  if (!Number.isFinite(input.loanAmount) || input.loanAmount <= 0) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  } else if (input.loanAmount > MAX_LOAN_AMOUNT) {
    errors.loanAmount = `Loan amount cannot exceed ${MAX_LOAN_AMOUNT.toLocaleString()}.`;
  }

  const { numberOfPayments, isValidWholePeriods } = resolveScheduledPeriods(
    input.termYears,
    input.termMonths,
    input.paymentFrequency
  );

  if (input.termYears < 0 || input.termMonths < 0) {
    errors.term = 'Loan term cannot be negative.';
  } else if (input.termYears === 0 && input.termMonths === 0) {
    errors.term = 'Loan term must be greater than 0.';
  } else if (input.termYears > MAX_TERM_YEARS) {
    errors.term = `Loan term cannot exceed ${MAX_TERM_YEARS} years.`;
  } else if (!isValidWholePeriods) {
    errors.term = `Selected term does not produce a whole number of ${input.paymentFrequency} payments.`;
  }

  if (!Number.isFinite(input.interestRate) || input.interestRate < 0) {
    errors.interestRate = 'Interest rate cannot be negative.';
  } else if (input.interestRate > MAX_INTEREST_RATE) {
    errors.interestRate = `Interest rate cannot exceed ${MAX_INTEREST_RATE}%.`;
  }

  if (!COMPOUNDING_FREQUENCY_OPTIONS.some((o) => o.value === input.compoundingFrequency)) {
    errors.compoundingFrequency = 'Invalid compounding frequency selected.';
  }

  if (!PAYMENT_FREQUENCY_OPTIONS.some((o) => o.value === input.paymentFrequency)) {
    errors.paymentFrequency = 'Invalid payment frequency selected.';
  }

  if (input.extraPayment < 0) {
    errors.extraPayment = 'Extra payment cannot be negative.';
  } else if (input.loanAmount > 0 && input.extraPayment >= input.loanAmount) {
    errors.extraPayment = 'Recurring extra payment must be less than the initial loan amount.';
  }

  if (input.recurringExtraStartPeriod < 1) {
    errors.recurringExtraStartPeriod = 'Start period must be at least 1.';
  } else if (numberOfPayments > 0 && input.recurringExtraStartPeriod > numberOfPayments) {
    errors.recurringExtraStartPeriod = 'Start period cannot exceed the total loan term.';
  }

  if (input.recurringExtraEndPeriod !== null) {
    if (input.recurringExtraEndPeriod < input.recurringExtraStartPeriod) {
      errors.recurringExtraEndPeriod = 'End period must be greater than or equal to start period.';
    }
  }

  if (input.oneTimeExtraAmount < 0) {
    errors.oneTimeExtraAmount = 'One-time extra payment cannot be negative.';
  } else if (input.loanAmount > 0 && input.oneTimeExtraAmount >= input.loanAmount) {
    errors.oneTimeExtraAmount = 'One-time extra payment must be less than the initial loan amount.';
  }

  if (input.oneTimeExtraPeriod < 1) {
    errors.oneTimeExtraPeriod = 'Payment period must be at least 1.';
  } else if (numberOfPayments > 0 && input.oneTimeExtraPeriod > numberOfPayments) {
    errors.oneTimeExtraPeriod = 'Payment period cannot exceed the total loan term.';
  }

  if (!input.startDate || !isValidIsoDate(input.startDate)) {
    errors.startDate = 'Please select a valid start date (YYYY-MM-DD).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
