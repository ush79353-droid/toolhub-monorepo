import {
  calculatePITI,
  formatPitiMoney,
  interpretPiti,
} from './calculation';
import type {
  PitiFieldErrors,
  PitiInput,
  PitiResult,
} from './types';

export interface PitiValidation {
  isValid: boolean;
  errors: PitiFieldErrors;
  result: PitiResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function parseNonNegInt(
  raw: string,
  label: string,
  max?: number
): { value: number | null; error?: string; blank: boolean } {
  const parsed = parseNumber(raw);
  if (parsed.blank) {
    return { value: null, blank: true, error: `Enter ${label}.` };
  }
  if (parsed.invalid || parsed.value === null) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (parsed.value < 0) {
    return {
      value: null,
      blank: false,
      error: `${label[0]!.toUpperCase()}${label.slice(1)} cannot be negative.`,
    };
  }
  if (!Number.isInteger(parsed.value)) {
    return {
      value: null,
      blank: false,
      error: `${label[0]!.toUpperCase()}${label.slice(1)} must be a whole number.`,
    };
  }
  if (max !== undefined && parsed.value > max) {
    return {
      value: null,
      blank: false,
      error: `${label[0]!.toUpperCase()}${label.slice(1)} must be ${max} or fewer.`,
    };
  }
  return { value: parsed.value, blank: false };
}

export function validatePitiInput(input: PitiInput): PitiValidation {
  const errors: PitiFieldErrors = {};
  const currency = input.currency;
  let hasFieldError = false;

  const principal = parseNumber(input.principal);
  if (principal.blank) {
    errors.principal = 'Enter the mortgage principal.';
    hasFieldError = true;
  } else if (principal.invalid || principal.value === null) {
    errors.principal = 'Enter a valid principal.';
    hasFieldError = true;
  } else if (principal.value < 0) {
    errors.principal = 'Principal cannot be negative.';
    hasFieldError = true;
  }

  const years = parseNonNegInt(input.termYears, 'term years');
  if (years.error) {
    errors.termYears = years.error;
    hasFieldError = true;
  }

  // Blank months → 0 when paired with years (screenshot-style years + months).
  let monthsValue: number | null = null;
  const monthsRaw = input.termMonths.trim();
  if (monthsRaw === '') {
    monthsValue = 0;
  } else {
    const months = parseNonNegInt(input.termMonths, 'term months', 11);
    if (months.error) {
      errors.termMonths = months.error;
      hasFieldError = true;
    } else {
      monthsValue = months.value;
    }
  }

  if (
    !hasFieldError &&
    years.value !== null &&
    monthsValue !== null &&
    years.value * 12 + monthsValue <= 0
  ) {
    errors.termYears = 'Mortgage term must be greater than zero.';
    hasFieldError = true;
  }

  const rate = parseNumber(input.annualInterestRate);
  if (rate.blank) {
    errors.annualInterestRate = 'Enter the annual interest rate.';
    hasFieldError = true;
  } else if (rate.invalid || rate.value === null) {
    errors.annualInterestRate = 'Enter a valid interest rate.';
    hasFieldError = true;
  } else if (rate.value < 0) {
    errors.annualInterestRate = 'Interest rate cannot be negative.';
    hasFieldError = true;
  } else if (rate.value > 100) {
    errors.annualInterestRate = 'Interest rate is unrealistically high.';
    hasFieldError = true;
  }

  const tax = parseNumber(input.annualPropertyTax);
  if (tax.blank) {
    errors.annualPropertyTax = 'Enter annual property tax (or 0).';
    hasFieldError = true;
  } else if (tax.invalid || tax.value === null) {
    errors.annualPropertyTax = 'Enter a valid annual property tax.';
    hasFieldError = true;
  } else if (tax.value < 0) {
    errors.annualPropertyTax = 'Property tax cannot be negative.';
    hasFieldError = true;
  }

  const insurance = parseNumber(input.annualInsurance);
  if (insurance.blank) {
    errors.annualInsurance = 'Enter annual homeowners insurance (or 0).';
    hasFieldError = true;
  } else if (insurance.invalid || insurance.value === null) {
    errors.annualInsurance = 'Enter a valid annual insurance amount.';
    hasFieldError = true;
  } else if (insurance.value < 0) {
    errors.annualInsurance = 'Insurance cannot be negative.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    principal.value === null ||
    years.value === null ||
    monthsValue === null ||
    rate.value === null ||
    tax.value === null ||
    insurance.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculatePITI({
    principal: principal.value,
    termYears: years.value,
    termMonths: monthsValue,
    annualInterestRate: rate.value,
    annualPropertyTax: tax.value,
    annualInsurance: insurance.value,
  });

  if (math === null) {
    errors.form = 'Unable to calculate PITI with the entered values.';
    return { isValid: false, errors, result: null };
  }

  const result: PitiResult = {
    ...math,
    status: 'valid',
    interpretation: interpretPiti(math.monthlyPITI, currency),
    warningMessage:
      'Fixed-rate amortizing estimate. Tax and insurance are annual amounts ÷ 12. Does not include PMI, HOA, utilities, or maintenance. Amounts share one currency label (no FX).',
    currency,
    formattedPI: formatPitiMoney(math.monthlyPrincipalAndInterest, currency),
    formattedTax: formatPitiMoney(math.monthlyPropertyTax, currency),
    formattedInsurance: formatPitiMoney(
      math.monthlyHomeownersInsurance,
      currency
    ),
    formattedPITI: formatPitiMoney(math.monthlyPITI, currency),
    formattedAnnualPITI: formatPitiMoney(math.annualPITI, currency),
    formattedTotalPayments: formatPitiMoney(
      math.totalMortgagePayments,
      currency
    ),
    formattedTotalInterest: formatPitiMoney(
      math.totalMortgageInterest,
      currency
    ),
    formattedEscrow: formatPitiMoney(math.monthlyEscrow, currency),
  };

  return { isValid: true, errors, result };
}
