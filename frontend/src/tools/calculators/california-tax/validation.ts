import {
  calculateCaliforniaTax,
  formatCaliforniaMoney,
} from './calculation';
import { COUNTY_PROPERTY_TAX_RATES } from './tax-parameters';
import type {
  CaliforniaTaxFieldErrors,
  CaliforniaTaxInput,
  CaliforniaTaxResult,
} from './types';

export interface CaliforniaTaxValidation {
  isValid: boolean;
  errors: CaliforniaTaxFieldErrors;
  result: CaliforniaTaxResult | null;
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

function parseNonNegativeInteger(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const parsed = parseNumber(raw);
  if (parsed.blank || parsed.invalid || parsed.value === null) return parsed;
  if (!Number.isInteger(parsed.value) || parsed.value < 0) {
    return { value: null, blank: false, invalid: true };
  }
  return parsed;
}

export function validateCaliforniaTaxInput(
  input: CaliforniaTaxInput
): CaliforniaTaxValidation {
  const errors: CaliforniaTaxFieldErrors = {};

  const agi = parseNumber(input.agi);
  const dependents = parseNonNegativeInteger(input.additionalDependents);
  const itemized = parseNumber(input.itemizedDeductions);
  const postTax = parseNumber(input.postTaxDeductions);
  const assessed = parseNumber(input.assessedHomeValue);
  const rate = parseNumber(input.propertyTaxRate);

  if (agi.blank) {
    errors.agi = 'Enter adjusted gross income.';
  } else if (agi.invalid || agi.value === null) {
    errors.agi = 'Enter a valid AGI amount.';
  } else if (agi.value < 0) {
    errors.agi = 'AGI cannot be negative.';
  }

  if (dependents.blank) {
    errors.additionalDependents =
      'Enter number of additional dependents (use 0 if none).';
  } else if (dependents.invalid || dependents.value === null) {
    errors.additionalDependents =
      'Enter a whole number of additional dependents (0 or more).';
  }

  if (itemized.blank) {
    errors.itemizedDeductions = 'Enter itemized deductions (use 0 if none).';
  } else if (itemized.invalid || itemized.value === null) {
    errors.itemizedDeductions = 'Enter a valid itemized deductions amount.';
  } else if (itemized.value < 0) {
    errors.itemizedDeductions = 'Itemized deductions cannot be negative.';
  }

  if (postTax.blank) {
    errors.postTaxDeductions = 'Enter post-tax deductions (use 0 if none).';
  } else if (postTax.invalid || postTax.value === null) {
    errors.postTaxDeductions = 'Enter a valid post-tax deductions amount.';
  } else if (postTax.value < 0) {
    errors.postTaxDeductions = 'Post-tax deductions cannot be negative.';
  }

  if (assessed.blank) {
    errors.assessedHomeValue = 'Enter assessed home value (use 0 if none).';
  } else if (assessed.invalid || assessed.value === null) {
    errors.assessedHomeValue = 'Enter a valid assessed home value.';
  } else if (assessed.value < 0) {
    errors.assessedHomeValue = 'Assessed home value cannot be negative.';
  }

  if (rate.blank) {
    errors.propertyTaxRate = 'Enter an applied property tax rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.propertyTaxRate = 'Enter a valid property tax rate percent.';
  } else if (rate.value < 0) {
    errors.propertyTaxRate = 'Property tax rate cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const engine = calculateCaliforniaTax({
    taxYear: input.taxYear,
    agiEntered: agi.value!,
    incomePeriod: input.incomePeriod,
    payFrequency: input.payFrequency,
    filingStatus: input.filingStatus,
    additionalDependents: dependents.value!,
    itemizedDeductions: itemized.value!,
    postTaxDeductions: postTax.value!,
    assessedHomeValue: assessed.value!,
    propertyTaxRatePercent: rate.value!,
  });

  if (!engine) {
    errors.form =
      'This combination does not produce a finite California tax estimate.';
    return { isValid: false, errors, result: null };
  }

