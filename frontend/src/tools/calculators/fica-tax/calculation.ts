/**
 * FICA / self-employment tax engine (educational estimate).
 *
 * Official sources:
 * - SSA 2026 COLA Fact Sheet (OASDI taxable maximum)
 * - IRS Topic 751 / Publication 15 (Circular E)
 * - IRS Topic 560 / Form 8959 (Additional Medicare Tax)
 * - IRC §§3101, 3111, 1401, 1402; Schedule SE
 */
import {
  ADDITIONAL_MEDICARE_RATE,
  DISCLOSURE_ADDITIONAL_MEDICARE,
  DISCLOSURE_INCOME_EMPLOYEE,
  DISCLOSURE_INCOME_SE,
  DISCLOSURE_SCOPE,
  DISCLOSURE_SE_DEDUCTION,
  FICA_YEAR_PARAMS,
  MEDICARE_RATE_EACH,
  MEDICARE_RATE_SE,
  SE_NET_EARNINGS_FACTOR,
  SS_RATE_EACH,
  SS_RATE_SE,
  additionalMedicareThreshold,
  type FicaEmploymentType,
  type FicaFilingStatus,
  type FicaTaxYear,
} from './fica-parameters';
import type { FicaResult } from './types';

export interface FicaNumericInput {
  employmentType: FicaEmploymentType;
  taxYear: FicaTaxYear;
  filingStatus: FicaFilingStatus;
  income: number;
}

/** Round money to nearest cent (IRS payroll cents). */
export function roundTaxCents(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRatePercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate);
}

/** Effective rate as percent, rounded to 4 decimal places (display uses 2). */
function rateOnIncome(tax: number, income: number): number {
  if (!(income > 0) || !Number.isFinite(tax)) return 0;
  return Math.round((tax / income) * 1_000_000) / 10_000;
}

