import type { FilingStatus } from './types';

/** CASH Act of 2020 (H.R.9051) proposed second-round rebate — USD. */
export const CASH_BASE_SINGLE_OR_HOH = 2000;
export const CASH_BASE_MARRIED = 4000;
export const CASH_PER_DEPENDENT = 2000;

/** Enacted COVID-related Tax Relief Act of 2020 second EIP — USD. */
export const ENACTED_BASE_SINGLE_OR_HOH = 600;
export const ENACTED_BASE_MARRIED = 1200;
export const ENACTED_PER_QUALIFYING_CHILD = 600;

export const PHASEOUT_RATE = 0.05;

export const PHASEOUT_THRESHOLD: Record<FilingStatus, number> = {
  single: 75_000,
  married: 150_000,
  head_of_household: 112_500,
};

export function formatCashActUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function phaseOutPayment(gross: number, agi: number, filingStatus: FilingStatus): {
  paymentUsd: number;
  phaseoutReduction: number;
  phaseoutThreshold: number;
} {
  const phaseoutThreshold = PHASEOUT_THRESHOLD[filingStatus];
  const excess = Math.max(0, agi - phaseoutThreshold);
  const phaseoutReduction = PHASEOUT_RATE * excess;
  const paymentUsd = Math.max(0, Math.round(gross - phaseoutReduction));
  return {
    paymentUsd,
    phaseoutReduction: Math.round(phaseoutReduction),
    phaseoutThreshold,
  };
}

/**
 * Historical CASH Act (H.R.9051, Dec 2020) vs enacted $600 second EIP.
 *
 * Verified CASH Act amendments to IRC §6428A:
 * - Replace $600 → $2,000 and $1,200 → $4,000 (adults)
 * - Dependent amount becomes $2,000 and expands from qualifying children under 17
 *   to dependents under IRC §152 (any age)
 * - Same 5% AGI phase-out above $75k / $112.5k / $150k
 *
 * Enacted comparison (COVID-related Tax Relief Act of 2020):
 * - $600 / $1,200 base + $600 per qualifying child under 17
 * - Same phase-out thresholds and rate
 *
 * Sources: congress.gov H.R.9051 text; CRS IN11575; Omnicalculator cash-act-2020 summary.
 */
export function calculateCashActStimulus(input: {
  filed2019Taxes: boolean;
  filingStatus: FilingStatus;
  dependents: number;
  dependentsUnder17: number | null;
  agi: number;
}): {
  paymentUsd: number;
  baseAmount: number;
  dependentAmount: number;
  phaseoutReduction: number;
  phaseoutThreshold: number;
  enactedPaymentUsd: number;
  additionalUsd: number;
  ineligibleNoFiling: boolean;
  hasAdditionalComparison: boolean;
} | null {
  const { filed2019Taxes, filingStatus, dependents, dependentsUnder17, agi } = input;

  if (!Number.isFinite(dependents) || !Number.isInteger(dependents) || dependents < 0) {
    return null;
  }
  if (
    dependentsUnder17 !== null &&
    (!Number.isFinite(dependentsUnder17) ||
      !Number.isInteger(dependentsUnder17) ||
      dependentsUnder17 < 0 ||
      dependentsUnder17 > dependents)
  ) {
    return null;
  }
  if (!Number.isFinite(agi) || agi < 0) return null;

  if (!filed2019Taxes) {
    return {
      paymentUsd: 0,
      baseAmount: 0,
      dependentAmount: 0,
      phaseoutReduction: 0,
      phaseoutThreshold: PHASEOUT_THRESHOLD[filingStatus],
      enactedPaymentUsd: 0,
      additionalUsd: 0,
      ineligibleNoFiling: true,
      hasAdditionalComparison: dependentsUnder17 !== null,
    };
  }

  const baseAmount =
    filingStatus === 'married' ? CASH_BASE_MARRIED : CASH_BASE_SINGLE_OR_HOH;
  const dependentAmount = dependents * CASH_PER_DEPENDENT;
  const cash = phaseOutPayment(baseAmount + dependentAmount, agi, filingStatus);

  let enactedPaymentUsd = 0;
  let hasAdditionalComparison = false;
  let additionalUsd = 0;

  if (dependentsUnder17 !== null) {
    hasAdditionalComparison = true;
    const enactedBase =
      filingStatus === 'married' ? ENACTED_BASE_MARRIED : ENACTED_BASE_SINGLE_OR_HOH;
    const enactedGross =
      enactedBase + dependentsUnder17 * ENACTED_PER_QUALIFYING_CHILD;
    enactedPaymentUsd = phaseOutPayment(enactedGross, agi, filingStatus).paymentUsd;
    additionalUsd = Math.max(0, cash.paymentUsd - enactedPaymentUsd);
  }

  return {
    paymentUsd: cash.paymentUsd,
    baseAmount,
    dependentAmount,
    phaseoutReduction: cash.phaseoutReduction,
    phaseoutThreshold: cash.phaseoutThreshold,
    enactedPaymentUsd,
    additionalUsd,
    ineligibleNoFiling: false,
    hasAdditionalComparison,
  };
}
