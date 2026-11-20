import {
  ADDITIONAL_MEDICARE_RATE,
  CALIFORNIA_DEPENDENT_EXEMPTION_CREDIT,
  MEDICARE_RATE,
  MENTAL_HEALTH_TAX_RATE,
  MENTAL_HEALTH_TAX_THRESHOLD,
  OASDI_RATE,
  additionalMedicareThreshold,
  californiaBrackets,
  californiaExemptionPhaseoutStart,
  californiaPersonalExemptionCredit,
  californiaSdiRate,
  californiaStandardDeduction,
  federalOrdinaryBrackets,
  federalStandardDeduction,
  FEDERAL_OTHER_DEPENDENT_CREDIT,
  incomePeriodToAnnualMultiplier,
  payPeriodsPerYear,
  socialSecurityWageBase,
  taxFromBrackets,
} from './tax-parameters';
import type {
  CaliforniaFilingStatus,
  CaliforniaIncomePeriod,
  CaliforniaPayFrequency,
  CaliforniaTaxYear,
} from './types';

export function formatCaliforniaMoney(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function annualizeAgi(
  amount: number,
  period: CaliforniaIncomePeriod
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  const annual = amount * incomePeriodToAnnualMultiplier(period);
  return Number.isFinite(annual) ? annual : null;
}

/**
 * FTB exemption credit phaseout: reduce by $6 for each $2,500 (or fraction)
 * of federal AGI over the Form 540 threshold.
 */
export function phaseOutExemptionCredits(
  fullCredits: number,
  federalAgi: number,
  status: CaliforniaFilingStatus
): number {
  if (!(fullCredits > 0)) return 0;
  const start = californiaExemptionPhaseoutStart(status);
  if (federalAgi <= start) return fullCredits;
  const excess = federalAgi - start;
  const steps = Math.ceil(excess / 2_500);
  const reduction = steps * 6;
  return Math.max(0, fullCredits - reduction);
}

export interface CaliforniaTaxEngineInput {
  taxYear: CaliforniaTaxYear;
  agiEntered: number;
  incomePeriod: CaliforniaIncomePeriod;
  payFrequency: CaliforniaPayFrequency;
  filingStatus: CaliforniaFilingStatus;
  additionalDependents: number;
  itemizedDeductions: number;
  postTaxDeductions: number;
  assessedHomeValue: number;
  propertyTaxRatePercent: number;
}

export interface CaliforniaTaxEngineResult {
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
}

/**
 * Educational CA + federal + employee payroll estimate.
 * - Federal & CA AGI treated as equal (no Schedule CA adjustments).
 * - Same itemized figure compared to each jurisdiction's standard deduction.
 * - Dependents → CA dependent exemption credits + federal other-dependent credit.
 * - AGI used as wage proxy for FICA / SDI.
 * - Property tax separate: assessed × rate%.
 */
export function calculateCaliforniaTax(
  input: CaliforniaTaxEngineInput
): CaliforniaTaxEngineResult | null {
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

  const fedStd = federalStandardDeduction(input.taxYear, input.filingStatus);
  const caStd = californiaStandardDeduction(input.filingStatus);
  const itemized = input.itemizedDeductions;
  const federalDeductionUsed = Math.max(fedStd, itemized);
  const californiaDeductionUsed = Math.max(caStd, itemized);

  const federalTaxableIncome = Math.max(0, annualAgi - federalDeductionUsed);
  const californiaTaxableIncome = Math.max(0, annualAgi - californiaDeductionUsed);

  const federalBeforeCredits = taxFromBrackets(
    federalTaxableIncome,
    federalOrdinaryBrackets(input.taxYear, input.filingStatus)
  );
  const federalCredits =
    input.additionalDependents * FEDERAL_OTHER_DEPENDENT_CREDIT;
  const federalIncomeTax = Math.max(0, federalBeforeCredits - federalCredits);

  const caBeforeCredits = taxFromBrackets(
    californiaTaxableIncome,
    californiaBrackets(input.filingStatus)
  );
  const fullExemptionCredits =
    californiaPersonalExemptionCredit(input.filingStatus) +
    input.additionalDependents * CALIFORNIA_DEPENDENT_EXEMPTION_CREDIT;
  const californiaExemptionCredits = phaseOutExemptionCredits(
    fullExemptionCredits,
    annualAgi,
    input.filingStatus
  );
  const afterExemption = Math.max(0, caBeforeCredits - californiaExemptionCredits);
  const californiaMentalHealthTax =
    californiaTaxableIncome > MENTAL_HEALTH_TAX_THRESHOLD
      ? (californiaTaxableIncome - MENTAL_HEALTH_TAX_THRESHOLD) *
        MENTAL_HEALTH_TAX_RATE
      : 0;
  const californiaIncomeTax = afterExemption + californiaMentalHealthTax;

  const ssBase = socialSecurityWageBase(input.taxYear);
  const socialSecurityTax = Math.min(annualAgi, ssBase) * OASDI_RATE;
  const medicareTax = annualAgi * MEDICARE_RATE;
  const addlThreshold = additionalMedicareThreshold(input.filingStatus);
  const additionalMedicareTax =
    annualAgi > addlThreshold
      ? (annualAgi - addlThreshold) * ADDITIONAL_MEDICARE_RATE
      : 0;
  const californiaSdiTax = annualAgi * californiaSdiRate(input.taxYear);
  const payrollTaxes =
    socialSecurityTax + medicareTax + additionalMedicareTax + californiaSdiTax;

  const totalIncomeAndPayrollTax =
    federalIncomeTax + californiaIncomeTax + payrollTaxes;
  const afterTaxIncome = annualAgi - totalIncomeAndPayrollTax;
  const postTaxDeductionsAnnual = input.postTaxDeductions;
  const netAfterPostTax = afterTaxIncome - postTaxDeductionsAnnual;
  const periods = payPeriodsPerYear(input.payFrequency);
  const takeHomePerPayPeriod = periods > 0 ? netAfterPostTax / periods : NaN;

  const estimatedPropertyTax =
    input.assessedHomeValue * (input.propertyTaxRatePercent / 100);

  if (
    ![
      federalIncomeTax,
      californiaIncomeTax,
      payrollTaxes,
      takeHomePerPayPeriod,
      estimatedPropertyTax,
    ].every((n) => Number.isFinite(n))
  ) {
    return null;
  }

  return {
    annualAgi,
    federalStandardDeduction: fedStd,
    californiaStandardDeduction: caStd,
    itemizedDeductions: itemized,
    federalDeductionUsed,
    californiaDeductionUsed,
    federalTaxableIncome,
    californiaTaxableIncome,
    federalIncomeTax,
    californiaIncomeTaxBeforeCredits: caBeforeCredits,
    californiaExemptionCredits,
    californiaMentalHealthTax,
    californiaIncomeTax,
    socialSecurityTax,
    medicareTax,
    additionalMedicareTax,
    californiaSdiTax,
    payrollTaxes,
    totalIncomeAndPayrollTax,
    afterTaxIncome,
    postTaxDeductionsAnnual,
    netAfterPostTax,
    takeHomePerPayPeriod,
    payPeriodsPerYear: periods,
    propertyTaxRatePercent: input.propertyTaxRatePercent,
    estimatedPropertyTax,
  };
}
