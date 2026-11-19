export type AlabamaTaxYear = 2025 | 2026;

export type AlabamaFilingStatus =
  | 'single'
  | 'married-joint'
  | 'married-separate'
  | 'head-of-family';

export type AlabamaIncomePeriod =
  | 'year'
  | 'month'
  | 'semimonthly'
  | 'biweekly'
  | 'week';

export type AlabamaPayFrequency =
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly'
  | 'annually';

/** Screenshot jurisdictions with verified occupational tax rates. */
export type AlabamaJurisdiction =
  | 'bessemer'
  | 'birmingham'
  | 'gadsden'
  | 'macon-county';

/**
 * Screenshot-first Alabama Tax inputs. Fixed USD — no FX.
 * AGI is treated as Alabama AGI (federal AGI proxy when Alabama adjustments
 * are not entered). Federal income tax deduction (Form 40 line 12) is omitted
 * because federal tax is not a screenshot input.
 */
export interface AlabamaTaxInput {
  agi: string;
  incomePeriod: AlabamaIncomePeriod;
  payFrequency: AlabamaPayFrequency;
  taxYear: AlabamaTaxYear;
  filingStatus: AlabamaFilingStatus;
  jurisdiction: AlabamaJurisdiction;
  additionalDependents: string;
  itemizedDeductions: string;
  postTaxDeductions: string;
}

export interface AlabamaTaxResult {
  taxYear: AlabamaTaxYear;
  filingStatus: AlabamaFilingStatus;
  jurisdiction: AlabamaJurisdiction;
  payFrequency: AlabamaPayFrequency;
  annualAgi: number;
  standardDeduction: number;
  itemizedDeductions: number;
  deductionUsed: number;
  deductionType: 'standard' | 'itemized';
  personalExemption: number;
  dependentExemptionPer: number;
  dependentExemptionTotal: number;
  taxableIncome: number;
  stateIncomeTax: number;
  localOccupationalRate: number;
  localOccupationalTax: number;
  totalTax: number;
  afterTaxIncome: number;
  postTaxDeductionsAnnual: number;
  netAfterPostTax: number;
  takeHomePerPayPeriod: number;
  payPeriodsPerYear: number;
  formattedAnnualAgi: string;
  formattedTaxableIncome: string;
  formattedStateIncomeTax: string;
  formattedLocalOccupationalTax: string;
  formattedTotalTax: string;
  formattedAfterTaxIncome: string;
  formattedNetAfterPostTax: string;
  formattedTakeHomePerPayPeriod: string;
  summaryText: string;
  disclosures: readonly string[];
}

export type AlabamaTaxFieldErrors = {
  agi?: string;
  additionalDependents?: string;
  itemizedDeductions?: string;
  postTaxDeductions?: string;
  form?: string;
};

export function createDefaultInput(): AlabamaTaxInput {
  return {
    agi: '',
    incomePeriod: 'year',
    payFrequency: 'weekly',
    taxYear: 2026,
    filingStatus: 'single',
    jurisdiction: 'bessemer',
    additionalDependents: '0',
    itemizedDeductions: '0',
    postTaxDeductions: '0',
  };
}

export function inputsEqual(a: AlabamaTaxInput, b: AlabamaTaxInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
