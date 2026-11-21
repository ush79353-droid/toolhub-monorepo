/**
 * IRS Roth IRA contribution limits and MAGI phase-outs — tax year 2026.
 * Sources: IRS Notice 2025-67; IRS Pub 590-A (2026); IR-2025-111.
 * Dollar figures are statutory USD amounts. This calculator treats MAGI as
 * entered in the same unit as those thresholds (denomination labeling only).
 */

export const ROTH_RULE_YEAR = 2026 as const;

export const ROTH_BASE_LIMIT_USD = 7500;
export const ROTH_CATCH_UP_USD = 1100;
export const ROTH_CATCH_UP_AGE = 50;

export type RothFilingStatus =
  | 'single'
  | 'married_joint'
  | 'married_separate';

export interface RothPhaseOutRange {
  fullBelow: number;
  zeroAtOrAbove: number;
}

/** MAGI phase-out starts at fullBelow; contribution is $0 at zeroAtOrAbove. */
export const ROTH_PHASE_OUT_2026: Record<RothFilingStatus, RothPhaseOutRange> =
  {
    single: { fullBelow: 153_000, zeroAtOrAbove: 168_000 },
    married_joint: { fullBelow: 242_000, zeroAtOrAbove: 252_000 },
    married_separate: { fullBelow: 0, zeroAtOrAbove: 10_000 },
  };

export function rothAnnualLimitUsd(ageAtYearEnd: number): number {
  if (!Number.isFinite(ageAtYearEnd) || ageAtYearEnd < 0) {
    return ROTH_BASE_LIMIT_USD;
  }
  return ageAtYearEnd >= ROTH_CATCH_UP_AGE
    ? ROTH_BASE_LIMIT_USD + ROTH_CATCH_UP_USD
    : ROTH_BASE_LIMIT_USD;
}

/**
 * IRS reduced Roth limit: phase-out fraction × annual limit, then round up
 * to the next $10 (Pub 590-A worksheet convention).
 */
export function eligibleRothContributionUsd(
  magi: number,
  filingStatus: RothFilingStatus,
  ageAtYearEnd: number
): { maxContribution: number; eligible: number; phaseOutPercent: number } {
  const maxContribution = rothAnnualLimitUsd(ageAtYearEnd);
  const range = ROTH_PHASE_OUT_2026[filingStatus];
  const width = range.zeroAtOrAbove - range.fullBelow;

  if (!(magi >= 0) || !Number.isFinite(magi)) {
    return { maxContribution, eligible: 0, phaseOutPercent: 100 };
  }

  if (magi < range.fullBelow) {
    return { maxContribution, eligible: maxContribution, phaseOutPercent: 0 };
  }
  if (magi >= range.zeroAtOrAbove || width <= 0) {
    return { maxContribution, eligible: 0, phaseOutPercent: 100 };
  }

  const remaining = range.zeroAtOrAbove - magi;
  const raw = (maxContribution * remaining) / width;
  // Round up to next $10; if already multiple of 10, keep.
  const eligible =
    raw <= 0 ? 0 : Math.ceil(raw / 10 - 1e-12) * 10;
  const capped = Math.min(maxContribution, Math.max(0, eligible));
  const phaseOutPercent =
    ((magi - range.fullBelow) / width) * 100;
  return {
    maxContribution,
    eligible: capped,
    phaseOutPercent: Math.min(100, Math.max(0, phaseOutPercent)),
  };
}
