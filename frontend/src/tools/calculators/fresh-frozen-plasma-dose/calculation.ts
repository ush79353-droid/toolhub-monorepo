/**
 * Fresh Frozen Plasma Dose Calculator — UI stub (ADR-019 commit 1).
 * Engine formulas land in the subsequent engine commit.
 */

import type {
  FreshFrozenPlasmaDoseInput,
  FreshFrozenPlasmaDoseResult,
} from './types';

export const SOURCE_NOTE =
  'AABB Circular of Information: standard plasma dose ~15 mL/kg; pediatric plasma 10–15 mL/kg; typical FFP unit ~200–250 mL (label volume).';

export const DISCLAIMER =
  'Always double-check the calculations with another source, and the dosing information and contraindications according to the current guidelines. Consult a health provider before administering any medication. This tool cannot replace real medical assessment.';

export const ASSUMPTIONS =
  'Educational arithmetic only: total mL = weight(kg) × dose(mL/kg); equivalent units = total ÷ unit volume. Fractional units are not a blood-bank issue order.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** UI stub — returns empty result shell until the engine commit. */
export function calculateFreshFrozenPlasmaDose(
  _input: FreshFrozenPlasmaDoseInput,
): FreshFrozenPlasmaDoseResult {
  return {
    totalPlasmaDoseMl: null,
    equivalentUnits: null,
    weightKg: null,
    doseMlPerKg: null,
    unitVolumeMl: null,
    statusHeadline: 'Enter patient weight',
    statusDetail:
      'Provide weight to compute total plasma volume and equivalent units from the ordered mL/kg dose.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    assumptions: ASSUMPTIONS,
  };
}