  const countyLabel = COUNTY_PROPERTY_TAX_RATES[input.county].label;
  const disclosures = [
    `TY${input.taxYear}: federal ordinary brackets/std. deduction (Rev. Proc. 2024-40 / 2025-32); CA Form 540 2025 rate schedules & exemption credits (TY2026 CA uses 2025 FTB schedules pending indexing).`,
    'Federal AGI used as California AGI — Schedule CA adjustments not modeled.',
    'Employee FICA (SSA wage base) + Additional Medicare + EDD SDI; AGI treated as wage proxy.',
    `Property tax = assessed value × applied rate%; default rates are BOE 2024–25 county averages for ${countyLabel} (TRA rates vary; not the illustrative 0.88% screenshot placeholder).`,
    'Educational estimate only — not a substitute for Form 1040, Form 540, or a property tax bill.',
  ] as const;

  const result: CaliforniaTaxResult = {
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    payFrequency: input.payFrequency,
    county: input.county,
    annualAgi: engine.annualAgi,
    federalStandardDeduction: engine.federalStandardDeduction,
    californiaStandardDeduction: engine.californiaStandardDeduction,
    itemizedDeductions: engine.itemizedDeductions,
    federalDeductionUsed: engine.federalDeductionUsed,
    californiaDeductionUsed: engine.californiaDeductionUsed,
    federalTaxableIncome: engine.federalTaxableIncome,
    californiaTaxableIncome: engine.californiaTaxableIncome,
    federalIncomeTax: engine.federalIncomeTax,
    californiaIncomeTaxBeforeCredits: engine.californiaIncomeTaxBeforeCredits,
    californiaExemptionCredits: engine.californiaExemptionCredits,
    californiaMentalHealthTax: engine.californiaMentalHealthTax,
    californiaIncomeTax: engine.californiaIncomeTax,
    socialSecurityTax: engine.socialSecurityTax,
    medicareTax: engine.medicareTax,
    additionalMedicareTax: engine.additionalMedicareTax,
    californiaSdiTax: engine.californiaSdiTax,
    payrollTaxes: engine.payrollTaxes,
    totalIncomeAndPayrollTax: engine.totalIncomeAndPayrollTax,
    afterTaxIncome: engine.afterTaxIncome,
    postTaxDeductionsAnnual: engine.postTaxDeductionsAnnual,
    netAfterPostTax: engine.netAfterPostTax,
    takeHomePerPayPeriod: engine.takeHomePerPayPeriod,
    payPeriodsPerYear: engine.payPeriodsPerYear,
    propertyTaxRatePercent: engine.propertyTaxRatePercent,
    estimatedPropertyTax: engine.estimatedPropertyTax,
    formattedAnnualAgi: formatCaliforniaMoney(engine.annualAgi),
    formattedFederalIncomeTax: formatCaliforniaMoney(engine.federalIncomeTax),
    formattedCaliforniaIncomeTax: formatCaliforniaMoney(
      engine.californiaIncomeTax
    ),
    formattedPayrollTaxes: formatCaliforniaMoney(engine.payrollTaxes),
    formattedTotalIncomeAndPayrollTax: formatCaliforniaMoney(
      engine.totalIncomeAndPayrollTax
    ),
    formattedTakeHomePerPayPeriod: formatCaliforniaMoney(
      engine.takeHomePerPayPeriod
    ),
    formattedEstimatedPropertyTax: formatCaliforniaMoney(
      engine.estimatedPropertyTax
    ),
    summaryText: `CA estimate: federal tax $${formatCaliforniaMoney(engine.federalIncomeTax)}; CA income tax $${formatCaliforniaMoney(engine.californiaIncomeTax)}; payroll $${formatCaliforniaMoney(engine.payrollTaxes)}; property $${formatCaliforniaMoney(engine.estimatedPropertyTax)} (${engine.propertyTaxRatePercent}% × assessed).`,
    disclosures,
  };

  return { isValid: true, errors: {}, result };
}
