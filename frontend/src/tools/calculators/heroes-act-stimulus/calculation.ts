import type { FilingStatus } from './types';

/**
 * Verified HEROES Act (H.R. 6800, House-passed May 15, 2020) recovery-rebate
 * constants — USD. Sources: CRS IN11513 comparison of second-round proposals;
 * CRS summary of H.R. 6800 direct payments.
 */
export const HEROES_BASE_SINGLE_OR_HOH = 1200;
export const HEROES_BASE_MARRIED = 2400;
export const HEROES_PER_DEPENDENT = 1200;
export const HEROES_MAX_DEPENDENTS = 3;
export const HEROES_PHASEOUT_RATE = 0.05;

export const HEROES_PHASEOUT_THRESHOLD: Record<FilingStatus, number> = {
  single: 75_000,
  married: 150_000,
  head_of_household: 112_500,
};

export function formatHeroesUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Historical HEROES Act additional recovery-rebate estimate (never enacted).
 *
 * Verified rules (CRS IN11513 / H.R. 6800 summaries):
 * - Base: $1,200 single / head of household; $2,400 married filing jointly
 * - +$1,200 per dependent (qualifying children and relatives under IRC §152),
 *   capped at three dependents (household maximum $6,000 for a joint return)
 * - Phase out at 5% of AGI above $75k / $112.5k / $150k (single / HoH / joint)
 * - Payment floored at $0
 *
 * Distinct from CARES Act ($500 under-17 child only) and from later enacted
 * Economic Impact Payments. Not a claimable benefit today.
 */
export function calculateHeroesStimulusPayment(input: {
  filingStatus: FilingStatus;
  dependents: number;
  agi: number;
}): {
  paymentUsd: number;
  baseAmount: number;
  dependentAmount: number;
  eligibleDependents: number;
  phaseoutReduction: number;
  phaseoutThreshold: number;
} | null {
  const { filingStatus, dependents, agi } = input;

  if (!Number.isFinite(dependents) || !Number.isInteger(dependents) || dependents < 0) {
    return null;
  }
  if (!Number.isFinite(agi) || agi < 0) return null;

  const baseAmount =
    filingStatus === 'married' ? HEROES_BASE_MARRIED : HEROES_BASE_SINGLE_OR_HOH;
  const eligibleDependents = Math.min(dependents, HEROES_MAX_DEPENDENTS);
  const dependentAmount = eligibleDependents * HEROES_PER_DEPENDENT;
  const gross = baseAmount + dependentAmount;
  const phaseoutThreshold = HEROES_PHASEOUT_THRESHOLD[filingStatus];
  const excess = Math.max(0, agi - phaseoutThreshold);
  const phaseoutReduction = HEROES_PHASEOUT_RATE * excess;
  const paymentUsd = Math.max(0, Math.round(gross - phaseoutReduction));

  return {
    paymentUsd,
    baseAmount,
    dependentAmount,
    eligibleDependents,
    phaseoutReduction: Math.round(phaseoutReduction),
    phaseoutThreshold,
  };
}
