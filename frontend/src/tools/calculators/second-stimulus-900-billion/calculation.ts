import type { FilingStatus } from './types';

/**
 * Second Economic Impact Payment (EIP2) under the Consolidated Appropriations
 * Act, 2021 (P.L. 116-260) / I.R.C. §6428A — historical only.
 *
 * Sources: 26 U.S.C. §6428A; IRS Pub. 5475 (12-2020); CRS IN11575;
 * Treasury press release SM1224 (2020-12-29).
 */
export const EIP2_BASE_SINGLE_OR_HOH = 600;
export const EIP2_BASE_MARRIED = 1200;
export const EIP2_PER_QUALIFYING_CHILD = 600;
export const EIP2_PHASEOUT_RATE = 0.05;

export const EIP2_PHASEOUT_THRESHOLD: Record<FilingStatus, number> = {
  single: 75_000,
  married: 150_000,
  head_of_household: 112_500,
};

export function formatEip2Usd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Historical EIP2 estimate only — not an active benefit.
 *
 * Rules (verified):
 * - Base: $600 single / head of household; $1,200 married filing jointly
 * - +$600 per qualifying child under 17 (IRC §24(c)); no adult-dependent add-on
 * - Phase out at 5% of AGI above $75k / $112.5k / $150k (single / HoH / joint)
 * - Payment floored at $0
 * - Advance payments used 2019 return data for most households
 */
export function calculateSecondStimulus900Billion(input: {
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
      phaseoutThreshold: EIP2_PHASEOUT_THRESHOLD[filingStatus],
      ineligibleNoFiling: true,
    };
  }

  const baseAmount =
    filingStatus === 'married' ? EIP2_BASE_MARRIED : EIP2_BASE_SINGLE_OR_HOH;
  const childAmount = kids * EIP2_PER_QUALIFYING_CHILD;
  const gross = baseAmount + childAmount;
  const phaseoutThreshold = EIP2_PHASEOUT_THRESHOLD[filingStatus];
  const excess = Math.max(0, agi - phaseoutThreshold);
  const phaseoutReduction = EIP2_PHASEOUT_RATE * excess;
  const paymentUsd = Math.max(0, Math.round(gross - phaseoutReduction));

  return {
    paymentUsd,
    baseAmount,
    childAmount,
    phaseoutReduction: Math.round(phaseoutReduction),
    phaseoutThreshold,
    ineligibleNoFiling: false,
  };
}
