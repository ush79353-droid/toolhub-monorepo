/**
 * UK National Insurance estimate (employee Class 1 category A + Class 4).
 * Employment and self-employment bases are taxed separately, then summed.
 */
import {
  NI_YEAR_PARAMS,
  type NiTaxYearId,
  type NiYearParams,
} from './ni-parameters';
import type { NationalInsuranceResult } from './types';

export function roundGbp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

export function formatGbp(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function bandedContribution(
  income: number,
  lower: number,
  upper: number,
  mainRate: number,
  upperRate: number
): number {
  if (!(income > 0) || !Number.isFinite(income)) return 0;
  const mainBand = Math.max(0, Math.min(income, upper) - lower);
  const upperBand = Math.max(0, income - upper);
  return mainBand * mainRate + upperBand * upperRate;
}

/** Employee Class 1 (category A) on employment earnings only. */
export function calculateClass1Employee(
  employmentIncome: number,
  params: NiYearParams
): number {
  return roundGbp(
    bandedContribution(
      employmentIncome,
      params.primaryThreshold,
      params.upperLimit,
      params.class1MainRate,
      params.class1UpperRate
    )
  );
}

/** Class 4 on self-employment profits only. Class 2 not charged for supported years. */
export function calculateClass4(
  selfEmploymentProfits: number,
  params: NiYearParams
): number {
  return roundGbp(
    bandedContribution(
      selfEmploymentProfits,
      params.primaryThreshold,
      params.upperLimit,
      params.class4MainRate,
      params.class4UpperRate
    )
  );
}

export function calculateNationalInsurance(input: {
  employmentIncome: number;
  selfEmploymentIncome: number;
  taxYear: NiTaxYearId;
}): NationalInsuranceResult | null {
  const params = NI_YEAR_PARAMS[input.taxYear];
  if (!params) return null;

  const employmentIncome = input.employmentIncome;
  const selfEmploymentIncome = input.selfEmploymentIncome;
  if (
    !Number.isFinite(employmentIncome) ||
    !Number.isFinite(selfEmploymentIncome) ||
    employmentIncome < 0 ||
    selfEmploymentIncome < 0
  ) {
    return null;
  }

  const class1Employee = calculateClass1Employee(employmentIncome, params);
  const class4 = calculateClass4(selfEmploymentIncome, params);
  const class2 = 0;
  const totalNationalInsurance = roundGbp(class1Employee + class4 + class2);
  const totalAnnualIncome = roundGbp(employmentIncome + selfEmploymentIncome);

  const explanation = [
    `Class 1 (employee) on employment income ${formatGbp(employmentIncome)}: ${formatGbp(class1Employee)}.`,
    `Class 4 on self-employment profits ${formatGbp(selfEmploymentIncome)}: ${formatGbp(class4)}.`,
    `Total National Insurance: ${formatGbp(totalNationalInsurance)}.`,
  ].join(' ');

  return {
    taxYear: input.taxYear,
    taxYearLabel: params.label,
    employmentIncome,
    selfEmploymentIncome,
    totalAnnualIncome,
    class1Employee,
    class4,
    class2,
    totalNationalInsurance,
    formattedEmploymentIncome: formatGbp(employmentIncome),
    formattedSelfEmploymentIncome: formatGbp(selfEmploymentIncome),
    formattedTotalAnnualIncome: formatGbp(totalAnnualIncome),
    formattedClass1Employee: formatGbp(class1Employee),
    formattedClass4: formatGbp(class4),
    formattedTotalNationalInsurance: formatGbp(totalNationalInsurance),
    explanation,
    disclosures: [
      params.sourceNote,
      'Employee Class 1 uses standard category A rates on employment income only. Employer Class 1 is not included.',
      'Self-employed Class 4 uses profits only. Class 2 is not charged in this estimate for 2024/25 onward (HMRC treats Class 2 as paid when profits are at/above the small profits threshold).',
      'Annual thresholds are applied to annual figures. Directors, reduced-rate categories, deferment, and mid-year rate changes within older years are out of scope.',
      'Educational estimate only — not HMRC Self Assessment or payroll advice.',
    ],
  };
}

export function shareResultText(
  result: NationalInsuranceResult,
  title: string,
  url: string
): string {
  return [
    `${title} | Omega Calculators`,
    `Tax year: ${result.taxYearLabel}`,
    `Employment income: ${result.formattedEmploymentIncome}`,
    `Self-employment net income: ${result.formattedSelfEmploymentIncome}`,
    `Total annual income: ${result.formattedTotalAnnualIncome}`,
    `Class 1 (employee): ${result.formattedClass1Employee}`,
    `Class 4: ${result.formattedClass4}`,
    `National Insurance: ${result.formattedTotalNationalInsurance}`,
    '',
    `Calculator: ${url}`,
  ].join('\n');
}
