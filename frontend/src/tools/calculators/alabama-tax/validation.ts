import {
  calculateAlabamaTax,
  formatAlabamaMoney,
} from './calculation';
import type {
  AlabamaTaxFieldErrors,
  AlabamaTaxInput,
  AlabamaTaxResult,
} from './types';

export interface AlabamaTaxValidation {
  isValid: boolean;
  errors: AlabamaTaxFieldErrors;
  result: AlabamaTaxResult | null;
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

export function validateAlabamaTaxInput(
  input: AlabamaTaxInput
): AlabamaTaxValidation {
  const errors: AlabamaTaxFieldErrors = {};

  const agi = parseNumber(input.agi);
  const dependents = parseNonNegativeInteger(input.additionalDependents);
  const itemized = parseNumber(input.itemizedDeductions);
  const postTax = parseNumber(input.postTaxDeductions);

  if (agi.blank) {
    errors.agi = 'Enter adjusted gross income.';
  } else if (agi.invalid || agi.value === null) {
    errors.agi = 'Enter a valid AGI amount.';
  } else if (agi.value < 0) {
    errors.agi = 'AGI cannot be negative.';
  }

  if (dependents.blank) {
    errors.additionalDependents = 'Enter number of additional dependents (use 0 if none).';
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

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const engine = calculateAlabamaTax({
    taxYear: input.taxYear,
    agiEntered: agi.value!,
    incomePeriod: input.incomePeriod,
    payFrequency: input.payFrequency,
    filingStatus: input.filingStatus,
    jurisdiction: input.jurisdiction,
    additionalDependents: dependents.value!,
    itemizedDeductions: itemized.value!,
    postTaxDeductions: postTax.value!,
  });

  if (!engine) {
    errors.form = 'This combination does not produce a finite Alabama tax estimate.';
    return { isValid: false, errors, result: null };
  }

  const disclosures = [
    `TY${input.taxYear}: ADOR Form 40 brackets/exemptions and 2025 standard-deduction chart (enacted schedules; educational estimate).`,
    'Federal income tax deduction (Form 40 line 12) omitted — federal tax is not an input.',
    'Local occupational tax uses annualized AGI as an earned-income proxy for work performed in the selected jurisdiction.',
    'FICA and other payroll taxes are not included.',
  ] as const;

  const result: AlabamaTaxResult = {
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    jurisdiction: input.jurisdiction,
    payFrequency: input.payFrequency,
    annualAgi: engine.annualAgi,
    standardDeduction: engine.standardDeduction,
    itemizedDeductions: engine.itemizedDeductions,
    deductionUsed: engine.deductionUsed,
    deductionType: engine.deductionType,
    personalExemption: engine.personalExemption,
    dependentExemptionPer: engine.dependentExemptionPer,
    dependentExemptionTotal: engine.dependentExemptionTotal,
    taxableIncome: engine.taxableIncome,
    stateIncomeTax: engine.stateIncomeTax,
    localOccupationalRate: engine.localOccupationalRate,
    localOccupationalTax: engine.localOccupationalTax,
    totalTax: engine.totalTax,
    afterTaxIncome: engine.afterTaxIncome,
    postTaxDeductionsAnnual: engine.postTaxDeductionsAnnual,
    netAfterPostTax: engine.netAfterPostTax,
    takeHomePerPayPeriod: engine.takeHomePerPayPeriod,
    payPeriodsPerYear: engine.payPeriodsPerYear,
    formattedAnnualAgi: formatAlabamaMoney(engine.annualAgi),
    formattedTaxableIncome: formatAlabamaMoney(engine.taxableIncome),
    formattedStateIncomeTax: formatAlabamaMoney(engine.stateIncomeTax),
    formattedLocalOccupationalTax: formatAlabamaMoney(engine.localOccupationalTax),
    formattedTotalTax: formatAlabamaMoney(engine.totalTax),
    formattedAfterTaxIncome: formatAlabamaMoney(engine.afterTaxIncome),
    formattedNetAfterPostTax: formatAlabamaMoney(engine.netAfterPostTax),
    formattedTakeHomePerPayPeriod: formatAlabamaMoney(engine.takeHomePerPayPeriod),
    summaryText: `Alabama estimate: taxable $${formatAlabamaMoney(engine.taxableIncome)}; state tax $${formatAlabamaMoney(engine.stateIncomeTax)}; local $${formatAlabamaMoney(engine.localOccupationalTax)} (${(engine.localOccupationalRate * 100).toFixed(0)}%); ${engine.deductionType} deduction $${formatAlabamaMoney(engine.deductionUsed)}.`,
    disclosures,
  };

  return { isValid: true, errors: {}, result };
}
