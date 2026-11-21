import {
  calculateIllinoisTax,
  formatIllinoisMoney,
} from './calculation';
import { countyBySlug } from './counties';
import type {
  IllinoisTaxFieldErrors,
  IllinoisTaxInput,
  IllinoisTaxResult,
} from './types';

export interface IllinoisTaxValidation {
  isValid: boolean;
  errors: IllinoisTaxFieldErrors;
  result: IllinoisTaxResult | null;
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

export function validateIllinoisTaxInput(
  input: IllinoisTaxInput
): IllinoisTaxValidation {
  const errors: IllinoisTaxFieldErrors = {};
  const agi = parseNumber(input.agi);
  const dependents = parseNonNegativeInteger(input.additionalDependents);
  const itemized = parseNumber(input.itemizedDeductions);
  const postTax = parseNumber(input.postTaxDeductions);
  const assessed = parseNumber(input.assessedHomeValue);
  const rate = parseNumber(input.propertyTaxRate);

  if (agi.blank) errors.agi = 'Enter adjusted gross income.';
  else if (agi.invalid || agi.value === null) errors.agi = 'Enter a valid AGI amount.';
  else if (agi.value < 0) errors.agi = 'AGI cannot be negative.';

  if (dependents.blank) {
    errors.additionalDependents =
      'Enter number of additional dependents (use 0 if none).';
  } else if (dependents.invalid || dependents.value === null) {
    errors.additionalDependents =
      'Enter a whole number of additional dependents (0 or more).';
  }

  if (itemized.blank) errors.itemizedDeductions = 'Enter itemized deductions (use 0 if none).';
  else if (itemized.invalid || itemized.value === null) {
    errors.itemizedDeductions = 'Enter a valid itemized deductions amount.';
  } else if (itemized.value < 0) {
    errors.itemizedDeductions = 'Itemized deductions cannot be negative.';
  }

  if (postTax.blank) errors.postTaxDeductions = 'Enter post-tax deductions (use 0 if none).';
  else if (postTax.invalid || postTax.value === null) {
    errors.postTaxDeductions = 'Enter a valid post-tax deductions amount.';
  } else if (postTax.value < 0) {
    errors.postTaxDeductions = 'Post-tax deductions cannot be negative.';
  }

  if (assessed.blank) errors.assessedHomeValue = 'Enter assessed home value (use 0 if none).';
  else if (assessed.invalid || assessed.value === null) {
    errors.assessedHomeValue = 'Enter a valid home value.';
  } else if (assessed.value < 0) {
    errors.assessedHomeValue = 'Home value cannot be negative.';
  }

  if (rate.blank) errors.propertyTaxRate = 'Enter an applied property tax rate.';
  else if (rate.invalid || rate.value === null) {
    errors.propertyTaxRate = 'Enter a valid property tax rate percent.';
  } else if (rate.value < 0) {
    errors.propertyTaxRate = 'Property tax rate cannot be negative.';
  }

  if (!countyBySlug(input.county)) {
    errors.form = 'Select a valid Illinois county.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const engine = calculateIllinoisTax({
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
    county: input.county,
  });

  if (!engine) {
    errors.form = 'This combination does not produce a finite Illinois tax estimate.';
    return { isValid: false, errors, result: null };
  }

  const disclosures = [
    `TY${input.taxYear}: federal ordinary brackets (Rev. Proc. 2024-40 / 2025-32); Illinois flat 4.95% (IDOR) with personal exemption $${input.taxYear === 2025 ? '2,850' : '2,925'} (zero above AGI cutoff).`,
    'Illinois base income treated as federal AGI (Schedule M adjustments not modeled).',
    'FICA/payroll withholding omitted — AGI is not assumed to be FICA wages. After-income-tax is not a full paycheck.',
    `Property tax uses ACS 2024 effective rate × entered home value for ${engine.countyLabel} (market-value proxy; Illinois EAV/TRA bills differ). Screenshot 1.67% is not used as Adams County’s verified rate.`,
    'Educational estimate only — not Form 1040, IL-1040, or a tax bill.',
  ] as const;

  const result: IllinoisTaxResult = {
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    payFrequency: input.payFrequency,
    county: input.county,
    countyLabel: engine.countyLabel,
    annualAgi: engine.annualAgi,
    federalDeductionUsed: engine.federalDeductionUsed,
    federalTaxableIncome: engine.federalTaxableIncome,
    federalIncomeTax: engine.federalIncomeTax,
    illinoisExemptionAllowance: engine.illinoisExemptionAllowance,
    illinoisTaxableIncome: engine.illinoisTaxableIncome,
    illinoisIncomeTax: engine.illinoisIncomeTax,
    combinedIncomeTax: engine.combinedIncomeTax,
    incomeTaxPerPayPeriod: engine.incomeTaxPerPayPeriod,
    afterIncomeTax: engine.afterIncomeTax,
    postTaxDeductionsAnnual: engine.postTaxDeductionsAnnual,
    netAfterPostTax: engine.netAfterPostTax,
    takeHomePerPayPeriod: engine.takeHomePerPayPeriod,
    payPeriodsPerYear: engine.payPeriodsPerYear,
    propertyTaxRatePercent: engine.propertyTaxRatePercent,
    estimatedPropertyTax: engine.estimatedPropertyTax,
    propertyRateSourceYear: 'ACS 2024',
    formattedAnnualAgi: formatIllinoisMoney(engine.annualAgi),
    formattedFederalIncomeTax: formatIllinoisMoney(engine.federalIncomeTax),
    formattedIllinoisIncomeTax: formatIllinoisMoney(engine.illinoisIncomeTax),
    formattedCombinedIncomeTax: formatIllinoisMoney(engine.combinedIncomeTax),
    formattedIncomeTaxPerPayPeriod: formatIllinoisMoney(
      engine.incomeTaxPerPayPeriod
    ),
    formattedAfterIncomeTax: formatIllinoisMoney(engine.afterIncomeTax),
    formattedTakeHomePerPayPeriod: formatIllinoisMoney(
      engine.takeHomePerPayPeriod
    ),
    formattedEstimatedPropertyTax: formatIllinoisMoney(
      engine.estimatedPropertyTax
    ),
    summaryText: `IL estimate: federal $${formatIllinoisMoney(engine.federalIncomeTax)}; Illinois $${formatIllinoisMoney(engine.illinoisIncomeTax)}; property $${formatIllinoisMoney(engine.estimatedPropertyTax)} (${engine.propertyTaxRatePercent}% × home value, ACS 2024).`,
    disclosures,
  };

  return { isValid: true, errors: {}, result };
}
