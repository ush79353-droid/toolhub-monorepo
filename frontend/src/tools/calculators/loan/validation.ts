import {
  isValidIsoCalendarDate,
  resolveTotalMonths,
  toCents,
} from '../auto-loan/validation';
import type {
  FeeMode,
  LoanFieldErrors,
  LoanInput,
  LoanValidationResult,
  PaymentFrequency,
  TermUnit,
} from './types';

export const MAX_LOAN_AMOUNT = 100_000_000;
export const MAX_LOAN_MONTHS = 600;
export const MAX_INTEREST_RATE = 100;
export const MAX_FEE_PERCENT = 50;

export { isValidIsoCalendarDate, resolveTotalMonths, toCents };

export function getPaymentsPerYear(frequency: PaymentFrequency): number {
  if (frequency === 'biweekly') return 26;
  if (frequency === 'weekly') return 52;
  return 12;
}

export function resolveScheduledPeriods(totalMonths: number, frequency: PaymentFrequency): number {
  if (!Number.isFinite(totalMonths) || totalMonths <= 0) return NaN;
  if (frequency === 'monthly') return Math.round(totalMonths);
  const perYear = getPaymentsPerYear(frequency);
  return Math.max(1, Math.round((totalMonths / 12) * perYear));
}

export function resolveInterestOnlyPeriods(
  interestOnlyMonths: number,
  totalPeriods: number,
  frequency: PaymentFrequency
): number {
  if (!Number.isFinite(interestOnlyMonths) || interestOnlyMonths <= 0) return NaN;
  if (frequency === 'monthly') return Math.round(interestOnlyMonths);
  const perYear = getPaymentsPerYear(frequency);
  return Math.min(totalPeriods, Math.max(1, Math.round((interestOnlyMonths / 12) * perYear)));
}

export function resolveOriginationFeeCents(
  loanAmountCents: number,
  feeValue: number,
  feeMode: FeeMode
): number {
  if (!Number.isFinite(feeValue)) return NaN;
  if (feeMode === 'percent') {
    return Math.round(loanAmountCents * (feeValue / 100));
  }
  return toCents(feeValue);
}

function isFiniteNonNegative(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function validateWholeMonths(
  value: number,
  unit: TermUnit,
  fieldLabel: string
): { months: number; error?: string } {
  if (!Number.isFinite(value) || value <= 0) {
    return { months: NaN, error: `${fieldLabel} must be greater than 0.` };
  }
  const rawMonths = resolveTotalMonths(value, unit);
  if (Math.abs(rawMonths - Math.round(rawMonths)) > 1e-6) {
    return {
      months: NaN,
      error:
        unit === 'months'
          ? `${fieldLabel} in months must be a whole number.`
          : 'Enter years that convert to a whole number of months (e.g., 5 or 2.5).',
    };
  }
  return { months: Math.round(rawMonths) };
}

export function validateLoanInput(input: LoanInput): LoanValidationResult {
  const errors: LoanFieldErrors = {};

  if (!Number.isFinite(input.loanAmount) || input.loanAmount <= 0) {
    errors.loanAmount = 'Enter a loan amount greater than 0.';
  } else if (input.loanAmount > MAX_LOAN_AMOUNT) {
    errors.loanAmount = `Loan amount cannot exceed ${MAX_LOAN_AMOUNT.toLocaleString()}.`;
  }

  if (
    !isFiniteNonNegative(input.annualInterestRate) ||
    input.annualInterestRate > MAX_INTEREST_RATE
  ) {
    errors.annualInterestRate = `APR must be between 0% and ${MAX_INTEREST_RATE}%.`;
  }

  const termCheck = validateWholeMonths(input.loanTermValue, input.loanTermUnit, 'Loan term');
  let totalMonths = NaN;
  let totalPeriods = NaN;
  if (termCheck.error) {
    errors.loanTermValue = termCheck.error;
  } else if (termCheck.months < 1 || termCheck.months > MAX_LOAN_MONTHS) {
    errors.loanTermValue = `Loan term must be between 1 and ${MAX_LOAN_MONTHS} months (50 years).`;
  } else {
    totalMonths = termCheck.months;
    totalPeriods = resolveScheduledPeriods(totalMonths, input.paymentFrequency);
  }

  if (input.loanMode === 'interest-only') {
    const ioCheck = validateWholeMonths(
      input.interestOnlyValue,
      input.interestOnlyUnit,
      'Interest-only period'
    );
    if (ioCheck.error) {
      errors.interestOnlyValue = ioCheck.error;
    } else if (Number.isFinite(totalMonths) && ioCheck.months > totalMonths) {
      errors.interestOnlyValue = 'Interest-only period cannot exceed the total loan term.';
    }
  }

  if (!isFiniteNonNegative(input.originationFeeValue)) {
    errors.originationFeeValue = 'Origination fee must be 0 or greater.';
  } else if (input.originationFeeMode === 'percent' && input.originationFeeValue > MAX_FEE_PERCENT) {
    errors.originationFeeValue = `Origination fee percentage cannot exceed ${MAX_FEE_PERCENT}%.`;
  } else if (
    input.originationFeeMode === 'amount' &&
    Number.isFinite(input.loanAmount) &&
    input.loanAmount > 0 &&
    input.originationFeeValue > input.loanAmount
  ) {
    errors.originationFeeValue = 'Origination fee cannot exceed the loan amount.';
  }

  if (!isFiniteNonNegative(input.extraPaymentAmount) || input.extraPaymentAmount > MAX_LOAN_AMOUNT) {
    errors.extraPaymentAmount = `Extra payment must be between 0 and ${MAX_LOAN_AMOUNT.toLocaleString()}.`;
  }

  if (!isFiniteNonNegative(input.oneTimeExtraAmount) || input.oneTimeExtraAmount > MAX_LOAN_AMOUNT) {
    errors.oneTimeExtraAmount = `One-time extra payment must be between 0 and ${MAX_LOAN_AMOUNT.toLocaleString()}.`;
  }

  if (input.oneTimeExtraAmount > 0) {
    if (!Number.isInteger(input.oneTimeExtraPeriod) || input.oneTimeExtraPeriod < 1) {
      errors.oneTimeExtraPeriod = 'Enter a whole payment number of 1 or greater.';
    } else if (Number.isFinite(totalPeriods) && input.oneTimeExtraPeriod > totalPeriods) {
      errors.oneTimeExtraPeriod = `Payment # must be between 1 and ${totalPeriods}.`;
    }
  } else if (!Number.isInteger(input.oneTimeExtraPeriod) || input.oneTimeExtraPeriod < 1) {
    errors.oneTimeExtraPeriod = 'Payment # must be a whole number of 1 or greater.';
  }

  if (!isValidIsoCalendarDate(input.startDate)) {
    errors.startDate = 'Enter a valid loan start date.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

