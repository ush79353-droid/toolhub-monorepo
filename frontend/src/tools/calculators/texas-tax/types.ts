import {
  DEFAULT_TEXAS_COUNTY,
  countyBySlug,
  type TexasCountySlug,
} from './counties';

export type TexasTaxYear = 2025 | 2026;

export type TexasFilingStatus =
  | 'single'
  | 'married-joint'
  | 'married-separate'
  | 'head-of-household'
  | 'qualifying-surviving-spouse';

export type TexasIncomePeriod =
  | 'year'
  | 'month'
  | 'semimonthly'
  | 'biweekly'
  | 'week';

export type TexasPayFrequency =
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly'
  | 'annually';

export interface TexasTaxInput {
  agi: string;
  incomePeriod: TexasIncomePeriod;
  payFrequency: TexasPayFrequency;
  taxYear: TexasTaxYear;
  filingStatus: TexasFilingStatus;
  additionalDependents: string;
  itemizedDeductions: string;
  postTaxDeductions: string;
  assessedHomeValue: string;
  county: TexasCountySlug;
  propertyTaxRate: string;
}

export interface TexasTaxResult {
  taxYear: TexasTaxYear;
  filingStatus: TexasFilingStatus;
  payFrequency: TexasPayFrequency;
  county: TexasCountySlug;
  countyLabel: string;
  annualAgi: number;
  federalDeductionUsed: number;
  federalTaxableIncome: number;
  federalIncomeTax: number;
  texasStateIncomeTax: number;
  combinedIncomeTax: number;
  incomeTaxPerPayPeriod: number;
  afterIncomeTax: number;
  postTaxDeductionsAnnual: number;
  netAfterPostTax: number;
  takeHomePerPayPeriod: number;
  payPeriodsPerYear: number;
  propertyTaxRatePercent: number;
  estimatedPropertyTax: number;
  propertyRateSourceYear: string;
  formattedAnnualAgi: string;
  formattedFederalIncomeTax: string;
  formattedTexasStateIncomeTax: string;
  formattedCombinedIncomeTax: string;
  formattedIncomeTaxPerPayPeriod: string;
  formattedAfterIncomeTax: string;
  formattedTakeHomePerPayPeriod: string;
  formattedEstimatedPropertyTax: string;
  summaryText: string;
  disclosures: readonly string[];
}

export type TexasTaxFieldErrors = {
  agi?: string;
  additionalDependents?: string;
  itemizedDeductions?: string;
  postTaxDeductions?: string;
  assessedHomeValue?: string;
  propertyTaxRate?: string;
  form?: string;
};

export function createDefaultInput(): TexasTaxInput {
  const county = countyBySlug(DEFAULT_TEXAS_COUNTY)!;
  return {
    agi: '',
    incomePeriod: 'year',
    payFrequency: 'weekly',
    taxYear: 2026,
    filingStatus: 'single',
    additionalDependents: '0',
    itemizedDeductions: '0',
    postTaxDeductions: '0',
    assessedHomeValue: '0',
    county: DEFAULT_TEXAS_COUNTY,
    propertyTaxRate: String(county.ratePercent),
  };
}

export function inputsEqual(a: TexasTaxInput, b: TexasTaxInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
