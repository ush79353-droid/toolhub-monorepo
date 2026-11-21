import {
  calculateNewYorkTax,
  formatEffectiveRate,
  formatNewYorkMoney,
} from './calculation';
import type {
  NewYorkTaxFieldErrors,
  NewYorkTaxInput,
  NewYorkTaxResult,
} from './types';

export interface NewYorkTaxValidation {
  isValid: boolean;
  errors: NewYorkTaxFieldErrors;
  result: NewYorkTaxResult | null;
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

export function validateNewYorkTaxInput(
  input: NewYorkTaxInput
): NewYorkTaxValidation {
  const errors: NewYorkTaxFieldErrors = {};

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

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const engine = calculateNewYorkTax({
    taxYear: input.taxYear,
    agiEntered: agi.value!,
    incomePeriod: input.incomePeriod,
    payFrequency: input.payFrequency,
    filingStatus: input.filingStatus,
    nycResident: input.nycResident,
    additionalDependents: dependents.value!,
    itemizedDeductions: itemized.value!,
    postTaxDeductions: postTax.value!,
  });

  if (!engine) {
    errors.form =
      'This combination does not produce a finite New York tax estimate.';
    return { isValid: false, errors, result: null };
  }

  const disclosures = [
    'TY2025 only: federal ordinary brackets & standard deduction per Rev. Proc. 2024-40; NY State rate schedules Tax Law §601 (years before 2026); NYC rates per IT-201 / IT-360.1.',
    'AGI is not wages; we use your AGI entry as both federal and New York AGI. IT-225 subtraction/addition modifiers and federal Schedule B are not modeled.',
    'NY taxable income = max(0, AGI − max(NY standard deduction, itemized) − $1,000 × dependents). NYC taxable income uses the same amount in this estimator.',
    'Federal taxable income = max(0, AGI − max(federal standard deduction, itemized)). Federal child/other dependent credits are not applied without eligibility details.',
    'No FICA, Medicare, SDI, or local taxes outside NYC modeled. Educational estimate only; not a substitute for Form 1040, IT-201, or IT-360.',
  ] as const;

  const nycLabel = input.nycResident ? 'NYC' : 'NYC (non-resident)';

  const result: NewYorkTaxResult = {
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    payFrequency: input.payFrequency,
    nycResident: input.nycResident,
    annualAgi: engine.annualAgi,
    federalStandardDeduction: engine.federalStandardDeduction,
    newYorkStandardDeduction: engine.newYorkStandardDeduction,
    itemizedDeductions: engine.itemizedDeductions,
    federalDeductionUsed: engine.federalDeductionUsed,
    newYorkDeductionUsed: engine.newYorkDeductionUsed,
    dependentExemptionTotal: engine.dependentExemptionTotal,
    federalTaxableIncome: engine.federalTaxableIncome,
    newYorkTaxableIncome: engine.newYorkTaxableIncome,
    nycTaxableIncome: engine.nycTaxableIncome,
    federalIncomeTax: engine.federalIncomeTax,
    newYorkStateTax: engine.newYorkStateTax,
    nycIncomeTax: engine.nycIncomeTax,
    totalIncomeTax: engine.totalIncomeTax,
    effectiveTaxRatePercent: engine.effectiveTaxRatePercent,
    afterTaxIncome: engine.afterTaxIncome,
    postTaxDeductionsAnnual: engine.postTaxDeductionsAnnual,
    netAfterPostTax: engine.netAfterPostTax,
    takeHomePerPayPeriod: engine.takeHomePerPayPeriod,
    totalTaxPerPayPeriod: engine.totalTaxPerPayPeriod,
    payPeriodsPerYear: engine.payPeriodsPerYear,
    formattedAnnualAgi: formatNewYorkMoney(engine.annualAgi),
    formattedFederalIncomeTax: formatNewYorkMoney(engine.federalIncomeTax),
    formattedNewYorkStateTax: formatNewYorkMoney(engine.newYorkStateTax),
    formattedNycIncomeTax: formatNewYorkMoney(engine.nycIncomeTax),
    formattedTotalIncomeTax: formatNewYorkMoney(engine.totalIncomeTax),
    formattedEffectiveTaxRate: formatEffectiveRate(engine.effectiveTaxRatePercent),
    formattedTotalTaxPerPayPeriod: formatNewYorkMoney(engine.totalTaxPerPayPeriod),
    formattedTakeHomePerPayPeriod: formatNewYorkMoney(engine.takeHomePerPayPeriod),
    summaryText: `NY estimate: federal $${formatNewYorkMoney(engine.federalIncomeTax)}; NY State $${formatNewYorkMoney(engine.newYorkStateTax)}; ${nycLabel} $${formatNewYorkMoney(engine.nycIncomeTax)}; total $${formatNewYorkMoney(engine.totalIncomeTax)} (${formatEffectiveRate(engine.effectiveTaxRatePercent)}% effective).`,
    disclosures,
  };

  return { isValid: true, errors: {}, result };
}