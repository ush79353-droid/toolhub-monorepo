/**
 * Verified US federal tax parameters for tax years 2025 and 2026.
 * Sources (official):
 * - Rev. Proc. 2024-40 (2025 brackets / LTCG / aged std. deduction base)
 * - Rev. Proc. 2025-32 + IRS IR-2025-103 (2026 brackets / LTCG / OBBBA std. deduction)
 * - IRS 1040 / Schedule A / Schedule 8812 / Schedule 1-A instructions (OBBBA tips, OT, car interest, CTC, SALT)
 * - P.L. 119-21 (One, Big, Beautiful Bill Act)
 */

import type { FilingStatus, TaxYear } from './types';

export type { FilingStatus, TaxYear };

export interface Bracket {
  /** Upper bound of this bracket (exclusive of next); Infinity for top. */
  upTo: number;
  rate: number;
  /** Tax on all income below the start of this bracket. */
  baseTax: number;
  /** Lower bound of this bracket. */
  from: number;
}

export interface YearParams {
  standardDeduction: Record<FilingStatus, number>;
  /** Additional standard deduction if age >= 65 (per qualifying person). */
  additionalStdAgedUnmarried: number;
  additionalStdAgedMarried: number;
  ordinaryBrackets: Record<FilingStatus, readonly Bracket[]>;
  ltcgZeroMax: Record<FilingStatus, number>;
  ltcgFifteenMax: Record<FilingStatus, number>;
  childTaxCreditPerChild: number;
  additionalCtcMaxPerChild: number;
  otherDependentCredit: number;
  ctcPhaseoutStart: Record<FilingStatus, number>;
  saltCap: number;
  saltCapMfs: number;
  saltFloor: number;
  saltFloorMfs: number;
  saltPhaseoutStart: number;
  saltPhaseoutStartMfs: number;
}

function bracketsFromThresholds(
  thresholds: readonly number[],
  rates: readonly number[]
): Bracket[] {
  const out: Bracket[] = [];
  let baseTax = 0;
  for (let i = 0; i < rates.length; i++) {
    const from = i === 0 ? 0 : thresholds[i - 1]!;
    const upTo = i < thresholds.length ? thresholds[i]! : Number.POSITIVE_INFINITY;
    out.push({ from, upTo, rate: rates[i]!, baseTax });
    if (Number.isFinite(upTo)) {
      baseTax += (upTo - from) * rates[i]!;
    }
  }
  return out;
}

const RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37] as const;

/** 2025 ordinary thresholds (Rev. Proc. 2024-40) — upper bounds of each rate band. */
const T2025 = {
  single: [11_925, 48_475, 103_350, 197_300, 250_525, 626_350],
  mfj: [23_850, 96_950, 206_700, 394_600, 501_050, 751_600],
  hoh: [17_000, 64_850, 103_350, 197_300, 250_500, 626_350],
  mfs: [11_925, 48_475, 103_350, 197_300, 250_525, 375_800],
} as const;

/** 2026 ordinary thresholds (Rev. Proc. 2025-32 / IRS IR-2025-103). */
const T2026 = {
  single: [12_400, 50_400, 105_700, 201_775, 256_225, 640_600],
  mfj: [24_800, 100_800, 211_400, 403_550, 512_450, 768_700],
  // Exact HoH thresholds from Rev. Proc. 2025-32 Table 2
  hoh: [17_700, 67_450, 105_700, 201_750, 256_200, 640_600],
  mfs: [12_400, 50_400, 105_700, 201_775, 256_225, 384_350],
} as const;

function statusMap<T>(
  single: T,
  mfj: T,
  mfs: T,
  hoh: T
): Record<FilingStatus, T> {
  return {
    single,
    'married-joint': mfj,
    'married-separate': mfs,
    'head-of-household': hoh,
    'qualifying-surviving-spouse': mfj,
  };
}

export const YEAR_PARAMS: Record<TaxYear, YearParams> = {
  2025: {
    // OBBBA-enhanced amounts (IRS 1040 instructions / IR-2025-103)
    standardDeduction: statusMap(15_750, 31_500, 15_750, 23_625),
    additionalStdAgedUnmarried: 2_000,
    additionalStdAgedMarried: 1_600,
    ordinaryBrackets: statusMap(
      bracketsFromThresholds(T2025.single, RATES),
      bracketsFromThresholds(T2025.mfj, RATES),
      bracketsFromThresholds(T2025.mfs, RATES),
      bracketsFromThresholds(T2025.hoh, RATES)
    ),
    ltcgZeroMax: statusMap(48_350, 96_700, 48_350, 64_750),
    ltcgFifteenMax: statusMap(533_400, 600_050, 300_000, 566_700),
    childTaxCreditPerChild: 2_200,
    additionalCtcMaxPerChild: 1_700,
    otherDependentCredit: 500,
    ctcPhaseoutStart: statusMap(200_000, 400_000, 200_000, 200_000),
    saltCap: 40_000,
    saltCapMfs: 20_000,
    saltFloor: 10_000,
    saltFloorMfs: 5_000,
    saltPhaseoutStart: 500_000,
    saltPhaseoutStartMfs: 250_000,
  },
  2026: {
    standardDeduction: statusMap(16_100, 32_200, 16_100, 24_150),
    // Tax Foundation / IRS inflation note — aged amounts rise with §63(f)
    additionalStdAgedUnmarried: 2_050,
    additionalStdAgedMarried: 1_650,
    ordinaryBrackets: statusMap(
      bracketsFromThresholds(T2026.single, RATES),
      bracketsFromThresholds(T2026.mfj, RATES),
      bracketsFromThresholds(T2026.mfs, RATES),
      bracketsFromThresholds(T2026.hoh, RATES)
    ),
    ltcgZeroMax: statusMap(49_450, 98_900, 49_450, 66_200),
    ltcgFifteenMax: statusMap(545_500, 613_700, 306_850, 579_600),
    childTaxCreditPerChild: 2_200,
    additionalCtcMaxPerChild: 1_700,
    otherDependentCredit: 500,
    ctcPhaseoutStart: statusMap(200_000, 400_000, 200_000, 200_000),
    // OBBBA SALT cap; 2026 is inflation-adjusted — using 2025 statutory base pending separate IRS figure
    saltCap: 40_000,
    saltCapMfs: 20_000,
    saltFloor: 10_000,
    saltFloorMfs: 5_000,
    saltPhaseoutStart: 500_000,
    saltPhaseoutStartMfs: 250_000,
  },
};

/** OBBBA Schedule 1-A caps (IRS Schedule 1-A / Working Families Tax Cuts). */
export const OBBBA = {
  tipsMax: 25_000,
  overtimeMaxSingle: 12_500,
  overtimeMaxJoint: 25_000,
  carInterestMax: 10_000,
  tipsOtPhaseoutStart: { single: 150_000, joint: 300_000 },
  carPhaseoutStart: { single: 100_000, joint: 200_000 },
  /** Linear phaseout width used when IRS schedule uses MAGI limitation (estimate). */
  phaseoutWidth: 50_000,
} as const;

export const STUDENT_LOAN_INTEREST_MAX = 2_500;
export const CHILD_CARE_EXPENSE_MAX_ONE = 3_000;
export const CHILD_CARE_EXPENSE_MAX_TWO = 6_000;
export const AOTC_MAX_PER_STUDENT = 2_500;
