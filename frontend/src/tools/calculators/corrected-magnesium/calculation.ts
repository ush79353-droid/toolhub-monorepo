/**
 * Albumin-adjusted (“corrected”) magnesium — educational (ADR-018).
 *
 * Kroll & Elin / Omni (mmol/L convention):
 *   corrected Mg (mmol/L) = measured Mg (mmol/L) + 0.005 × (40 − albumin g/L)
 *
 * Divalent Mg: 1 mmol/L = 2 mEq/L.
 * Mass bridge (atomic Mg ≈24.305): 1 mmol/L ≈ 2.4305 mg/dL.
 *
 * Do not reuse Payne calcium coefficients.
 */

import type {
  AlbuminUnit,
  CorrectedMagnesiumInput,
  CorrectedMagnesiumResult,
  MagnesiumUnit,
} from './types';

export const SOURCE_NOTE =
  'Kroll & Elin / Omni: corrected Mg (mmol/L) = measured Mg (mmol/L) + 0.005 × (40 − albumin g/L). Mg: 1 mmol/L = 2 mEq/L; ≈2.4305 mg/dL. Albumin g/dL ×10 → g/L. Educational estimate — not ionized magnesium.';

export const DISCLAIMER =
  'Not a lab report, diagnosis, or treatment plan — confirm with your clinician.';

/** Reference albumin in g/L for the published correction. */
export const ALBUMIN_REFERENCE_G_L = 40;

/** Coefficient in mmol/L per g/L albumin (not calcium’s 0.8 / 0.02). */
export const KROLL_ELIN_COEFFICIENT_MMOL_L = 0.005;

/** Divalent magnesium: mmol/L ↔ mEq/L. */
export const MG_MMOL_L_TO_MEQ_L = 2;

/** Approx. atomic Mg 24.305 → mg/dL per mmol/L. */
export const MG_MMOL_L_TO_MG_DL = 2.4305;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function magnesiumToMmolL(
  value: number,
  unit: MagnesiumUnit,
): number {
  switch (unit) {
    case 'mmol_l':
      return value;
    case 'meq_l':
      return value / MG_MMOL_L_TO_MEQ_L;
    case 'mg_dl':
      return value / MG_MMOL_L_TO_MG_DL;
  }
}

export function magnesiumFromMmolL(
  mmolL: number,
  unit: MagnesiumUnit,
): number {
  switch (unit) {
    case 'mmol_l':
      return mmolL;
    case 'meq_l':
      return mmolL * MG_MMOL_L_TO_MEQ_L;
    case 'mg_dl':
      return mmolL * MG_MMOL_L_TO_MG_DL;
  }
}

export function albuminToGL(value: number, unit: AlbuminUnit): number {
  return unit === 'g_dl' ? value * 10 : value;
}

export function albuminFromGL(gL: number, unit: AlbuminUnit): number {
  return unit === 'g_dl' ? gL / 10 : gL;
}

export function correctedMagnesiumMmolL(
  magnesiumMmolL: number,
  albuminGL: number,
): number {
  return (
    magnesiumMmolL +
    KROLL_ELIN_COEFFICIENT_MMOL_L * (ALBUMIN_REFERENCE_G_L - albuminGL)
  );
}

export function formatMagnesium(
  value: number | null,
  unit: MagnesiumUnit,
): string {
  if (value == null || !Number.isFinite(value)) return '';
  const digits = unit === 'mg_dl' ? 2 : 2;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatAlbumin(
  value: number | null,
  unit: AlbuminUnit,
): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateCorrectedMagnesium(
  input: CorrectedMagnesiumInput,
): CorrectedMagnesiumResult {
  const empty = {
    magnesiumMmolL: null,
    albuminGL: null,
    correctedMmolL: null,
    correctedDisplay: null,
    formattedCorrected: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const mgRaw = parseNumber(input.magnesiumText);
  const albRaw = parseNumber(input.albuminText);

  if (mgRaw === null || albRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter magnesium and albumin',
      statusDetail:
        'Enter serum magnesium and albumin to estimate albumin-adjusted magnesium.',
    };
  }

  if (!(mgRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid magnesium',
      statusDetail: 'Magnesium must be greater than zero.',
    };
  }

  if (!(albRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid albumin',
      statusDetail: 'Albumin must be greater than zero.',
    };
  }

  const magnesiumMmolL = magnesiumToMmolL(mgRaw, input.magnesiumUnit);
  const albuminGL = albuminToGL(albRaw, input.albuminUnit);
  const correctedMmolL = correctedMagnesiumMmolL(magnesiumMmolL, albuminGL);
  const correctedDisplay = magnesiumFromMmolL(
    correctedMmolL,
    input.resultUnit,
  );
  const rounded = Math.round(correctedDisplay * 100) / 100;
  const unitLabel =
    input.resultUnit === 'meq_l'
      ? 'mEq/L'
      : input.resultUnit === 'mmol_l'
        ? 'mmol/L'
        : 'mg/dL';

  return {
    magnesiumMmolL,
    albuminGL,
    correctedMmolL,
    correctedDisplay: rounded,
    formattedCorrected: formatMagnesium(rounded, input.resultUnit),
    statusHeadline: 'Corrected magnesium',
    statusDetail: `Corrected magnesium ≈ ${formatMagnesium(rounded, input.resultUnit)} ${unitLabel} (Kroll & Elin albumin adjustment).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
