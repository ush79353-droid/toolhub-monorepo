import type {
  IllinoisFilingStatus,
  IllinoisIncomePeriod,
  IllinoisPayFrequency,
  IllinoisTaxYear,
} from './types';

/**
 * Federal + Illinois parameters.
 * Sources:
 * - Rev. Proc. 2024-40 (TY2025) / 2025-32 (TY2026) federal brackets & std. deduction
 * - IDOR: IL individual rate 4.95%; TY2025 exemption $2,850; TY2026 $2,925
 * - IL-1040: exemption AGI cutoffs $250k single / $500k MFJ
 */

export interface ProgressiveBracket {
  upTo: number | null;
  rate: number;
  baseTax: number;
  from: number;
}

function buildBrackets(
  bands: ReadonlyArray<{ upTo: number | null; rate: number }>
): readonly ProgressiveBracket[] {
  const out: ProgressiveBracket[] = [];
  let from = 0;
  let baseTax = 0;
  for (const band of bands) {
    out.push({ from, upTo: band.upTo, rate: band.rate, baseTax });
    if (band.upTo != null) {
      baseTax += (band.upTo - from) * band.rate;
      from = band.upTo;
    }
  }
  return out;
}

const FEDERAL_RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37] as const;
const FED_T2025 = {
  single: [11_925, 48_475, 103_350, 197_300, 250_525, 626_350],
  joint: [23_850, 96_950, 206_700, 394_600, 501_050, 751_600],
  hoh: [17_000, 64_850, 103_350, 197_300, 250_500, 626_350],
  mfs: [11_925, 48_475, 103_350, 197_300, 250_525, 375_800],
} as const;
const FED_T2026 = {
  single: [12_400, 50_400, 105_700, 201_775, 256_225, 640_600],
  joint: [24_800, 100_800, 211_400, 403_550, 512_450, 768_700],
  hoh: [17_700, 67_450, 105_700, 201_750, 256_200, 640_600],
  mfs: [12_400, 50_400, 105_700, 201_775, 256_225, 384_350],
} as const;

function federalBracketsFromThresholds(
  thresholds: readonly number[]
): readonly ProgressiveBracket[] {
  const bands: Array<{ upTo: number | null; rate: number }> = [];
  for (let i = 0; i < FEDERAL_RATES.length; i++) {
    bands.push({
      upTo: i < thresholds.length ? thresholds[i]! : null,
      rate: FEDERAL_RATES[i]!,
    });
  }
  return buildBrackets(bands);
}

export function federalOrdinaryBrackets(
  year: IllinoisTaxYear,
  status: IllinoisFilingStatus
): readonly ProgressiveBracket[] {
  const table = year === 2025 ? FED_T2025 : FED_T2026;
  switch (status) {
    case 'married-joint':
    case 'qualifying-surviving-spouse':
      return federalBracketsFromThresholds(table.joint);
    case 'head-of-household':
      return federalBracketsFromThresholds(table.hoh);
    case 'married-separate':
      return federalBracketsFromThresholds(table.mfs);
    case 'single':
      return federalBracketsFromThresholds(table.single);
  }
}

export function federalStandardDeduction(
  year: IllinoisTaxYear,
  status: IllinoisFilingStatus
): number {
  if (year === 2025) {
    switch (status) {
      case 'single':
      case 'married-separate':
        return 15_750;
      case 'married-joint':
      case 'qualifying-surviving-spouse':
        return 31_500;
      case 'head-of-household':
        return 23_625;
    }
  }
  switch (status) {
    case 'single':
    case 'married-separate':
      return 16_100;
    case 'married-joint':
    case 'qualifying-surviving-spouse':
      return 32_200;
    case 'head-of-household':
      return 24_150;
  }
}

/** Other dependent credit only — CTC ages unknown. */
export const FEDERAL_OTHER_DEPENDENT_CREDIT = 500;

export const ILLINOIS_INCOME_TAX_RATE = 0.0495;

export function illinoisPersonalExemptionAmount(year: IllinoisTaxYear): number {
  return year === 2025 ? 2_850 : 2_925;
}

export function illinoisExemptionAgCutoff(
  status: IllinoisFilingStatus
): number {
  switch (status) {
    case 'married-joint':
      return 500_000;
    default:
      return 250_000;
  }
}

/**
 * IL-1040 Line 10 style allowance: filer (+ spouse if joint) + dependents,
 * zero when federal AGI exceeds the IDOR cutoff.
 */
export function illinoisExemptionAllowance(
  year: IllinoisTaxYear,
  status: IllinoisFilingStatus,
  federalAgi: number,
  additionalDependents: number
): number {
  if (federalAgi > illinoisExemptionAgCutoff(status)) return 0;
  const per = illinoisPersonalExemptionAmount(year);
  const filers = status === 'married-joint' ? 2 : 1;
  return per * (filers + additionalDependents);
}

export function taxFromBrackets(
  taxable: number,
  brackets: readonly ProgressiveBracket[]
): number {
  if (!(taxable > 0)) return 0;
  for (const bracket of brackets) {
    const cap = bracket.upTo ?? Number.POSITIVE_INFINITY;
    if (taxable <= cap) {
      return bracket.baseTax + (taxable - bracket.from) * bracket.rate;
    }
  }
  const last = brackets[brackets.length - 1]!;
  return last.baseTax + (taxable - last.from) * last.rate;
}

export function incomePeriodToAnnualMultiplier(
  period: IllinoisIncomePeriod
): number {
  switch (period) {
    case 'year':
      return 1;
    case 'month':
      return 12;
    case 'semimonthly':
      return 24;
    case 'biweekly':
      return 26;
    case 'week':
      return 52;
  }
}

export function payPeriodsPerYear(frequency: IllinoisPayFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 52;
    case 'biweekly':
      return 26;
    case 'semimonthly':
      return 24;
    case 'monthly':
      return 12;
    case 'annually':
      return 1;
  }
}
