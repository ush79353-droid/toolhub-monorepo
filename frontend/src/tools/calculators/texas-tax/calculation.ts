import {
  PROPERTY_RATE_SOURCE_YEAR,
  countyBySlug,
  type TexasCountySlug,
} from './counties';
import {
  FEDERAL_OTHER_DEPENDENT_CREDIT,
  TEXAS_STATE_INCOME_TAX,
  federalOrdinaryBrackets,
  federalStandardDeduction,
  incomePeriodToAnnualMultiplier,
  payPeriodsPerYear,
  taxFromBrackets,
} from './tax-parameters';
import type {
  TexasFilingStatus,
  TexasIncomePeriod,
  TexasPayFrequency,
  TexasTaxYear,
} from './types';

export function formatTexasMoney(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function annualizeAgi(
  amount: number,
  period: TexasIncomePeriod
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  const annual = amount * incomePeriodToAnnualMultiplier(period);
  return Number.isFinite(annual) ? annual : null;
}

export interface TexasTaxEngineInput {
  taxYear: TexasTaxYear;
  agiEntered: number;
  incomePeriod: TexasIncomePeriod;
  payFrequency: TexasPayFrequency;
  filingStatus: TexasFilingStatus;
  additionalDependents: number;
  itemizedDeductions: number;
  postTaxDeductions: number;
  assessedHomeValue: number;
  propertyTaxRatePercent: number;
  county: TexasCountySlug;
}

export interface TexasTaxEngineResult {
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
  countyLabel: string;
  propertyRateSourceYear: string;
}

/**
 * Educational federal income tax + Texas ($0 state income tax) + ACS county
 * property estimate. AGI is not treated as FICA wages (FICA omitted — disclosed).
 */
export function calculateTexasTax(
  input: TexasTaxEngineInput
): TexasTaxEngineResult | null {
  const annualAgi = annualizeAgi(input.agiEntered, input.incomePeriod);
  if (annualAgi === null) return null;
  if (
    !(input.additionalDependents >= 0) ||
    !Number.isInteger(input.additionalDependents)
  ) {
    return null;
  }
  if (
    input.itemizedDeductions < 0 ||
    input.postTaxDeductions < 0 ||
    input.assessedHomeValue < 0 ||
    input.propertyTaxRatePercent < 0
  ) {
    return null;
  }

  const county = countyBySlug(input.county);
  if (!county) return null;

  const fedStd = federalStandardDeduction(input.taxYear, input.filingStatus);
  const federalDeductionUsed = Math.max(fedStd, input.itemizedDeductions);
  const federalTaxableIncome = Math.max(0, annualAgi - federalDeductionUsed);
  const federalBeforeCredits = taxFromBrackets(
    federalTaxableIncome,
    federalOrdinaryBrackets(input.taxYear, input.filingStatus)
  );
  const federalIncomeTax = Math.max(
    0,
    federalBeforeCredits -
      input.additionalDependents * FEDERAL_OTHER_DEPENDENT_CREDIT
  );

  const texasStateIncomeTax = TEXAS_STATE_INCOME_TAX;
  const combinedIncomeTax = federalIncomeTax + texasStateIncomeTax;
  const periods = payPeriodsPerYear(input.payFrequency);
  const incomeTaxPerPayPeriod = periods > 0 ? combinedIncomeTax / periods : NaN;
  const afterIncomeTax = annualAgi - combinedIncomeTax;
  const postTaxDeductionsAnnual = input.postTaxDeductions;
  const netAfterPostTax = afterIncomeTax - postTaxDeductionsAnnual;
  const takeHomePerPayPeriod = periods > 0 ? netAfterPostTax / periods : NaN;
  const estimatedPropertyTax =
    input.assessedHomeValue * (input.propertyTaxRatePercent / 100);

  if (
    ![
      federalIncomeTax,
      texasStateIncomeTax,
      takeHomePerPayPeriod,
      estimatedPropertyTax,
    ].every((n) => Number.isFinite(n))
  ) {
    return null;
  }

  return {
    annualAgi,
    federalDeductionUsed,
    federalTaxableIncome,
    federalIncomeTax,
    texasStateIncomeTax,
    combinedIncomeTax,
    incomeTaxPerPayPeriod,
    afterIncomeTax,
    postTaxDeductionsAnnual,
    netAfterPostTax,
    takeHomePerPayPeriod,
    payPeriodsPerYear: periods,
    propertyTaxRatePercent: input.propertyTaxRatePercent,
    estimatedPropertyTax,
    countyLabel: county.label,
    propertyRateSourceYear: PROPERTY_RATE_SOURCE_YEAR,
  };
}
