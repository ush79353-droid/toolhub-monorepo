import type {
  TexasFilingStatus,
  TexasIncomePeriod,
  TexasPayFrequency,
  TexasTaxYear,
} from './types';

/**
 * Federal parameters for the Texas Tax Calculator.
 * Texas has **no** state individual income tax.
 *
 * Sources:
 * - Rev. Proc. 2024-40 (TY2025) / 2025-32 (TY2026) federal brackets & std. deduction
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
  year: TexasTaxYear,
  status: TexasFilingStatus
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
  year: TexasTaxYear,
  status: TexasFilingStatus
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

/** Texas has no state personal income tax. */
export const TEXAS_STATE_INCOME_TAX = 0;

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
  period: TexasIncomePeriod
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

export function payPeriodsPerYear(frequency: TexasPayFrequency): number {
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
