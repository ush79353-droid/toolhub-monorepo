import type { FilingStatus } from './types';

/**
 * First Economic Impact Payment (EIP1) under the CARES Act
 * (P.L. 116-136) / I.R.C. §6428 — historical only.
 *
 * Sources: 26 U.S.C. §6428; CRS IN11355; IRS Economic Impact Payments overview;
 * CARES Act §2201.
 */
export const EIP1_BASE_SINGLE_OR_HOH = 1200;
export const EIP1_BASE_MARRIED = 2400;
export const EIP1_PER_QUALIFYING_CHILD = 500;
export const EIP1_PHASEOUT_RATE = 0.05;

export const EIP1_PHASEOUT_THRESHOLD: Record<FilingStatus, number> = {
  single: 75_000,
  married: 150_000,
  head_of_household: 112_500,
};

export function formatEip1Usd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Historical EIP1 estimate only — not an active benefit.
 *
 * Rules (verified):
 * - Base: $1,200 single / head of household; $2,400 married filing jointly
 * - +$500 per qualifying child under 17 (IRC §24(c)); no adult-dependent add-on
 * - Phase out at 5% of AGI above $75k / $112.5k / $150k (single / HoH / joint)
 * - Payment floored at $0
 * - Advance payments used 2019 return data for most households
 */
export function calculateStimulusCheck(input: {
  filed2019Taxes: boolean;
  filingStatus: FilingStatus;
  kids: number;
  agi: number;
}): {
  paymentUsd: number;
  baseAmount: number;
  childAmount: number;
  phaseoutReduction: number;
  phaseoutThreshold: number;
  ineligibleNoFiling: boolean;
} | null {
  const { filed2019Taxes, filingStatus, kids, agi } = input;

  if (!Number.isFinite(kids) || !Number.isInteger(kids) || kids < 0) {
    return null;
  }
  if (!Number.isFinite(agi) || agi < 0) return null;

  if (!filed2019Taxes) {
    return {
      paymentUsd: 0,
      baseAmount: 0,
      childAmount: 0,
      phaseoutReduction: 0,
      phaseoutThreshold: EIP1_PHASEOUT_THRESHOLD[filingStatus],
      ineligibleNoFiling: true,
    };
  }

  const baseAmount =
    filingStatus === 'married' ? EIP1_BASE_MARRIED : EIP1_BASE_SINGLE_OR_HOH;
  const childAmount = kids * EIP1_PER_QUALIFYING_CHILD;
  const gross = baseAmount + childAmount;
  const phaseoutThreshold = EIP1_PHASEOUT_THRESHOLD[filingStatus];
  const excess = Math.max(0, agi - phaseoutThreshold);
  const phaseoutReduction = EIP1_PHASEOUT_RATE * excess;
  const paymentUsd = Math.max(0, Math.round(gross - phaseoutReduction));

  if (![paymentUsd, baseAmount, childAmount, phaseoutReduction].every(Number.isFinite)) {
    return null;
  }

  return {
    paymentUsd,
    baseAmount,
    childAmount,
    phaseoutReduction: Math.round(phaseoutReduction),
    phaseoutThreshold,
    ineligibleNoFiling: false,
  };
}