export function calculateFica(input: FicaNumericInput): FicaResult {
  const income = Math.max(0, input.income);
  const year = FICA_YEAR_PARAMS[input.taxYear];
  const wageBase = year.socialSecurityWageBase;
  const addMedThreshold = additionalMedicareThreshold(input.filingStatus);

  if (input.employmentType === 'employee-employer') {
    const ssTaxable = Math.min(income, wageBase);
    const medicareTaxable = income;

    const employeeSocialSecurity = roundTaxCents(ssTaxable * SS_RATE_EACH);
    const employerSocialSecurity = roundTaxCents(ssTaxable * SS_RATE_EACH);
    const employeeMedicare = roundTaxCents(medicareTaxable * MEDICARE_RATE_EACH);
    const employerMedicare = roundTaxCents(medicareTaxable * MEDICARE_RATE_EACH);
    const additionalMedicare = roundTaxCents(
      Math.max(0, medicareTaxable - addMedThreshold) * ADDITIONAL_MEDICARE_RATE,
    );

    const taxpayerTotal = roundTaxCents(
      employeeSocialSecurity + employeeMedicare + additionalMedicare,
    );
    const employerTotal = roundTaxCents(employerSocialSecurity + employerMedicare);
    const combinedTotal = roundTaxCents(taxpayerTotal + employerTotal);
    const effectiveTaxpayerRate = rateOnIncome(taxpayerTotal, income);
    const effectiveCombinedRate = rateOnIncome(combinedTotal, income);

    const summaryText =
      `Employee FICA ${formatUsd(taxpayerTotal)} (SS ${formatUsd(employeeSocialSecurity)} + ` +
      `Medicare ${formatUsd(employeeMedicare)}` +
      (additionalMedicare > 0
        ? ` + Additional Medicare ${formatUsd(additionalMedicare)}`
        : '') +
      `). Employer FICA ${formatUsd(employerTotal)}. Combined ${formatUsd(combinedTotal)}.`;

    return {
      employmentType: input.employmentType,
      taxYear: input.taxYear,
      filingStatus: input.filingStatus,
      income,
      socialSecurityWageBase: wageBase,
      additionalMedicareThreshold: addMedThreshold,
      socialSecurityTaxable: ssTaxable,
      medicareTaxable,
      employeeSocialSecurity,
      employeeMedicare,
      additionalMedicare,
      employerSocialSecurity,
      employerMedicare,
      seSocialSecurity: 0,
      seMedicare: 0,
      seDeductibleHalf: 0,
      taxpayerTotal,
      employerTotal,
      combinedTotal,
      effectiveTaxpayerRate,
      effectiveCombinedRate,
      formattedIncome: formatUsd(income),
      formattedEmployeeSocialSecurity: formatUsd(employeeSocialSecurity),
      formattedEmployeeMedicare: formatUsd(employeeMedicare),
      formattedAdditionalMedicare: formatUsd(additionalMedicare),
      formattedEmployerSocialSecurity: formatUsd(employerSocialSecurity),
      formattedEmployerMedicare: formatUsd(employerMedicare),
      formattedSeSocialSecurity: formatUsd(0),
      formattedSeMedicare: formatUsd(0),
      formattedSeDeductibleHalf: formatUsd(0),
      formattedTaxpayerTotal: formatUsd(taxpayerTotal),
      formattedEmployerTotal: formatUsd(employerTotal),
      formattedCombinedTotal: formatUsd(combinedTotal),
      formattedEffectiveTaxpayerRate: formatRatePercent(effectiveTaxpayerRate),
      formattedEffectiveCombinedRate: formatRatePercent(effectiveCombinedRate),
      summaryText,
      disclosures: [
        DISCLOSURE_SCOPE,
        DISCLOSURE_INCOME_EMPLOYEE,
        DISCLOSURE_ADDITIONAL_MEDICARE,
      ],
    };
  }

  // Self-employed: income = net profit before 92.35% adjustment.
  const seEarnings = roundTaxCents(income * SE_NET_EARNINGS_FACTOR);
  const ssTaxable = Math.min(seEarnings, wageBase);
  const medicareTaxable = seEarnings;

  const seSocialSecurity = roundTaxCents(ssTaxable * SS_RATE_SE);
  const seMedicare = roundTaxCents(medicareTaxable * MEDICARE_RATE_SE);
  const additionalMedicare = roundTaxCents(
    Math.max(0, medicareTaxable - addMedThreshold) * ADDITIONAL_MEDICARE_RATE,
  );
  const seRegular = roundTaxCents(seSocialSecurity + seMedicare);
  const seDeductibleHalf = roundTaxCents(seRegular / 2);
  const taxpayerTotal = roundTaxCents(seRegular + additionalMedicare);
  const effectiveTaxpayerRate = rateOnIncome(taxpayerTotal, income);

  const summaryText =
    `Self-employment tax ${formatUsd(taxpayerTotal)} on SE earnings ${formatUsd(seEarnings)} ` +
    `(92.35% of net profit). SS ${formatUsd(seSocialSecurity)} + Medicare ${formatUsd(seMedicare)}` +
    (additionalMedicare > 0
      ? ` + Additional Medicare ${formatUsd(additionalMedicare)}`
      : '') +
    `. Deductible half of regular SE tax ${formatUsd(seDeductibleHalf)}.`;

  return {
    employmentType: input.employmentType,
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    income,
    socialSecurityWageBase: wageBase,
    additionalMedicareThreshold: addMedThreshold,
    socialSecurityTaxable: ssTaxable,
    medicareTaxable,
    employeeSocialSecurity: 0,
    employeeMedicare: 0,
    additionalMedicare,
    employerSocialSecurity: 0,
    employerMedicare: 0,
    seSocialSecurity,
    seMedicare,
    seDeductibleHalf,
    taxpayerTotal,
    employerTotal: 0,
    combinedTotal: taxpayerTotal,
    effectiveTaxpayerRate,
    effectiveCombinedRate: effectiveTaxpayerRate,
    formattedIncome: formatUsd(income),
    formattedEmployeeSocialSecurity: formatUsd(0),
    formattedEmployeeMedicare: formatUsd(0),
    formattedAdditionalMedicare: formatUsd(additionalMedicare),
    formattedEmployerSocialSecurity: formatUsd(0),
    formattedEmployerMedicare: formatUsd(0),
    formattedSeSocialSecurity: formatUsd(seSocialSecurity),
    formattedSeMedicare: formatUsd(seMedicare),
    formattedSeDeductibleHalf: formatUsd(seDeductibleHalf),
    formattedTaxpayerTotal: formatUsd(taxpayerTotal),
    formattedEmployerTotal: formatUsd(0),
    formattedCombinedTotal: formatUsd(taxpayerTotal),
    formattedEffectiveTaxpayerRate: formatRatePercent(effectiveTaxpayerRate),
    formattedEffectiveCombinedRate: formatRatePercent(effectiveTaxpayerRate),
    summaryText,
    disclosures: [
      DISCLOSURE_SCOPE,
      DISCLOSURE_INCOME_SE,
      DISCLOSURE_ADDITIONAL_MEDICARE,
      DISCLOSURE_SE_DEDUCTION,
    ],
  };
}

export function shareResultText(result: FicaResult): string {
  const year = result.taxYear;
  const mode =
    result.employmentType === 'employee-employer' ? 'Employee/Employer' : 'Self-employed';
  return (
    `FICA Tax Calculator (${year}, ${mode})\n` +
    `Income: $${result.formattedIncome}\n` +
    `${result.summaryText}\n` +
    `Effective taxpayer rate: ${result.formattedEffectiveTaxpayerRate}%`
  );
}
