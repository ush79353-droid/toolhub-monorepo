/**
 * Drug half-life — UI stub (ADR-019 commit 1).
 * Real first-order elimination engine lands in the engine commit.
 */

import type { DrugHalfLifeInput, DrugHalfLifeResult } from './types';

export const SOURCE_NOTE =
  'First-order elimination: remaining mass = A₀ × 0.5^(t / t½). Educational pharmacokinetics arithmetic — not individualized clinical PK.';

export const DISCLAIMER =
  'Educational estimate only. Does not account for multi-compartment kinetics, active metabolites, renal/hepatic impairment, accumulation, or drug interactions. Not a substitute for clinical judgment or laboratory monitoring.';

export const ASSUMPTIONS =
  'Assumes single-compartment first-order elimination with a constant half-life after a single bolus. No absorption delay, redistribution, or saturation (Michaelis–Menten) kinetics.';

export function parsePositiveNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateDrugHalfLife(_input: DrugHalfLifeInput): DrugHalfLifeResult {
  return {
    cycles: [],
    timeUnit: 'min',
    dosageUnit: 'mg',
    statusHeadline: 'Enter half-life and dosage',
    statusDetail:
      'Provide a positive half-life and initial dosage to see remaining mass over successive half-life cycles.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    assumptions: ASSUMPTIONS,
  };
}
