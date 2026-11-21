import {
  federalOrdinaryBrackets,
  federalStandardDeduction,
  incomePeriodToAnnualMultiplier,
  NEW_YORK_DEPENDENT_EXEMPTION,
  newYorkStandardDeduction,
  newYorkStateBrackets,
  nycBrackets,
  payPeriodsPerYear,
  taxFromBrackets,
} from './tax-parameters';
import type {
  NewYorkIncomePeriod,
  NewYorkFilingStatus,
  NewYorkPayFrequency,
  NewYorkTaxYear,
} from './types';

export function formatNewYorkMoney(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatEffectiveRate(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent);
}

export function annualizeAgi(
  amount: number,
  period: NewYorkIncomePeriod
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  const annual = amount * incomePeriodToAnnualMultiplier(period);
  return Number.isFinite(annual) ? annual : null;
}

export interface NewYorkTaxEngineInput {
  taxYear: NewYorkTaxYear;
  agiEntered: number;
  incomePeriod: NewYorkIncomePeriod;
  payFrequency: NewYorkPayFrequency;
  filingStatus: NewYorkFilingStatus;
  nycResident: boolean;
  additionalDependents: number;
  itemizedDeductions: number;
  postTaxDeductions: number;
}

export interface NewYorkTaxEngineResult {
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
}

/**
 * Educational NY + federal income-tax estimate (no FICA).
 * - Federal & NY AGI treated as equal (no IT-225 / Schedule B mods).
 * - NY taxable reduces by max(NY standard, itemized) and dependent exemptions.
 * - NYC taxable equals NY taxable in this simplified model.
 * - Federal taxable uses max(federal standard, itemized); no dependent credits.
 */
export function calculateNewYorkTax(
  input: NewYorkTaxEngineInput
): NewYorkTaxEngineResult | null {
  const annualAgi = annualizeAgi(input.agiEntered, input.incomePeriod);
  if (annualAgi === null) return null;
  if (
    !(input.additionalDependents >= 0) ||
    !Number.isInteger(input.additionalDependents)
  ) {
    return null;
  }
  if (input.itemizedDeductions < 0 || input.postTaxDeductions < 0) {
    return null;
  }

  const fedStd = federalStandardDeduction(input.taxYear, input.filingStatus);
  const nyStd = newYorkStandardDeduction(input.filingStatus);
  const itemized = input.itemizedDeductions;
  const federalDeductionUsed = Math.max(fedStd, itemized);
  const newYorkDeductionUsed = Math.max(nyStd, itemized);
  const dependentExemptionTotal =
    input.additionalDependents * NEW_YORK_DEPENDENT_EXEMPTION;

  const federalTaxableIncome = Math.max(0, annualAgi - federalDeductionUsed);
  const newYorkTaxableIncome = Math.max(
    0,
    annualAgi - newYorkDeductionUsed - dependentExemptionTotal
  );
  const nycTaxableIncome = newYorkTaxableIncome;

  const federalIncomeTax = taxFromBrackets(
    federalTaxableIncome,
    federalOrdinaryBrackets(input.taxYear, input.filingStatus)
  );
  const newYorkStateTax = taxFromBrackets(
    newYorkTaxableIncome,
    newYorkStateBrackets(input.filingStatus)
  );
  const nycIncomeTax = input.nycResident
    ? taxFromBrackets(nycTaxableIncome, nycBrackets(input.filingStatus))
    : 0;

  const totalIncomeTax = federalIncomeTax + newYorkStateTax + nycIncomeTax;
  const effectiveTaxRatePercent =
    annualAgi > 0 ? (totalIncomeTax / annualAgi) * 100 : 0;
  const afterTaxIncome = annualAgi - totalIncomeTax;
  const postTaxDeductionsAnnual = input.postTaxDeductions;
  const netAfterPostTax = afterTaxIncome - postTaxDeductionsAnnual;
  const periods = payPeriodsPerYear(input.payFrequency);
  const takeHomePerPayPeriod = periods > 0 ? netAfterPostTax / periods : NaN;
  const totalTaxPerPayPeriod = periods > 0 ? totalIncomeTax / periods : NaN;

  if (
    ![
      federalIncomeTax,
      newYorkStateTax,
      nycIncomeTax,
      totalIncomeTax,
      takeHomePerPayPeriod,
      totalTaxPerPayPeriod,
    ].every((n) => Number.isFinite(n))
  ) {
    return null;
  }

  return {
    annualAgi,
    federalStandardDeduction: fedStd,
    newYorkStandardDeduction: nyStd,
    itemizedDeductions: itemized,
    federalDeductionUsed,
    newYorkDeductionUsed,
    dependentExemptionTotal,
    federalTaxableIncome,
    newYorkTaxableIncome,
    nycTaxableIncome,
    federalIncomeTax,
    newYorkStateTax,
    nycIncomeTax,
    totalIncomeTax,
    effectiveTaxRatePercent,
    afterTaxIncome,
    postTaxDeductionsAnnual,
    netAfterPostTax,
    takeHomePerPayPeriod,
    totalTaxPerPayPeriod,
    payPeriodsPerYear: periods,
  };
}