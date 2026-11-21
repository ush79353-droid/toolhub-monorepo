import { calculateMoratoriumFromInput, toMonths } from './calculation';
import type {
  MoratoriumFieldErrors,
  MoratoriumInput,
  MoratoriumResult,
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

export interface MoratoriumValidation {
  isValid: boolean;
  errors: MoratoriumFieldErrors;
  result: MoratoriumResult | null;
}

function hasErrors(errors: MoratoriumFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: MoratoriumInput,
): MoratoriumFieldErrors {
  const errors: MoratoriumFieldErrors = {};

  const amount = parseNumber(input.loanAmount);
  if (!amount.blank) {
    if (amount.invalid || amount.value == null) {
      errors.loanAmount = 'Please enter a valid loan amount.';
    } else if (amount.value <= 0) {
      errors.loanAmount = 'Loan amount must be greater than zero.';
    }
  }

  if (
    input.dateOfBalance.trim() !== '' &&
    !/^\d{4}-\d{2}-\d{2}$/.test(input.dateOfBalance)
  ) {
    errors.dateOfBalance = 'Please enter a valid balance date.';
  }

  const rate = parseNumber(input.annualInterestRate);
  if (!rate.blank) {
    if (rate.invalid || rate.value == null) {
      errors.annualInterestRate = 'Please enter a valid interest rate.';
    } else if (rate.value < 0) {
      errors.annualInterestRate = 'Interest rate cannot be negative.';
    }
  }

  if (input.estimationMode === 'loan-term') {
    const t = parseNumber(input.loanTermValue);
    if (!t.blank) {
      if (t.invalid || t.value == null) {
        errors.loanTermValue = 'Please enter a valid loan term.';
      } else if (t.value <= 0) {
        errors.loanTermValue = 'Loan term must be greater than zero.';
      } else if (toMonths(t.value, input.loanTermUnit) == null) {
        errors.loanTermValue =
          'Term must resolve to a whole number of months.';
      }
    }
  } else {
    const emi = parseNumber(input.monthlyPayment);
    if (!emi.blank) {
      if (emi.invalid || emi.value == null) {
        errors.monthlyPayment = 'Please enter a valid monthly payment.';
      } else if (emi.value <= 0) {
        errors.monthlyPayment = 'Monthly payment must be greater than zero.';
      }
    }
  }

  if (
    input.moratoriumStartDate.trim() !== '' &&
    !/^\d{4}-\d{2}-\d{2}$/.test(input.moratoriumStartDate)
  ) {
    errors.moratoriumStartDate = 'Please enter a valid moratorium start date.';
  }

  if (
    input.dateOfBalance &&
    input.moratoriumStartDate &&
    /^\d{4}-\d{2}-\d{2}$/.test(input.dateOfBalance) &&
    /^\d{4}-\d{2}-\d{2}$/.test(input.moratoriumStartDate) &&
    input.moratoriumStartDate < input.dateOfBalance
  ) {
    errors.moratoriumStartDate =
      'Moratorium start cannot be before the date of balance.';
  }

  const mora = parseNumber(input.moratoriumDurationValue);
  if (!mora.blank) {
    if (mora.invalid || mora.value == null) {
      errors.moratoriumDurationValue = 'Please enter a valid moratorium period.';
    } else if (mora.value < 0) {
      errors.moratoriumDurationValue = 'Moratorium period cannot be negative.';
    } else if (toMonths(mora.value, input.moratoriumDurationUnit, true) == null) {
      errors.moratoriumDurationValue =
        'Moratorium must resolve to a whole number of months.';
    }
  }

  return errors;
}

export function validateMoratoriumInput(
  input: MoratoriumInput,
): MoratoriumValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const required =
    input.loanAmount.trim() !== '' &&
    input.annualInterestRate.trim() !== '' &&
    input.dateOfBalance.trim() !== '' &&
    input.moratoriumStartDate.trim() !== '' &&
    input.moratoriumDurationValue.trim() !== '' &&
    (input.estimationMode === 'loan-term'
      ? input.loanTermValue.trim() !== ''
      : input.monthlyPayment.trim() !== '');

  if (!required) {
    return { isValid: false, errors: {}, result: null };
  }

  const result = calculateMoratoriumFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form:
          'Unable to calculate under these assumptions. Check EMI covers interest, dates, and that same-term restructuring leaves repayment periods after the moratorium.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
