import type { FilingStatus } from './types';

/**
 * Third Economic Impact Payment (EIP3) under the American Rescue Plan Act of
 * 2021 (P.L. 117-2) / I.R.C. §6428B — historical only.
 *
 * Sources: 26 U.S.C. §6428B; IRS Pub. 5514 (4-2021); IRS FS-2022-22;
 * Treasury EIP overview (American Rescue Plan).
 */
export const EIP3_BASE_SINGLE_OR_HOH = 1400;
export const EIP3_BASE_MARRIED = 2800;
export const EIP3_PER_DEPENDENT = 1400;

/** Phase-out start (full payment at or below) and end (zero at or above). */
export const EIP3_PHASEOUT: Record<
  FilingStatus,
  { start: number; end: number; range: number }
> = {
  single: { start: 75_000, end: 80_000, range: 5_000 },
  married: { start: 150_000, end: 160_000, range: 10_000 },
  head_of_household: { start: 112_500, end: 120_000, range: 7_500 },
};

export function formatEip3Usd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Historical EIP3 estimate only — not an active benefit.
 *
 * Rules (verified under §6428B):
 * - Base: $1,400 single / head of household; $2,800 married filing jointly
 * - +$1,400 per qualifying dependent (IRC §152), including adult dependents
 * - Linear phase-out from start→end AGI by filing status; $0 at/above end
 * - Payment floored at $0; rounded to nearest whole USD
 * - Advance payments used 2019 or 2020 return data for most households
 */
export function calculateAmericanRescuePlanStimulus(input: {
  filed2019Or2020Taxes: boolean;
  filingStatus: FilingStatus;
  dependents: number;
  agi: number;
}): {
  paymentUsd: number;
  baseAmount: number;
  dependentAmount: number;
  phaseoutReduction: number;
  phaseoutStart: number;
  phaseoutEnd: number;
  ineligibleNoFiling: boolean;
} | null {
  const { filed2019Or2020Taxes, filingStatus, dependents, agi } = input;

  if (
    !Number.isFinite(dependents) ||
    !Number.isInteger(dependents) ||
    dependents < 0
  ) {
    return null;
  }
  if (!Number.isFinite(agi) || agi < 0) return null;

  const band = EIP3_PHASEOUT[filingStatus];

  if (!filed2019Or2020Taxes) {
    return {
      paymentUsd: 0,
      baseAmount: 0,
      dependentAmount: 0,
      phaseoutReduction: 0,
      phaseoutStart: band.start,
      phaseoutEnd: band.end,
      ineligibleNoFiling: true,
    };
  }

  const baseAmount =
    filingStatus === 'married' ? EIP3_BASE_MARRIED : EIP3_BASE_SINGLE_OR_HOH;
  const dependentAmount = dependents * EIP3_PER_DEPENDENT;
  const gross = baseAmount + dependentAmount;

  let phaseoutReduction = 0;
  if (agi >= band.end) {
    phaseoutReduction = gross;
  } else if (agi > band.start) {
    const excess = agi - band.start;
    phaseoutReduction = (gross * excess) / band.range;
  }

  const paymentUsd = Math.max(0, Math.round(gross - phaseoutReduction));

  return {
    paymentUsd,
    baseAmount,
    dependentAmount,
    phaseoutReduction: Math.round(phaseoutReduction),
    phaseoutStart: band.start,
    phaseoutEnd: band.end,
    ineligibleNoFiling: false,
  };
}
