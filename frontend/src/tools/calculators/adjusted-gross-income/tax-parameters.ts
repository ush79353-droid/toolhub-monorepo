/**
 * US Tax Year 2025 AGI / Schedule 1 parameters (USD).
 *
 * Sources:
 * - IRS Pub. 590-A (2025) — traditional IRA contribution & MAGI phaseouts
 * - IRS Pub. 969 (2025) / Form 8889 — HSA contribution limits
 * - IRS Pub. 970 (2025) — student loan interest deduction & MAGI phaseouts
 * - IRS Schedule 1 / Form 1040 instructions — educator expenses; capital loss limit
 * - Schedule SE — deductible half of self-employment tax (simplified estimate)
 */

export const TAX_YEAR_LABEL = '2025';

/** Traditional IRA annual contribution limit (under age 50). */
export const IRA_LIMIT = 7_000;
/** Traditional IRA catch-up if age 50+. */
export const IRA_CATCH_UP = 1_000;

/** Student loan interest max deduction (§221). */
export const STUDENT_LOAN_MAX = 2_500;
/** Pub. 970 (2025) MAGI phaseout — single / HoH / QSS. */
export const STUDENT_LOAN_PHASE_SINGLE = { start: 85_000, end: 100_000 };
/** Pub. 970 (2025) MAGI phaseout — married filing jointly. */
export const STUDENT_LOAN_PHASE_JOINT = { start: 170_000, end: 200_000 };

/** Educator expense limit (TY 2025). */
export const EDUCATOR_MAX = 300;

/** HSA contribution limits (Pub. 969 / Rev. Proc. for 2025). */
export const HSA_SELF_ONLY = 4_300;
export const HSA_FAMILY = 8_550;
export const HSA_CATCH_UP_55 = 1_000;

/** Net capital loss allowed against other income. */
export const CAPITAL_LOSS_LIMIT = 3_000;
export const CAPITAL_LOSS_LIMIT_MFS = 1_500;

/**
 * Traditional IRA MAGI phaseout when covered by a workplace plan (Pub. 590-A 2025).
 * start inclusive full deduction; end exclusive (at/above end → $0).
 */
export const IRA_PHASEOUT_COVERED = {
  singleOrHoh: { start: 79_000, end: 89_000 },
  jointOrQss: { start: 126_000, end: 146_000 },
  /** Married filing separately who lived with spouse — phaseout $0–$10,000. */
  mfs: { start: 0, end: 10_000 },
} as const;

/** Social Security wage base 2025 (for simplified SE tax estimate). */
export const SS_WAGE_BASE_2025 = 176_100;
export const SE_TAX_RATE = 0.153;
export const SE_NET_EARNINGS_FACTOR = 0.9235;
export const MEDICARE_RATE = 0.029;
export const SS_RATE = 0.124;
