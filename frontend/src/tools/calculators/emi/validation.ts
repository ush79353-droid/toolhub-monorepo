import { calculateEmiFromInput, resolveTermMonths } from './calculation';
import type { EmiFieldErrors, EmiInput, EmiResult } from './types';

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

export interface EmiValidation {
  isValid: boolean;
  errors: EmiFieldErrors;
  result: EmiResult | null;
}

function hasErrors(errors: EmiFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(input: EmiInput): EmiFieldErrors {
  const errors: EmiFieldErrors = {};

  const p = parseNumber(input.principal);
  if (!p.blank) {
    if (p.invalid || p.value == null) {
      errors.principal = 'Please enter a valid principal loan amount.';
    } else if (p.value <= 0) {
      errors.principal = 'Principal must be greater than zero.';
    }
  }

  const t = parseNumber(input.termValue);
  if (!t.blank) {
    if (t.invalid || t.value == null) {
      errors.termValue = 'Please enter a valid loan term.';
    } else if (t.value <= 0) {
      errors.termValue = 'Loan term must be greater than zero.';
    } else if (!Number.isInteger(t.value)) {
      errors.termValue = 'Loan term must be a whole number of periods.';
    } else if (resolveTermMonths(t.value, input.termUnit) == null) {
      errors.termValue = 'Please enter a valid loan term.';
    }
  }

  const r = parseNumber(input.annualInterestRate);
  if (!r.blank) {
    if (r.invalid || r.value == null) {
      errors.annualInterestRate = 'Please enter a valid interest rate.';
    } else if (r.value < 0) {
      errors.annualInterestRate = 'Interest rate cannot be negative.';
    }
  }

  if (input.enableBalanceLookup) {
    const k = parseNumber(input.paymentsMade);
    const months =
      t.value != null && !t.blank && !t.invalid
        ? resolveTermMonths(t.value, input.termUnit)
        : null;
    if (k.blank) {
      errors.paymentsMade = 'Enter payments already made.';
    } else if (k.invalid || k.value == null || !Number.isInteger(k.value)) {
      errors.paymentsMade = 'Payments made must be a whole number.';
    } else if (k.value < 0) {
      errors.paymentsMade = 'Payments made cannot be negative.';
    } else if (months != null && k.value > months) {
      errors.paymentsMade = 'Payments made cannot exceed the loan term.';
    }
  }

  if (input.enableExtraPayment) {
    const e = parseNumber(input.extraMonthlyPayment);
    if (e.blank) {
      errors.extraMonthlyPayment = 'Enter an extra monthly payment amount.';
    } else if (e.invalid || e.value == null || e.value < 0) {
      errors.extraMonthlyPayment = 'Extra payment cannot be negative.';
    }
  }

  if (input.enableComparison) {
    const cp = parseNumber(input.comparePrincipal);
    const cr = parseNumber(input.compareRate);
    const ct = parseNumber(input.compareTermValue);
    if (!cp.blank && (cp.invalid || cp.value == null || cp.value <= 0)) {
      errors.comparePrincipal = 'Please enter a valid Loan B principal.';
    }
    if (!cr.blank && (cr.invalid || cr.value == null || cr.value < 0)) {
      errors.compareRate = 'Please enter a valid Loan B interest rate.';
    }
    if (
      !ct.blank &&
      (ct.invalid ||
        ct.value == null ||
        ct.value <= 0 ||
        !Number.isInteger(ct.value))
    ) {
      errors.compareTermValue = 'Please enter a valid Loan B term.';
    }
  }

  return errors;
}

export function validateEmiInput(input: EmiInput): EmiValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  if (
    input.principal.trim() === '' ||
    input.termValue.trim() === '' ||
    input.annualInterestRate.trim() === ''
  ) {
    return { isValid: false, errors: {}, result: null };
  }

  const result = calculateEmiFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate EMI with the selected inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
