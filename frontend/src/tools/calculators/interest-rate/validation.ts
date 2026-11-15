import {
  calculateDepositInterestRate,
  calculateLoanInterestRate,
} from './calculation';
import type {
  InterestRateFieldErrors,
  InterestRateInput,
  InterestRateResult,
} from './types';

export interface InterestRateValidation {
  isValid: boolean;
  errors: InterestRateFieldErrors;
  result: InterestRateResult | null;
}

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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateInterestRateInput(
  input: InterestRateInput
): InterestRateValidation {
  const errors: InterestRateFieldErrors = {};

  const termYears = parseNumber(input.termYears);
  const termMonths = parseNumber(input.termMonths);

  if (termYears.blank || termYears.invalid || termYears.value === null) {
    errors.termYears = 'Enter a valid term in years.';
  } else if (termYears.value < 0) {
    errors.termYears = 'Years cannot be negative.';
  }

  if (termMonths.blank || termMonths.invalid || termMonths.value === null) {
    errors.termMonths = 'Enter a valid term in months.';
  } else if (termMonths.value < 0) {
    errors.termMonths = 'Months cannot be negative.';
  } else if (!Number.isInteger(termMonths.value)) {
    errors.termMonths = 'Months must be a whole number.';
  }

  if (input.mode === 'loan') {
    const loanAmount = parseNumber(input.loanAmount);
    const periodicPayment = parseNumber(input.periodicPayment);
    const prepaidFees = parseNumber(input.prepaidFees);
    const loanedFees = parseNumber(input.loanedFees);

    if (loanAmount.blank || loanAmount.invalid || loanAmount.value === null) {
      errors.loanAmount = 'Enter a valid loan amount.';
    } else if (!(loanAmount.value > 0)) {
      errors.loanAmount = 'Loan amount must be greater than zero.';
    }

    if (
      periodicPayment.blank ||
      periodicPayment.invalid ||
      periodicPayment.value === null
    ) {
      errors.periodicPayment = 'Enter a valid periodic payment.';
    } else if (!(periodicPayment.value > 0)) {
      errors.periodicPayment = 'Periodic payment must be greater than zero.';
    }

    if (prepaidFees.blank || prepaidFees.invalid || prepaidFees.value === null) {
      errors.prepaidFees = 'Enter a valid prepaid fee amount.';
    } else if (prepaidFees.value < 0) {
      errors.prepaidFees = 'Prepaid fees cannot be negative.';
    }

    if (loanedFees.blank || loanedFees.invalid || loanedFees.value === null) {
      errors.loanedFees = 'Enter a valid loaned fee amount.';
    } else if (loanedFees.value < 0) {
      errors.loanedFees = 'Loaned fees cannot be negative.';
    }

    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }

    const result = calculateLoanInterestRate({
      loanAmount: loanAmount.value!,
      termYears: termYears.value!,
      termMonths: termMonths.value!,
      capitalizationFrequency: input.capitalizationFrequency,
      paymentFrequency: input.paymentFrequency,
      periodicPayment: periodicPayment.value!,
      prepaidFees: prepaidFees.value!,
      loanedFees: loanedFees.value!,
      currency: input.currency,
    });

    if (!result) {
      errors.form =
        'This loan cannot produce a finite interest rate. Check that total payments exceed the loan amount.';
      return { isValid: false, errors, result: null };
    }

    return { isValid: true, errors: {}, result };
  }

  const initialDeposit = parseNumber(input.initialDeposit);
  const currentBalance = parseNumber(input.currentBalance);

  if (
    initialDeposit.blank ||
    initialDeposit.invalid ||
    initialDeposit.value === null
  ) {
    errors.initialDeposit = 'Enter a valid initial deposit.';
  } else if (!(initialDeposit.value > 0)) {
    errors.initialDeposit = 'Initial deposit must be greater than zero.';
  }

  if (
    currentBalance.blank ||
    currentBalance.invalid ||
    currentBalance.value === null
  ) {
    errors.currentBalance = 'Enter a valid current balance.';
  } else if (!(currentBalance.value > 0)) {
    errors.currentBalance = 'Current balance must be greater than zero.';
  } else if (
    initialDeposit.value !== null &&
    !(currentBalance.value > initialDeposit.value)
  ) {
    errors.currentBalance = 'Current balance must be greater than the initial deposit.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateDepositInterestRate({
    initialDeposit: initialDeposit.value!,
    currentBalance: currentBalance.value!,
    termYears: termYears.value!,
    termMonths: termMonths.value!,
    capitalizationFrequency: input.capitalizationFrequency,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This deposit cannot produce a finite interest rate.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
