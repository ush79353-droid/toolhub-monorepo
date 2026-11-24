/**
 * Urine protein-to-creatinine ratio (UPCR / PCR) — educational (ADR-018).
 *
 * For matching mass/volume units (both mg/dL after normalization):
 *   UPCR (g/g) = protein_mg_dL / creatinine_mg_dL
 *   UPCR (mg/g) = 1000 × (protein_mg_dL / creatinine_mg_dL)
 *
 * Teaching tools often label the g/g ratio as approximating g/day protein
 * excretion; a spot ratio is not a timed 24-hour collection.
 *
 * Creatinine mmol/L → mg/dL: × 11.3 (same factor as Omni ACR / ACR module).
 * Creatinine g/L → mg/dL: × 100.
 */

import type {
  CreatinineUnit,
  ProteinCreatinineRatioInput,
  ProteinCreatinineRatioResult,
} from './types';

export const SOURCE_NOTE =
  'UPCR (g/g) = urine protein (mg/dL) ÷ urine creatinine (mg/dL); mg/g = 1000 × g/g. Creatinine mmol/L × 11.3 → mg/dL; g/L × 100 → mg/dL. g/day label is a common approximate teaching equivalence for g/g, not a measured 24-hour collection. Distinct from albumin-only ACR. Educational only.';

export const DISCLAIMER =
  'Not a laboratory report, nephrotic-syndrome diagnosis, or treatment plan — confirm with your clinician and clinical lab.';

/** Omni ACR / common: 1 mmol/L creatinine ≈ 11.3 mg/dL. */
export const CREATININE_MMOL_L_TO_MG_DL = 11.3;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function creatinineToMgDl(
  value: number,
  unit: CreatinineUnit,
): number {
  if (unit === 'mmol_l') return value * CREATININE_MMOL_L_TO_MG_DL;
  if (unit === 'g_l') return value * 100;
  return value;
}

/** UPCR in g/g (= protein_mg_dL / creatinine_mg_dL). */
export function upcrGramsPerGram(
  proteinMgDl: number,
  creatinineMgDl: number,
): number {
  if (!(creatinineMgDl > 0)) {
    throw new Error('Creatinine must be positive to compute UPCR.');
  }
  return proteinMgDl / creatinineMgDl;
}

export function formatUpcrGg(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded)
        .replace(/(\.\d*?[1-9])0+$/, '$1')
        .replace(/\.0+$/, '');
}

export function calculateProteinCreatinineRatio(
  input: ProteinCreatinineRatioInput,
): ProteinCreatinineRatioResult {
  const empty = {
    proteinMgDl: null,
    creatinineMgDl: null,
    upcrGg: null,
    upcrMgG: null,
    formattedGg: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const protein = parseNumber(input.proteinText);
  const creatinineRaw = parseNumber(input.creatinineText);

  if (protein === null || creatinineRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter protein and creatinine',
      statusDetail:
        'Enter urine protein (mg/dL) and urine creatinine to compute UPCR (g/g ≈ g/day teaching label).',
    };
  }

  const creatinineMgDl = creatinineToMgDl(
    creatinineRaw,
    input.creatinineUnit,
  );
  const upcrGg = upcrGramsPerGram(protein, creatinineMgDl);
  const upcrMgG = upcrGg * 1000;

  return {
    proteinMgDl: protein,
    creatinineMgDl,
    upcrGg,
    upcrMgG,
    formattedGg: formatUpcrGg(upcrGg),
    statusHeadline: 'Protein creatinine ratio (UPCR)',
    statusDetail: `UPCR ${formatUpcrGg(upcrGg)} g/g (≈ ${formatUpcrGg(upcrGg)} g/day teaching label) · ${formatUpcrGg(upcrMgG)} mg/g. Spot sample — not a timed 24-hour collection.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
