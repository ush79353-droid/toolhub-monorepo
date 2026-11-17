import type { FilingStatus } from './types';

/** Verified HEALS Act (July 2020 Senate GOP proposal) rebate constants — USD. */
export const HEALS_BASE_SINGLE_OR_HOH = 1200;
export const HEALS_BASE_MARRIED = 2400;
export const HEALS_PER_DEPENDENT = 500;
export const HEALS_PHASEOUT_RATE = 0.05;

export const HEALS_PHASEOUT_THRESHOLD: Record<FilingStatus, number> = {
  single: 75_000,
  married: 150_000,
  head_of_household: 112_500,
};

export function formatHealsUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Historical HEALS Act recovery-rebate estimate (never enacted as proposed).
 *
 * Verified rules (Senate Finance section-by-section + contemporaneous reporting):
 * - Base: $1,200 single / head of household; $2,400 married filing jointly
 * - +$500 per dependent of any age (no dependent cap; unlike CARES under-17 limit)
 * - Phase out at 5% of AGI above $75k / $112.5k / $150k (single / HoH / joint)
 * - Payment floored at $0
 *
 * Sources: finance.senate.gov SFC CARES 2.0 section-by-section; Tax Foundation;
 * CNBC (2020-07-28).
 */
export function calculateHealsStimulusPayment(input: {
  filed2019Taxes: boolean;
  filingStatus: FilingStatus;
  dependents: number;
  agi: number;
}): {
  paymentUsd: number;
  baseAmount: number;
  dependentAmount: number;
  phaseoutReduction: number;
  phaseoutThreshold: number;
  ineligibleNoFiling: boolean;
} | null {
  const { filed2019Taxes, filingStatus, dependents, agi } = input;

  if (!Number.isFinite(dependents) || !Number.isInteger(dependents) || dependents < 0) {
    return null;
  }
  if (!Number.isFinite(agi) || agi < 0) return null;

  if (!filed2019Taxes) {
    return {
      paymentUsd: 0,
      baseAmount: 0,
      dependentAmount: 0,
      phaseoutReduction: 0,
      phaseoutThreshold: HEALS_PHASEOUT_THRESHOLD[filingStatus],
      ineligibleNoFiling: true,
    };
  }

  const baseAmount =
    filingStatus === 'married' ? HEALS_BASE_MARRIED : HEALS_BASE_SINGLE_OR_HOH;
  const dependentAmount = dependents * HEALS_PER_DEPENDENT;
  const gross = baseAmount + dependentAmount;
  const phaseoutThreshold = HEALS_PHASEOUT_THRESHOLD[filingStatus];
  const excess = Math.max(0, agi - phaseoutThreshold);
  const phaseoutReduction = HEALS_PHASEOUT_RATE * excess;
  const paymentUsd = Math.max(0, Math.round(gross - phaseoutReduction));

  return {
    paymentUsd,
    baseAmount,
    dependentAmount,
    phaseoutReduction: Math.round(phaseoutReduction),
    phaseoutThreshold,
    ineligibleNoFiling: false,
  };
}
