/**
 * RBC indices (MCH / MCHC / MCV) — educational (ADR-018).
 *
 * MCH (pg/cell)  = 10 × Hb(g/dL) / RBC(10⁶/µL)
 * MCHC (g/dL)    = 100 × Hb(g/dL) / Hct(%)
 * MCV (fL)       = 10 × Hct(%) / RBC(10⁶/µL)
 *
 * Fixture: Hb 15 / Hct 45 / RBC 5 → MCH 30, MCHC 33.33, MCV 90.
 * Sex is for presentation/reference labeling only — formulas are sex-independent.
 */

import type { RbcIndicesInput, RbcIndicesResult } from './types';

export const SOURCE_NOTE =
  'MCH = 10×Hb/RBC (pg/cell); MCHC = 100×Hb/Hct (g/dL); MCV = 10×Hct/RBC (fL). Hb g/dL, Hct %, RBC ×10⁶/µL (million cells/µL).';

export const DISCLAIMER =
  'Not a lab report or diagnosis — confirm with your clinician and local reference intervals.';

/** Common adult teaching intervals (sex-independent for these indices). */
export const REF_MCH_PG = { low: 27, high: 31 };
export const REF_MCHC_G_DL = { low: 32, high: 36 };
export const REF_MCV_FL = { low: 80, high: 100 };

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function meanCorpuscularHemoglobin(
  hemoglobinGDl: number,
  rbcMillionPerUL: number,
): number {
  return (10 * hemoglobinGDl) / rbcMillionPerUL;
}

export function meanCorpuscularHemoglobinConcentration(
  hemoglobinGDl: number,
  hematocritPct: number,
): number {
  return (100 * hemoglobinGDl) / hematocritPct;
}

export function meanCorpuscularVolume(
  hematocritPct: number,
  rbcMillionPerUL: number,
): number {
  return (10 * hematocritPct) / rbcMillionPerUL;
}

export function formatIndex(value: number | null, digits: number): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(value);
}

function roundTo(value: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function calculateRbcIndices(
  input: RbcIndicesInput,
): RbcIndicesResult {
  const empty = {
    hemoglobinGDl: null,
    hematocritPct: null,
    rbcMillionPerUL: null,
    mchPg: null,
    mchcGDl: null,
    mcvFl: null,
    formattedMch: '',
    formattedMchc: '',
    formattedMcv: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const hb = parseNumber(input.hemoglobinText);
  const hct = parseNumber(input.hematocritText);
  const rbc = parseNumber(input.rbcText);

  if (hb === null || hct === null || rbc === null) {
    return {
      ...empty,
      statusHeadline: 'Enter hemoglobin, hematocrit, and RBC count',
      statusDetail:
        'Provide Hb (g/dL), Hct (%), and RBC (million cells/µL) to compute MCH, MCHC, and MCV.',
    };
  }

  if (!(hb > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid hemoglobin',
      statusDetail: 'Hemoglobin must be greater than zero.',
    };
  }
  if (!(hct > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid hematocrit',
      statusDetail: 'Hematocrit must be greater than zero.',
    };
  }
  if (!(rbc > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid RBC count',
      statusDetail: 'RBC count must be greater than zero.',
    };
  }

  const mchRaw = meanCorpuscularHemoglobin(hb, rbc);
  const mchcRaw = meanCorpuscularHemoglobinConcentration(hb, hct);
  const mcvRaw = meanCorpuscularVolume(hct, rbc);

  const mchPg = roundTo(mchRaw, 2);
  const mchcGDl = roundTo(mchcRaw, 2);
  const mcvFl = roundTo(mcvRaw, 2);

  const sexLabel = input.sex === 'female' ? 'Female' : 'Male';

  return {
    hemoglobinGDl: hb,
    hematocritPct: hct,
    rbcMillionPerUL: rbc,
    mchPg,
    mchcGDl,
    mcvFl,
    formattedMch: formatIndex(mchPg, 2),
    formattedMchc: formatIndex(mchcGDl, 2),
    formattedMcv: formatIndex(mcvFl, 2),
    statusHeadline: 'RBC indices',
    statusDetail: `${sexLabel}: MCH ${formatIndex(mchPg, 2)} pg/cell · MCHC ${formatIndex(mchcGDl, 2)} g/dL · MCV ${formatIndex(mcvFl, 2)} fL. Common adult teaching intervals ≈ MCH ${REF_MCH_PG.low}–${REF_MCH_PG.high} · MCHC ${REF_MCHC_G_DL.low}–${REF_MCHC_G_DL.high} · MCV ${REF_MCV_FL.low}–${REF_MCV_FL.high} (lab-specific; formulas are sex-independent).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
