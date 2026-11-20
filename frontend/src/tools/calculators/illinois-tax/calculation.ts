import { countyBySlug } from './counties';
import {
  FEDERAL_OTHER_DEPENDENT_CREDIT,
  ILLINOIS_INCOME_TAX_RATE,
  federalOrdinaryBrackets,
  federalStandardDeduction,
  illinoisExemptionAllowance,
  incomePeriodToAnnualMultiplier,
  payPeriodsPerYear,
  taxFromBrackets,
} from './tax-parameters';
import type {
  IllinoisFilingStatus,
  IllinoisIncomePeriod,
  IllinoisPayFrequency,
  IllinoisTaxYear,
} from './types';
import type { IllinoisCountySlug } from './counties';

export function formatIllinoisMoney(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function annualizeAgi(
  amount: number,
  period: IllinoisIncomePeriod
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  const annual = amount * incomePeriodToAnnualMultiplier(period);
  return Number.isFinite(annual) ? annual : null;
}

export interface IllinoisTaxEngineInput {
  taxYear: IllinoisTaxYear;
  agiEntered: number;
  incomePeriod: IllinoisIncomePeriod;
  payFrequency: IllinoisPayFrequency;
  filingStatus: IllinoisFilingStatus;
  additionalDependents: number;
  itemizedDeductions: number;
  postTaxDeductions: number;
  assessedHomeValue: number;
  propertyTaxRatePercent: number;
  county: IllinoisCountySlug;
}

export interface IllinoisTaxEngineResult {
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
  countyLabel: string;
}

/**
 * Educational federal + Illinois income tax + county property estimate.
 * AGI is not treated as FICA wages (FICA omitted — disclosed).
 * IL base income ≈ federal AGI (Schedule M adjustments not modeled).
 */
export function calculateIllinoisTax(
  input: IllinoisTaxEngineInput
): IllinoisTaxEngineResult | null {
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

  const ilExemption = illinoisExemptionAllowance(
    input.taxYear,
    input.filingStatus,
    annualAgi,
    input.additionalDependents
  );
  const illinoisTaxableIncome = Math.max(0, annualAgi - ilExemption);
  const illinoisIncomeTax = illinoisTaxableIncome * ILLINOIS_INCOME_TAX_RATE;

  const combinedIncomeTax = federalIncomeTax + illinoisIncomeTax;
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
      illinoisIncomeTax,
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
    illinoisExemptionAllowance: ilExemption,
    illinoisTaxableIncome,
    illinoisIncomeTax,
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
  };
}
