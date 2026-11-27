/**
 * Improved serum osmolality with ethanol (educational, ADR-018).
 *
 *   Posm = 2×Na + BUN_mg/dL/2.8 + glucose_mg/dL/18 + ethanol_mg/dL/3.7
 *
 * Ethanol mmol/L → mg/dL × 4.607 (prompt / Omni).
 * Fixture: Na 140, BUN 14, glucose 90, ethanol 37 mg/dL → 300.
 * Measured "0" treated as empty — osmotic gap only when a real measurement exists.
 */

import type {
  BunUnit,
  EthanolUnit,
  GlucoseUnit,
  OsmolalityUnit,
  SerumOsmolalityInput,
  SerumOsmolalityResult,
} from './types';

export const SOURCE_NOTE =
  'Improved calculated serum osmolality ≈ 2×Na + BUN/2.8 + glucose/18 + ethanol/3.7 (mg/dL terms). Ethanol mmol/L × 4.607 → mg/dL. Educational — not a lab osmometer.';

export const DISCLAIMER =
  'Not a laboratory report or clinical diagnosis tool — interpret with context and local reference ranges.';

export const GLUCOSE_MG_DL_PER_MMOL_L = 18;
export const UREA_MMOL_L_TO_BUN_MG_DL = 2.8;
export const UREA_MG_DL_TO_BUN_MG_DL = 28 / 60;
/** Omni / prompt: mmol/L ethanol → mg/dL. */
export const ETHANOL_MG_DL_PER_MMOL_L = 4.607;

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

export function ethanolToMgDl(value: number, unit: EthanolUnit): number {
  return unit === 'mg_dl' ? value : value * ETHANOL_MG_DL_PER_MMOL_L;
}

export function ethanolFromMgDl(mgDl: number, unit: EthanolUnit): number {
  return unit === 'mg_dl' ? mgDl : mgDl / ETHANOL_MG_DL_PER_MMOL_L;
}

export function calculatedSerumOsmolality(
  sodiumMeqL: number,
  bunMgDl: number,
  glucoseMgDl: number,
  ethanolMgDl: number,
): number {
  return (
    2 * sodiumMeqL +
    bunMgDl / 2.8 +
    glucoseMgDl / 18 +
    ethanolMgDl / 3.7
  );
}

export function formatOsmolality(value: number): string {
  return (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, '');
}

/**
 * Screenshot shows measured default "0" — treat bare 0 as empty (no gap).
 */
export function parseMeasuredOsmolality(raw: string): number | null {
  const t = raw.trim();
  if (t === '' || t === '0' || t === '0.0' || t === '0.00') return null;
  return parseNumber(raw);
}

function emptyResult(
  partial?: Partial<SerumOsmolalityResult>,
): SerumOsmolalityResult {
  return {
    osmolality: null,
    formattedOsmolality: '',
    osmoticGap: null,
    formattedGap: '',
    statusHeadline: 'Enter sodium, BUN, and glucose.',
    statusDetail:
      'Alcohol is optional (defaults to 0). Measured osmolality enables the osmotic gap when not blank/zero.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateSerumOsmolality(
  input: SerumOsmolalityInput,
): SerumOsmolalityResult {
  const sodium = parseNumber(input.sodiumText);
  const bunRaw = parseNumber(input.bunText);
  const glucoseRaw = parseNumber(input.glucoseText);
  const ethanolRaw = parseNumber(input.ethanolText);
  const measured = parseMeasuredOsmolality(input.measuredText);

  if (sodium === null || bunRaw === null || glucoseRaw === null) {
    return emptyResult();
  }

  if (!(sodium >= 0) || !(bunRaw >= 0) || !(glucoseRaw >= 0)) {
    return emptyResult({
      statusHeadline: 'Na, BUN, and glucose must be non-negative.',
      statusDetail: 'Negative concentrations are rejected.',
    });
  }

  const ethanolMgDl =
    ethanolRaw === null ? 0 : ethanolToMgDl(ethanolRaw, input.ethanolUnit);
  if (ethanolRaw !== null && !(ethanolRaw >= 0)) {
    return emptyResult({
      statusHeadline: 'Ethanol must be non-negative.',
      statusDetail: 'Negative alcohol concentrations are rejected.',
    });
  }

  const bunMgDl = bunToMgDl(bunRaw, input.bunUnit);
  const glucoseMgDl = glucoseToMgDl(glucoseRaw, input.glucoseUnit);
  const osmolality = calculatedSerumOsmolality(
    sodium,
    bunMgDl,
    glucoseMgDl,
    ethanolMgDl,
  );

  if (!Number.isFinite(osmolality)) {
    return emptyResult({
      statusHeadline: 'Unable to compute serum osmolality.',
      statusDetail: 'Check that inputs are finite numbers.',
    });
  }

  void (input.resultUnit as OsmolalityUnit);
  void (input.measuredUnit as OsmolalityUnit);

  let osmoticGap: number | null = null;
  let formattedGap = '';
  if (measured !== null && measured > 0) {
    osmoticGap = measured - osmolality;
    formattedGap = formatOsmolality(osmoticGap);
  }

  return {
    osmolality,
    formattedOsmolality: formatOsmolality(osmolality),
    osmoticGap,
    formattedGap,
    statusHeadline:
      osmoticGap !== null
        ? 'Calculated osmolality and osmotic gap.'
        : 'Calculated serum osmolality.',
    statusDetail:
      osmoticGap !== null
        ? `Gap = measured − calculated = ${formattedGap} mOsm/kg. Ethanol term uses /3.7 after mg/dL conversion.`
        : `2×Na + BUN/2.8 + Glu/18 + EtOH/3.7 (mg/dL). Enter a non-zero measured value for osmotic gap.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
