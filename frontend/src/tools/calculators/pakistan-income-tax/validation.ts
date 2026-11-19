import {
  calculatePakistanIncomeTax,
  formatPakistanRupees,
} from './calculation';
import type {
  PakistanIncomeTaxFieldErrors,
  PakistanIncomeTaxInput,
  PakistanIncomeTaxResult,
} from './types';

export interface PakistanIncomeTaxValidation {
  isValid: boolean;
  errors: PakistanIncomeTaxFieldErrors;
  result: PakistanIncomeTaxResult | null;
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

/**
 * Validates nonnegative monthly income (blank or invalid → no result).
 * Default "0" is a valid filled value and yields zero tax.
 */
export function validatePakistanIncomeTaxInput(
  input: PakistanIncomeTaxInput
): PakistanIncomeTaxValidation {
  const errors: PakistanIncomeTaxFieldErrors = {};
  const monthly = parseNumber(input.monthlyIncome);

  if (monthly.blank) {
    return { isValid: false, errors, result: null };
  }
  if (monthly.invalid || monthly.value === null) {
    errors.monthlyIncome = 'Enter a valid monthly income.';
    return { isValid: false, errors, result: null };
  }
  if (monthly.value < 0) {
    errors.monthlyIncome = 'Monthly income must be zero or greater.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculatePakistanIncomeTax({
    monthlyIncome: monthly.value,
  });
  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: PakistanIncomeTaxResult = {
    monthlyIncome: computed.monthlyIncome,
    yearlyIncome: computed.yearlyIncome,
    yearlyTax: computed.yearlyTax,
    monthlyTax: computed.monthlyTax,
    monthlyIncomeAfterTax: computed.monthlyIncomeAfterTax,
    taxYearLabel: computed.taxYearLabel,
    formattedMonthlyTax: formatPakistanRupees(computed.monthlyTax),
    formattedMonthlyIncomeAfterTax: formatPakistanRupees(
      computed.monthlyIncomeAfterTax
    ),
    formattedYearlyIncome: formatPakistanRupees(computed.yearlyIncome),
    formattedYearlyTax: formatPakistanRupees(computed.yearlyTax),
  };

  return { isValid: true, errors, result };
}
