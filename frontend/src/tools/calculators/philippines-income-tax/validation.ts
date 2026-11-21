import {
  calculatePhilippinesIncomeTax,
  formatPhp,
} from './calculation';
import type {
  PhilippinesIncomeTaxFieldErrors,
  PhilippinesIncomeTaxInput,
  PhilippinesIncomeTaxResult,
} from './types';

export interface PhilippinesIncomeTaxValidation {
  isValid: boolean;
  errors: PhilippinesIncomeTaxFieldErrors;
  result: PhilippinesIncomeTaxResult | null;
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
 * Validates nonnegative monthly income (blank → no result).
 * Default empty field waits for input; "0" is a valid filled value.
 */
export function validatePhilippinesIncomeTaxInput(
  input: PhilippinesIncomeTaxInput
): PhilippinesIncomeTaxValidation {
  const errors: PhilippinesIncomeTaxFieldErrors = {};
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

  if (
    input.employmentStatus !== 'employed' &&
    input.employmentStatus !== 'self-employed'
  ) {
    errors.form = 'Choose employed or self-employed.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculatePhilippinesIncomeTax({
    employmentStatus: input.employmentStatus,
    monthlyIncome: monthly.value,
  });
  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: PhilippinesIncomeTaxResult = {
    employmentStatus: input.employmentStatus,
    monthlyIncome: computed.monthlyIncome,
    annualIncome: computed.annualIncome,
    sss: computed.sss,
    philHealth: computed.philHealth,
    pagIbig: computed.pagIbig,
    totalContributions: computed.totalContributions,
    taxableIncome: computed.taxableIncome,
    withholdingTax: computed.withholdingTax,
    netPayAfterTax: computed.netPayAfterTax,
    totalDeductions: computed.totalDeductions,
    netPayAfterDeductions: computed.netPayAfterDeductions,
    taxLabel: computed.taxLabel,
    contributionsSectionTitle: computed.contributionsSectionTitle,
    taxYearLabel: computed.taxYearLabel,
    formattedSss: formatPhp(computed.sss),
    formattedPhilHealth: formatPhp(computed.philHealth),
    formattedPagIbig: formatPhp(computed.pagIbig),
    formattedTotalContributions: formatPhp(computed.totalContributions),
    formattedTaxableIncome: formatPhp(computed.taxableIncome),
    formattedWithholdingTax: formatPhp(computed.withholdingTax),
    formattedNetPayAfterTax: formatPhp(computed.netPayAfterTax),
    formattedTotalDeductions: formatPhp(computed.totalDeductions),
    formattedNetPayAfterDeductions: formatPhp(computed.netPayAfterDeductions),
  };

  return { isValid: true, errors, result };
}
