export type CaliforniaTaxYear = 2025 | 2026;

export type CaliforniaFilingStatus =
  | 'single'
  | 'married-joint'
  | 'married-separate'
  | 'head-of-household';

export type CaliforniaIncomePeriod =
  | 'year'
  | 'month'
  | 'semimonthly'
  | 'biweekly'
  | 'week';

export type CaliforniaPayFrequency =
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly'
  | 'annually';

/**
 * Screenshot location default is Alameda County. Rates are BOE 2024–25
 * county-average statutory rates (% of assessed value), not the illustrative
 * 0.88% screenshot placeholder.
 */
export type CaliforniaCounty =
  | 'alameda'
  | 'contra-costa'
  | 'los-angeles'
  | 'orange'
  | 'riverside'
  | 'sacramento'
  | 'san-diego'
  | 'san-francisco'
  | 'santa-clara'
  | 'ventura';

/**
 * Screenshot-first California Tax inputs. Fixed USD — no FX.
 * AGI is treated as federal AGI and as California AGI when Schedule CA
 * adjustments are not entered.
 */
export interface CaliforniaTaxInput {
  agi: string;
  incomePeriod: CaliforniaIncomePeriod;
  payFrequency: CaliforniaPayFrequency;
  taxYear: CaliforniaTaxYear;
  filingStatus: CaliforniaFilingStatus;
  additionalDependents: string;
  itemizedDeductions: string;
  postTaxDeductions: string;
  assessedHomeValue: string;
  county: CaliforniaCounty;
  propertyTaxRate: string;
}

export interface CaliforniaTaxResult {
  taxYear: CaliforniaTaxYear;
  filingStatus: CaliforniaFilingStatus;
  payFrequency: CaliforniaPayFrequency;
  county: CaliforniaCounty;
  annualAgi: number;
  federalStandardDeduction: number;
  californiaStandardDeduction: number;
  itemizedDeductions: number;
  federalDeductionUsed: number;
  californiaDeductionUsed: number;
  federalTaxableIncome: number;
  californiaTaxableIncome: number;
  federalIncomeTax: number;
  californiaIncomeTaxBeforeCredits: number;
  californiaExemptionCredits: number;
  californiaMentalHealthTax: number;
  californiaIncomeTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  californiaSdiTax: number;
  payrollTaxes: number;
  totalIncomeAndPayrollTax: number;
  afterTaxIncome: number;
  postTaxDeductionsAnnual: number;
  netAfterPostTax: number;
  takeHomePerPayPeriod: number;
  payPeriodsPerYear: number;
  propertyTaxRatePercent: number;
  estimatedPropertyTax: number;
  formattedAnnualAgi: string;
  formattedFederalIncomeTax: string;
  formattedCaliforniaIncomeTax: string;
  formattedPayrollTaxes: string;
  formattedTotalIncomeAndPayrollTax: string;
  formattedTakeHomePerPayPeriod: string;
  formattedEstimatedPropertyTax: string;
  summaryText: string;
  disclosures: readonly string[];
}

export type CaliforniaTaxFieldErrors = {
  agi?: string;
  additionalDependents?: string;
  itemizedDeductions?: string;
  postTaxDeductions?: string;
  assessedHomeValue?: string;
  propertyTaxRate?: string;
  form?: string;
};

export function createDefaultInput(): CaliforniaTaxInput {
  return {
    agi: '',
    incomePeriod: 'year',
    payFrequency: 'weekly',
    taxYear: 2025,
    filingStatus: 'single',
    additionalDependents: '0',
    itemizedDeductions: '0',
    postTaxDeductions: '0',
    assessedHomeValue: '0',
    county: 'alameda',
    propertyTaxRate: '1.22',
  };
}

export function inputsEqual(a: CaliforniaTaxInput, b: CaliforniaTaxInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
