import type { FilingStatus } from './types';

/** HEROES Act (H.R. 6800) base payment — verified CRS comparison of second-round proposals. */
export const BASE_PAYMENT_SINGLE_USD = 1200;
export const BASE_PAYMENT_MARRIED_USD = 2400;
/** HEROES Act dependent add-on, capped at three dependents. */
export const DEPENDENT_PAYMENT_USD = 1200;
export const MAX_DEPENDENTS = 3;

/**
 * McConnell (2020-07-06) publicly floated a ~$40,000 income cut-off for a second
 * round. The named “40k Cap” calculator model doubles that for married joint
 * filers ($80,000). Head of household uses the same $40,000 single-style cap
 * because no separate HoH threshold was stated for the 40k idea.
 */
export const INCOME_CAP_SINGLE_USD = 40_000;
export const INCOME_CAP_MARRIED_USD = 80_000;

/**
 * Phase-out for a hard $40k regime was never specified in legislation.
 * This historical model uses a hard cut-off: AGI at or below the cap → full
 * HEROES payment; above the cap → $0. Do not invent a 5% phase-out here.
 */

export function incomeCapForFilingStatus(status: FilingStatus): number {
  return status === 'married' ? INCOME_CAP_MARRIED_USD : INCOME_CAP_SINGLE_USD;
}

export function basePaymentForFilingStatus(status: FilingStatus): number {
  return status === 'married' ? BASE_PAYMENT_MARRIED_USD : BASE_PAYMENT_SINGLE_USD;
}

export function formatStimulusUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Historical / hypothetical estimate only — not an active benefit.
 * Returns null when inputs are incomplete or non-finite.
 */
export function calculateStimulusCheck40k(input: {
  filingStatus: FilingStatus;
  dependents: number;
  incomeAgi: number;
}): {
  paymentUsd: number;
  incomeCapUsd: number;
  eligibleDependents: number;
  basePaymentUsd: number;
  dependentPaymentUsd: number;
  isEligible: boolean;
} | null {
  const { filingStatus, dependents, incomeAgi } = input;

  if (!Number.isFinite(dependents) || !Number.isInteger(dependents) || dependents < 0) {
    return null;
  }
  if (!Number.isFinite(incomeAgi) || incomeAgi < 0) {
    return null;
  }

  const incomeCapUsd = incomeCapForFilingStatus(filingStatus);
  const basePaymentUsd = basePaymentForFilingStatus(filingStatus);
  const eligibleDependents = Math.min(dependents, MAX_DEPENDENTS);
  const dependentPaymentUsd = eligibleDependents * DEPENDENT_PAYMENT_USD;
  const fullPayment = basePaymentUsd + dependentPaymentUsd;
  const isEligible = incomeAgi <= incomeCapUsd;
  const paymentUsd = isEligible ? fullPayment : 0;

  return {
    paymentUsd,
    incomeCapUsd,
    eligibleDependents,
    basePaymentUsd,
    dependentPaymentUsd,
    isEligible,
  };
}
