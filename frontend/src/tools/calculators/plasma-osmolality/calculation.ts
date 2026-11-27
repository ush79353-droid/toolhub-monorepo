/**
 * Calculated plasma osmolality — Worthley-style teaching form (ADR-018).
 *
 *   Posm = 2×Na + glucose_mg/dL/18 + BUN_mg/dL/2.8
 *
 * Prompt fixture: Na 140, glucose 90, BUN 14 → 290 mOsm/kg H₂O.
 * Distinguishes BUN nitrogen from whole urea; not measured osmolality.
 */

import type {
  BunUnit,
  GlucoseUnit,
  OsmolalityUnit,
  PlasmaOsmolalityInput,
  PlasmaOsmolalityResult,
} from './types';

export const SOURCE_NOTE =
  'Calculated plasma osmolality ≈ 2×Na (mEq/L) + glucose (mg/dL)/18 + BUN (mg/dL)/2.8. Educational estimate — not measured osmolality.';

export const DISCLAIMER =
  'Not a laboratory osmometer result or osmolar-gap tool — interpret with clinical context and local reference ranges.';

/** Glucose mmol/L × 18 ≈ mg/dL (MW 180 / 10). */
export const GLUCOSE_MG_DL_PER_MMOL_L = 18;

/** Conventional: urea mmol/L × 2.8 = BUN mg/dL. */
export const UREA_MMOL_L_TO_BUN_MG_DL = 2.8;

/** Nitrogen mass / urea mass = 28/60. */
export const UREA_MG_DL_TO_BUN_MG_DL = 28 / 60;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatMeasure(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

export function glucoseToMgDl(value: number, unit: GlucoseUnit): number {
  return unit === 'mg_dl' ? value : value * GLUCOSE_MG_DL_PER_MMOL_L;
}

export function glucoseFromMgDl(mgDl: number, unit: GlucoseUnit): number {
  return unit === 'mg_dl' ? mgDl : mgDl / GLUCOSE_MG_DL_PER_MMOL_L;
}

export function bunToMgDl(value: number, unit: BunUnit): number {
  if (unit === 'mmol_l_urea') return value * UREA_MMOL_L_TO_BUN_MG_DL;
  if (unit === 'mg_dl_urea') return value * UREA_MG_DL_TO_BUN_MG_DL;
  return value;
}

export function bunFromMgDl(bunMgDl: number, unit: BunUnit): number {
  if (unit === 'mmol_l_urea') return bunMgDl / UREA_MMOL_L_TO_BUN_MG_DL;
  if (unit === 'mg_dl_urea') return bunMgDl / UREA_MG_DL_TO_BUN_MG_DL;
  return bunMgDl;
}

export function calculatedPlasmaOsmolality(
  sodiumMeqL: number,
  glucoseMgDl: number,
  bunMgDl: number,
): number {
  return 2 * sodiumMeqL + glucoseMgDl / 18 + bunMgDl / 2.8;
}

export function formatOsmolality(value: number): string {
  return (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, '');
}

function emptyResult(
  partial?: Partial<PlasmaOsmolalityResult>,
): PlasmaOsmolalityResult {
  return {
    osmolality: null,
    formattedOsmolality: '',
    statusHeadline: 'Enter sodium, glucose, and BUN.',
    statusDetail:
      'Calculated osmolality uses 2×Na + glucose/18 + BUN/2.8 after unit normalization.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculatePlasmaOsmolality(
  input: PlasmaOsmolalityInput,
): PlasmaOsmolalityResult {
  const sodium = parseNumber(input.sodiumText);
  const glucoseRaw = parseNumber(input.glucoseText);
  const bunRaw = parseNumber(input.bunText);

  if (sodium === null || glucoseRaw === null || bunRaw === null) {
    return emptyResult();
  }

  if (!(sodium >= 0) || !(glucoseRaw >= 0) || !(bunRaw >= 0)) {
    return emptyResult({
      statusHeadline: 'Inputs must be non-negative.',
      statusDetail: 'Negative concentrations are rejected.',
    });
  }

  const glucoseMgDl = glucoseToMgDl(glucoseRaw, input.glucoseUnit);
  const bunMgDl = bunToMgDl(bunRaw, input.bunUnit);
  const osmolality = calculatedPlasmaOsmolality(sodium, glucoseMgDl, bunMgDl);

  if (!Number.isFinite(osmolality)) {
    return emptyResult({
      statusHeadline: 'Unable to compute plasma osmolality.',
      statusDetail: 'Check that inputs are finite numbers.',
    });
  }

  // Teaching UI: mOsm/L listed as numerically equal for dilute plasma.
  void (input.resultUnit as OsmolalityUnit);

  return {
    osmolality,
    formattedOsmolality: formatOsmolality(osmolality),
    statusHeadline: 'Calculated plasma osmolality.',
    statusDetail: `2×${formatMeasure(sodium, 2)} + ${formatMeasure(glucoseMgDl, 2)}/18 + ${formatMeasure(bunMgDl, 2)}/2.8 (mg/dL terms). Not measured osmolality.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
