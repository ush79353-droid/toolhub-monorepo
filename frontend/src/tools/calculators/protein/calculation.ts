/**
 * Protein Calculator — UI stub (engine commit replaces with formulas).
 * ADR-018: pure module; no React/HTTP/Mongo. No FX.
 */

import type { ProteinInput, ProteinResult } from './types';

/** Re-exported Atwater factor — shared with IIFYM/macro helpers. */
export { KCAL_PER_G_PROTEIN } from '../iifym/calculation';

/** Adult AMDR protein energy shares (IOM Dietary Reference Intakes). */
export { PROTEIN_SHARE } from '../iifym/types';

export const SOURCE_NOTE =
  'IOM RDA protein g/kg by life stage; IOM AMDR protein 10–35% of energy at 4 kcal/g; optional Mifflin–St Jeor × PAL; sport bands from ACSM/AND/DC position-stand teaching ranges.';

export const DISCLAIMER =
  'Educational nutrition arithmetic from published IOM/AMDR and ACSM guidance — not individualized medical nutrition therapy.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function emptyResult(partial?: Partial<ProteinResult>): ProteinResult {
  return {
    totalKcalPerDay: null,
    tdeeFromProfile: null,
    tdeeSource: null,
    weightKg: null,
    rdaGPerKg: null,
    rdaGramsPerDay: null,
    amdrRows: [],
    sportBand: null,
    statusHeadline: 'Enter profile or calories',
    statusDetail:
      'Fill weight (and age for the IOM g/kg RDA), or enter calories for AMDR protein grams. Switch to Recommendations for sport for ACSM g/kg bands.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

/** Stub — real protein math lands in the engine commit. */
export function calculateProtein(_input: ProteinInput): ProteinResult {
  return emptyResult();
}
