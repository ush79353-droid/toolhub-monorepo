import type {
  NewYorkFilingStatus,
  NewYorkIncomePeriod,
  NewYorkPayFrequency,
  NewYorkTaxYear,
} from './types';

/**
 * Verified New York State, NYC, and federal TY2025 parameters.
 *
 * Sources:
 * - Rev. Proc. 2024-40 (federal ordinary brackets & standard deduction)
 * - NYS IT-201 (2025) standard deduction & dependent exemption
 * - N.Y. Tax Law §601 (2023–before 2026 rate schedules)
 * - NYC resident rate schedules (IT-201 / IT-360.1)
 */

export interface ProgressiveBracket {
  /** Exclusive upper bound; null = open top. */
  upTo: number | null;
  rate: number;
  /** Cumulative tax at the start of this bracket. */
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

/** NY State — Single / MFS (Tax Law §601(c), years before 2026). */
const NY_STATE_SINGLE_MFS = buildBrackets([
  { upTo: 8_500, rate: 0.04 },
  { upTo: 11_700, rate: 0.045 },
  { upTo: 13_900, rate: 0.0525 },
  { upTo: 80_650, rate: 0.055 },
  { upTo: 215_400, rate: 0.06 },
  { upTo: 1_077_550, rate: 0.0685 },
  { upTo: 5_000_000, rate: 0.0965 },
  { upTo: 25_000_000, rate: 0.103 },
  { upTo: null, rate: 0.109 },
]);

/** NY State — MFJ / qualifying surviving spouse. */
const NY_STATE_JOINT_QSS = buildBrackets([
  { upTo: 17_150, rate: 0.04 },
  { upTo: 23_600, rate: 0.045 },
  { upTo: 27_900, rate: 0.0525 },
  { upTo: 43_000, rate: 0.059 },
  { upTo: 161_550, rate: 0.0597 },
  { upTo: 323_200, rate: 0.0633 },
  { upTo: 2_155_350, rate: 0.0685 },
  { upTo: 5_000_000, rate: 0.0965 },
  { upTo: 25_000_000, rate: 0.103 },
  { upTo: null, rate: 0.109 },
]);

/** NY State — head of household (IT-201 rate schedule). */
const NY_STATE_HOH = buildBrackets([
  { upTo: 12_800, rate: 0.04 },
  { upTo: 17_650, rate: 0.045 },
  { upTo: 20_900, rate: 0.0525 },
  { upTo: 107_650, rate: 0.055 },
  { upTo: 269_300, rate: 0.06 },
  { upTo: 1_616_450, rate: 0.0685 },
  { upTo: 5_000_000, rate: 0.0965 },
  { upTo: 25_000_000, rate: 0.103 },
  { upTo: null, rate: 0.109 },
]);

/** NYC — Single / MFS. */
const NYC_SINGLE_MFS = buildBrackets([
  { upTo: 12_000, rate: 0.03078 },
  { upTo: 25_000, rate: 0.03762 },
  { upTo: 50_000, rate: 0.03819 },
  { upTo: null, rate: 0.03876 },
]);

/** NYC — MFJ / QSS. */
const NYC_JOINT_QSS = buildBrackets([
  { upTo: 21_600, rate: 0.03078 },
  { upTo: 45_000, rate: 0.03762 },
  { upTo: 90_000, rate: 0.03819 },
  { upTo: null, rate: 0.03876 },
]);

/** NYC — head of household. */
const NYC_HOH = buildBrackets([
  { upTo: 14_400, rate: 0.03078 },
  { upTo: 30_000, rate: 0.03762 },
  { upTo: 60_000, rate: 0.03819 },
  { upTo: null, rate: 0.03876 },
]);

export function newYorkStateBrackets(
  status: NewYorkFilingStatus
): readonly ProgressiveBracket[] {
  switch (status) {
    case 'married-joint':
    case 'qualifying-surviving-spouse':
      return NY_STATE_JOINT_QSS;
    case 'head-of-household':
      return NY_STATE_HOH;
    case 'single':
    case 'married-separate':
      return NY_STATE_SINGLE_MFS;
  }
}

export function nycBrackets(
  status: NewYorkFilingStatus
): readonly ProgressiveBracket[] {
  switch (status) {
    case 'married-joint':
    case 'qualifying-surviving-spouse':
      return NYC_JOINT_QSS;
    case 'head-of-household':
      return NYC_HOH;
    case 'single':
    case 'married-separate':
      return NYC_SINGLE_MFS;
  }
}

export function newYorkStandardDeduction(status: NewYorkFilingStatus): number {
  switch (status) {
    case 'single':
    case 'married-separate':
      return 8_000;
    case 'married-joint':
    case 'qualifying-surviving-spouse':
      return 16_050;
    case 'head-of-household':
      return 11_200;
  }
}

export const NEW_YORK_DEPENDENT_EXEMPTION = 1_000;

const FEDERAL_RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37] as const;

const FED_T2025 = {
  single: [11_925, 48_475, 103_350, 197_300, 250_525, 626_350],
  joint: [23_850, 96_950, 206_700, 394_600, 501_050, 751_600],
  hoh: [17_000, 64_850, 103_350, 197_300, 250_500, 626_350],
  mfs: [11_925, 48_475, 103_350, 197_300, 250_525, 375_800],
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
  year: NewYorkTaxYear,
  status: NewYorkFilingStatus
): readonly ProgressiveBracket[] {
  if (year !== 2025) return federalOrdinaryBrackets(2025, status);
  switch (status) {
    case 'married-joint':
    case 'qualifying-surviving-spouse':
      return federalBracketsFromThresholds(FED_T2025.joint);
    case 'head-of-household':
      return federalBracketsFromThresholds(FED_T2025.hoh);
    case 'married-separate':
      return federalBracketsFromThresholds(FED_T2025.mfs);
    case 'single':
      return federalBracketsFromThresholds(FED_T2025.single);
  }
}

export function federalStandardDeduction(
  year: NewYorkTaxYear,
  status: NewYorkFilingStatus
): number {
  if (year !== 2025) return federalStandardDeduction(2025, status);
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

export function incomePeriodToAnnualMultiplier(
  period: NewYorkIncomePeriod
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

export function payPeriodsPerYear(frequency: NewYorkPayFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 52;
    case 'biweekly':
      return 26;
    case 'semimonthly':
      return 24;
    case 'monthly':
      return 12;
  }
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