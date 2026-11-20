import type { IllinoisCountySlug } from './counties';

export type IllinoisTaxYear = 2025 | 2026;

export type IllinoisFilingStatus =
  | 'single'
  | 'married-joint'
  | 'married-separate'
  | 'head-of-household'
  | 'qualifying-surviving-spouse';

export type IllinoisIncomePeriod =
  | 'year'
  | 'month'
  | 'semimonthly'
  | 'biweekly'
  | 'week';

export type IllinoisPayFrequency =
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly'
  | 'annually';

export interface IllinoisTaxInput {
  agi: string;
  incomePeriod: IllinoisIncomePeriod;
  payFrequency: IllinoisPayFrequency;
  taxYear: IllinoisTaxYear;
  filingStatus: IllinoisFilingStatus;
  additionalDependents: string;
  itemizedDeductions: string;
  postTaxDeductions: string;
  assessedHomeValue: string;
  county: IllinoisCountySlug;
  propertyTaxRate: string;
}

export interface IllinoisTaxResult {
  taxYear: IllinoisTaxYear;
  filingStatus: IllinoisFilingStatus;
  payFrequency: IllinoisPayFrequency;
  county: IllinoisCountySlug;
  countyLabel: string;
  annualAgi: number;
  federalDeductionUsed: number;
  federalTaxableIncome: number;
  federalIncomeTax: number;
  illinoisExemptionAllowance: number;
  illinoisTaxableIncome: number;
  illinoisIncomeTax: number;
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
  formattedIllinoisIncomeTax: string;
  formattedCombinedIncomeTax: string;
  formattedIncomeTaxPerPayPeriod: string;
  formattedAfterIncomeTax: string;
  formattedTakeHomePerPayPeriod: string;
  formattedEstimatedPropertyTax: string;
  summaryText: string;
  disclosures: readonly string[];
}

export type IllinoisTaxFieldErrors = {
  agi?: string;
  additionalDependents?: string;
  itemizedDeductions?: string;
  postTaxDeductions?: string;
  assessedHomeValue?: string;
  propertyTaxRate?: string;
  form?: string;
};

export function createDefaultInput(): IllinoisTaxInput {
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
    county: 'adams',
    propertyTaxRate: '1.582',
  };
}

export function inputsEqual(a: IllinoisTaxInput, b: IllinoisTaxInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
