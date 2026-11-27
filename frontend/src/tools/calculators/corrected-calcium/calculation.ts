/**
 * Albumin-adjusted (“corrected”) total calcium — educational (ADR-018).
 *
 * Payne (conventional units):
 *   corrected Ca (mg/dL) = measured Ca (mg/dL) + 0.8 × (4.0 − albumin g/dL)
 *
 * SI teaching equivalent:
 *   corrected Ca (mmol/L) = measured Ca (mmol/L) + 0.02 × (40 − albumin g/L)
 *
 * Unit bridges used here:
 *   Ca: 1 mmol/L = 4 mg/dL (common clinical teaching factor)
 *   Albumin: 1 g/dL = 10 g/L
 *
 * This estimates adjusted total calcium — not ionized calcium.
 */

import type {
  AlbuminUnit,
  CalciumUnit,
  CorrectedCalciumInput,
  CorrectedCalciumResult,
} from './types';

export const SOURCE_NOTE =
  'Payne: corrected Ca (mg/dL) = measured Ca (mg/dL) + 0.8 × (4.0 − albumin g/dL). Ca mmol/L ×4 → mg/dL; albumin g/L ÷10 → g/dL. Educational estimate of albumin-adjusted total calcium — not ionized calcium.';

export const DISCLAIMER =
  'Not a lab report, diagnosis, or treatment plan — confirm with your clinician; prefer ionized calcium when indicated.';

/** Clinical teaching factor: mmol/L calcium ↔ mg/dL. */
export const CALCIUM_MMOL_L_TO_MG_DL = 4;

/** Normal albumin reference in g/dL for Payne. */
export const ALBUMIN_REFERENCE_G_DL = 4;

/** Payne coefficient in conventional units (mg/dL per g/dL albumin). */
export const PAYNE_COEFFICIENT_MG_DL = 0.8;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calciumToMgDl(value: number, unit: CalciumUnit): number {
  return unit === 'mmol_l' ? value * CALCIUM_MMOL_L_TO_MG_DL : value;
}

export function calciumFromMgDl(
  mgDl: number,
  unit: CalciumUnit,
): number {
  return unit === 'mmol_l' ? mgDl / CALCIUM_MMOL_L_TO_MG_DL : mgDl;
}

export function albuminToGDl(value: number, unit: AlbuminUnit): number {
  return unit === 'g_l' ? value / 10 : value;
}

export function albuminFromGDl(gDl: number, unit: AlbuminUnit): number {
  return unit === 'g_l' ? gDl * 10 : gDl;
}

/**
 * Payne albumin-adjusted total calcium in mg/dL.
 */
export function correctedCalciumMgDl(
  calciumMgDl: number,
  albuminGDl: number,
): number {
  return (
    calciumMgDl +
    PAYNE_COEFFICIENT_MG_DL * (ALBUMIN_REFERENCE_G_DL - albuminGDl)
  );
}

export function formatCalcium(
  value: number | null,
  unit: CalciumUnit,
): string {
  if (value == null || !Number.isFinite(value)) return '';
  const digits = unit === 'mmol_l' ? 2 : 1;
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

export function calculateCorrectedCalcium(
  input: CorrectedCalciumInput,
): CorrectedCalciumResult {
  const empty = {
    calciumMgDl: null,
    albuminGDl: null,
    correctedMgDl: null,
    correctedDisplay: null,
    formattedCorrected: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const calciumRaw = parseNumber(input.calciumText);
  const albuminRaw = parseNumber(input.albuminText);

  if (calciumRaw === null || albuminRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter calcium and albumin',
      statusDetail:
        'Enter total serum calcium and albumin to estimate albumin-adjusted calcium.',
    };
  }

  if (!(calciumRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid calcium',
      statusDetail: 'Serum calcium must be greater than zero.',
    };
  }

  if (!(albuminRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid albumin',
      statusDetail: 'Albumin must be greater than zero.',
    };
  }

  const calciumMgDl = calciumToMgDl(calciumRaw, input.calciumUnit);
  const albuminGDl = albuminToGDl(albuminRaw, input.albuminUnit);
  const correctedMgDl = correctedCalciumMgDl(calciumMgDl, albuminGDl);
  const correctedDisplay = calciumFromMgDl(correctedMgDl, input.resultUnit);
  const roundedDisplay =
    input.resultUnit === 'mmol_l'
      ? Math.round(correctedDisplay * 100) / 100
      : Math.round(correctedDisplay * 10) / 10;

  const unitLabel = input.resultUnit === 'mmol_l' ? 'mmol/L' : 'mg/dL';

  return {
    calciumMgDl,
    albuminGDl,
    correctedMgDl,
    correctedDisplay: roundedDisplay,
    formattedCorrected: formatCalcium(roundedDisplay, input.resultUnit),
    statusHeadline: 'Corrected calcium',
    statusDetail: `Corrected calcium ≈ ${formatCalcium(roundedDisplay, input.resultUnit)} ${unitLabel} (Payne albumin adjustment).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
