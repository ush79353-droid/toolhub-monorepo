/**
 * Mentzer index — educational hematology arithmetic (ADR-018).
 *
 * Mentzer Index = MCV (fL) ÷ RBC (millions/µL).
 * million/mm³ and ×10¹²/L are numerically identical to millions/µL for this index.
 *
 * Teaching cutoff (Mentzer 1973 / standard summaries):
 *   < 13 → favors β-thalassemia trait
 *   > 13 → favors iron-deficiency anemia
 *   = 13 → borderline
 *
 * Sources: Mentzer WC. Differentiation of iron deficiency from thalassaemia
 * trait. Lancet. 1973;1(7808):882. Screening aid only — not diagnostic.
 */

import type {
  MentzerBand,
  MentzerIndexInput,
  MentzerIndexResult,
} from './types';

/** Classic Mentzer teaching cutoff. */
export const MENTZER_CUTOFF = 13;

export const SOURCE_NOTE =
  'Mentzer index = MCV (fL) ÷ RBC (millions/µL; ≡ million/mm³ ≡ ×10¹²/L). Mentzer WC, Lancet 1973; teaching cutoff 13. Educational screening aid only.';

export const DISCLAIMER =
  'Educational hematology calculator — not a diagnosis, treatment decision, or laboratory report. Confirm with iron studies and hemoglobin analysis when indicated.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * Mentzer index = MCV / RBC (million-scale count).
 * @throws when RBC ≤ 0 or either value is non-finite.
 */
export function mentzerIndex(mcvFl: number, rbcMillions: number): number {
  if (!(Number.isFinite(rbcMillions) && rbcMillions > 0)) {
    throw new Error('RBC must be greater than zero.');
  }
  if (!Number.isFinite(mcvFl)) {
    throw new Error('MCV must be finite.');
  }
  return mcvFl / rbcMillions;
}

export function mentzerBand(index: number): MentzerBand {
  if (index < MENTZER_CUTOFF) return 'thalassemia_trait_favored';
  if (index > MENTZER_CUTOFF) return 'iron_deficiency_favored';
  return 'borderline';
}

export function formatIndex(index: number): string {
  if (!Number.isFinite(index)) return '';
  const rounded = Math.round(index * 100) / 100;
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace(/\.?0+$/, '');
}

function bandDetail(band: MentzerBand, formatted: string): string {
  switch (band) {
    case 'thalassemia_trait_favored':
      return `Mentzer index ${formatted} is below ${MENTZER_CUTOFF}, which teaching sources say favors β-thalassemia trait over iron deficiency. Screening only — not a diagnosis.`;
    case 'iron_deficiency_favored':
      return `Mentzer index ${formatted} is above ${MENTZER_CUTOFF}, which teaching sources say favors iron-deficiency anemia over β-thalassemia trait. Screening only — not a diagnosis.`;
    case 'borderline':
      return `Mentzer index ${formatted} equals the teaching cutoff of ${MENTZER_CUTOFF} and is borderline. Confirm with iron studies and hemoglobin analysis when indicated.`;
  }
}

export function calculateMentzerIndex(
  input: MentzerIndexInput,
): MentzerIndexResult {
  const mcv = parseNumber(input.mcvFlText);
  const rbc = parseNumber(input.rbcText);

  // rbcUnit is a denomination label only — million/mm³ ≡ million/µL ≡ ×10¹²/L.
  void input.rbcUnit;

  if (mcv === null || rbc === null) {
    return {
      index: null,
      formattedIndex: '',
      band: null,
      statusHeadline: 'Enter MCV and RBC',
      statusDetail:
        'Enter mean corpuscular volume (fL) and red blood cell count (million-scale) to compute the Mentzer index.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const index = mentzerIndex(mcv, rbc);
  const band = mentzerBand(index);
  const formatted = formatIndex(index);

  return {
    index,
    formattedIndex: formatted,
    band,
    statusHeadline: 'Mentzer index',
    statusDetail: bandDetail(band, formatted),
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
