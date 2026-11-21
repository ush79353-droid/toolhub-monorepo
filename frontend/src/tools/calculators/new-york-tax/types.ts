export type NewYorkTaxYear = 2025;

export type NewYorkFilingStatus =
  | 'single'
  | 'married-joint'
  | 'married-separate'
  | 'head-of-household'
  | 'qualifying-surviving-spouse';

export type NewYorkIncomePeriod =
  | 'year'
  | 'month'
  | 'semimonthly'
  | 'biweekly'
  | 'week';

export type NewYorkPayFrequency =
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly';

/**
 * Screenshot-first New York Tax inputs. Fixed USD — no FX.
 * AGI is treated as federal AGI and as New York AGI when IT-225 / Schedule B
 * adjustments are not entered.
 */
export interface NewYorkTaxInput {
  agi: string;
  incomePeriod: NewYorkIncomePeriod;
  payFrequency: NewYorkPayFrequency;
  taxYear: NewYorkTaxYear;
  filingStatus: NewYorkFilingStatus;
  nycResident: boolean;
  additionalDependents: string;
  itemizedDeductions: string;
  postTaxDeductions: string;
}

export interface NewYorkTaxResult {
  taxYear: NewYorkTaxYear;
  filingStatus: NewYorkFilingStatus;
  payFrequency: NewYorkPayFrequency;
  nycResident: boolean;
  annualAgi: number;
  federalStandardDeduction: number;
  newYorkStandardDeduction: number;
  itemizedDeductions: number;
  federalDeductionUsed: number;
  newYorkDeductionUsed: number;
  dependentExemptionTotal: number;
  federalTaxableIncome: number;
  newYorkTaxableIncome: number;
  nycTaxableIncome: number;
  federalIncomeTax: number;
  newYorkStateTax: number;
  nycIncomeTax: number;
  totalIncomeTax: number;
  effectiveTaxRatePercent: number;
  afterTaxIncome: number;
  postTaxDeductionsAnnual: number;
  netAfterPostTax: number;
  takeHomePerPayPeriod: number;
  totalTaxPerPayPeriod: number;
  payPeriodsPerYear: number;
  formattedAnnualAgi: string;
  formattedFederalIncomeTax: string;
  formattedNewYorkStateTax: string;
  formattedNycIncomeTax: string;
  formattedTotalIncomeTax: string;
  formattedEffectiveTaxRate: string;
  formattedTotalTaxPerPayPeriod: string;
  formattedTakeHomePerPayPeriod: string;
  summaryText: string;
  disclosures: readonly string[];
}

export type NewYorkTaxFieldErrors = {
  agi?: string;
  additionalDependents?: string;
  itemizedDeductions?: string;
  postTaxDeductions?: string;
  form?: string;
};

export function createDefaultInput(): NewYorkTaxInput {
  return {
    agi: '',
    incomePeriod: 'year',
    payFrequency: 'weekly',
    taxYear: 2025,
    filingStatus: 'single',
    nycResident: true,
    additionalDependents: '0',
    itemizedDeductions: '0',
    postTaxDeductions: '0',
  };
}

export function inputsEqual(a: NewYorkTaxInput, b: NewYorkTaxInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}