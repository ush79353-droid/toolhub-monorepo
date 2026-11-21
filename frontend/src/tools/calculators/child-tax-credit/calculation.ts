import type { FilingStatus } from './types';

/**
 * U.S. Child Tax Credit — tax year 2025 (educational estimate).
 *
 * Sources:
 * - IRS Child Tax Credit overview (irs.gov/credits-deductions/individuals/child-tax-credit)
 * - 2025 Schedule 8812 (Form 1040): $2,200 × qualifying children under 17;
 *   phaseout start $400,000 MFJ / $200,000 all other statuses;
 *   reduction $50 per $1,000 (or fraction) of MAGI above the threshold
 * - Rev. Proc. 2024-40 §2.05: ACTC refundable amount $1,700 (not computed here —
 *   earned income / tax liability required)
 *
 * Age rule: finished years 0–16 = under age 17 at year-end.
 * Does not invent residency, SSN, support, relationship, or earned-income facts.
 */

export const CTC_TAX_YEAR = 2025 as const;
export const CTC_PER_QUALIFYING_CHILD = 2_200;
export const CTC_PHASEOUT_PER_STEP = 50;
export const CTC_PHASEOUT_STEP = 1_000;

export const CTC_PHASEOUT_THRESHOLD: Record<FilingStatus, number> = {
  single: 200_000,
  head_of_household: 200_000,
  joint: 400_000,
};

/** Qualifying CTC age: under 17 at year-end → finished years 0–16 inclusive. */
export function isQualifyingChildAge(ageYears: number): boolean {
  return Number.isInteger(ageYears) && ageYears >= 0 && ageYears <= 16;
}

export function formatCtcUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Estimate CTC after income phaseout only.
 * Returns null for non-finite / invalid inputs.
 */
export function calculateChildTaxCredit(input: {
  filingStatus: FilingStatus;
  agi: number;
  childAges: readonly (number | null)[];
}): {
  eligibleChildren: number;
  maxCreditBeforePhaseout: number;
  phaseoutThreshold: number;
  phaseoutReduction: number;
  estimatedCredit: number;
} | null {
  const { filingStatus, agi, childAges } = input;
  if (!Number.isFinite(agi) || agi < 0) return null;

  let eligibleChildren = 0;
  for (const age of childAges) {
    if (age === null) continue;
    if (!Number.isFinite(age) || !Number.isInteger(age) || age < 0 || age > 120) {
      return null;
    }
    if (isQualifyingChildAge(age)) eligibleChildren += 1;
  }

  const maxCreditBeforePhaseout = eligibleChildren * CTC_PER_QUALIFYING_CHILD;
  const phaseoutThreshold = CTC_PHASEOUT_THRESHOLD[filingStatus];
  const excess = Math.max(0, agi - phaseoutThreshold);
  const steps = excess > 0 ? Math.ceil(excess / CTC_PHASEOUT_STEP) : 0;
  const phaseoutReduction = Math.min(
    maxCreditBeforePhaseout,
    steps * CTC_PHASEOUT_PER_STEP
  );
  const estimatedCredit = Math.max(0, maxCreditBeforePhaseout - phaseoutReduction);

  if (
    ![
      eligibleChildren,
      maxCreditBeforePhaseout,
      phaseoutThreshold,
      phaseoutReduction,
      estimatedCredit,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    eligibleChildren,
    maxCreditBeforePhaseout,
    phaseoutThreshold,
    phaseoutReduction,
    estimatedCredit,
  };
}
