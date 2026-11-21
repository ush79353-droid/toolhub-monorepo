import {
  bracketsForStatus,
  dependentExemptionPer,
  incomePeriodToAnnualMultiplier,
  LOCAL_OCCUPATIONAL_RATES,
  payPeriodsPerYear,
  personalExemption,
  standardDeduction,
} from './tax-parameters';
import type {
  AlabamaFilingStatus,
  AlabamaIncomePeriod,
  AlabamaJurisdiction,
  AlabamaPayFrequency,
  AlabamaTaxYear,
} from './types';

export function formatAlabamaMoney(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function annualizeAgi(
  amount: number,
  period: AlabamaIncomePeriod
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  const annual = amount * incomePeriodToAnnualMultiplier(period);
  return Number.isFinite(annual) ? annual : null;
}

/** Progressive Alabama tax from taxable income (full precision). */
export function calculateAlabamaStateTax(
  taxableIncome: number,
  status: AlabamaFilingStatus
): number | null {
  if (!Number.isFinite(taxableIncome) || taxableIncome < 0) return null;
  if (taxableIncome === 0) return 0;

  const brackets = bracketsForStatus(status);
  let tax = 0;
  let previousCap = 0;

  for (const bracket of brackets) {
    const cap = bracket.upTo ?? Number.POSITIVE_INFINITY;
    const slice = Math.min(taxableIncome, cap) - previousCap;
    if (slice > 0) {
      tax += slice * bracket.rate;
    }
    if (taxableIncome <= cap) break;
    previousCap = cap;
  }

  return Number.isFinite(tax) && tax >= 0 ? tax : null;
}

export interface AlabamaTaxEngineInput {
  taxYear: AlabamaTaxYear;
  agiEntered: number;
  incomePeriod: AlabamaIncomePeriod;
  payFrequency: AlabamaPayFrequency;
  filingStatus: AlabamaFilingStatus;
  jurisdiction: AlabamaJurisdiction;
  additionalDependents: number;
  itemizedDeductions: number;
  postTaxDeductions: number;
}

export interface AlabamaTaxEngineResult {
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
}

/**
 * Alabama taxable income estimate:
 *   Deduction = max(standard chart, itemized)
 *   Taxable = max(0, AGI − deduction − personal − dependents)
 * Federal tax deduction (Form 40 line 12) omitted (not an input).
 * Local occupational tax = AGI × rate (earned-income proxy).
 * Post-tax deductions reduce take-home only.
 */
export function calculateAlabamaTax(
  input: AlabamaTaxEngineInput
): AlabamaTaxEngineResult | null {
  const annualAgi = annualizeAgi(input.agiEntered, input.incomePeriod);
  if (annualAgi === null) return null;
  if (
    !(input.additionalDependents >= 0) ||
    !Number.isInteger(input.additionalDependents)
  ) {
    return null;
  }
  if (input.itemizedDeductions < 0 || input.postTaxDeductions < 0) return null;

  const std = standardDeduction(input.filingStatus, annualAgi);
  const itemized = input.itemizedDeductions;
  const useItemized = itemized > std;
  const deductionUsed = useItemized ? itemized : std;
  const personal = personalExemption(input.filingStatus);
  const depPer = dependentExemptionPer(annualAgi);
  const depTotal = depPer * input.additionalDependents;

  const taxableIncome = Math.max(
    0,
    annualAgi - deductionUsed - personal - depTotal
  );
  if (!Number.isFinite(taxableIncome)) return null;

  const stateIncomeTax = calculateAlabamaStateTax(
    taxableIncome,
    input.filingStatus
  );
  if (stateIncomeTax === null) return null;

  const localRate = LOCAL_OCCUPATIONAL_RATES[input.jurisdiction];
  const localOccupationalTax = annualAgi * localRate;
  if (!Number.isFinite(localOccupationalTax) || localOccupationalTax < 0) {
    return null;
  }

  const totalTax = stateIncomeTax + localOccupationalTax;
  if (!Number.isFinite(totalTax) || totalTax < 0) return null;

  const afterTaxIncome = annualAgi - totalTax;
  const postTaxAnnual =
    input.postTaxDeductions * incomePeriodToAnnualMultiplier(input.incomePeriod);
  if (!Number.isFinite(postTaxAnnual) || postTaxAnnual < 0) return null;

  const netAfterPostTax = afterTaxIncome - postTaxAnnual;
  const periods = payPeriodsPerYear(input.payFrequency);
  const takeHomePerPayPeriod = netAfterPostTax / periods;
  if (!Number.isFinite(takeHomePerPayPeriod)) return null;

  return {
    annualAgi,
    standardDeduction: std,
    itemizedDeductions: itemized,
    deductionUsed,
    deductionType: useItemized ? 'itemized' : 'standard',
    personalExemption: personal,
    dependentExemptionPer: depPer,
    dependentExemptionTotal: depTotal,
    taxableIncome,
    stateIncomeTax,
    localOccupationalRate: localRate,
    localOccupationalTax,
    totalTax,
    afterTaxIncome,
    postTaxDeductionsAnnual: postTaxAnnual,
    netAfterPostTax,
    takeHomePerPayPeriod,
    payPeriodsPerYear: periods,
  };
}
