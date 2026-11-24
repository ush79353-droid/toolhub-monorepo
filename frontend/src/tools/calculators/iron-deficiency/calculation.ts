/**
 * Iron deficiency — Ganzoni total body iron deficit (ADR-018).
 *
 * g/dL form (National Blood Authority Australia & common teaching):
 *   Deficit (mg) = weight(kg) × (target − actual)(g/dL) × 2.4 + iron stores(mg)
 *
 * g/L form (equivalent):
 *   Deficit (mg) = weight(kg) × (target − actual)(g/L) × 0.24 + iron stores(mg)
 *
 * Factor identity: 0.24 = 0.0034 × 0.07 × 1000 (Hb iron fraction × blood volume
 * fraction × g→mg). With Hb in g/dL the factor is 2.4 (= 0.24 × 10).
 *
 * Iron depot (stores):
 *   ≥35 kg → 500 mg
 *   <35 kg → 15 mg/kg
 *
 * Primary sources (labeled Ganzoni / total body iron deficit):
 * - National Blood Authority (Australia). Iron Product Choice and Dose
 *   Calculation for Adults (March 2016): Ganzoni formula with g/L × 0.24 and
 *   depot bands above.
 * - Ganzoni AM. Intravenous iron-dextran: therapeutic and experimental aspects.
 *   Blut. 1970 (formula origin commonly cited in IV iron dosing guidance).
 * - CHOP Iron Deficiency clinical pathway: same g/dL × 2.4 + stores bands.
 *
 * Educational estimate of cumulative iron deficit only — not an IV product dose,
 * infusion schedule, or prescription.
 */

import type {
  HemoglobinUnit,
  IronDeficiencyInput,
  IronDeficiencyResult,
  WeightUnit,
} from './types';

/** Blood-volume × Hb-iron factor when Hb is in g/dL. */
export const GANZONI_FACTOR_G_PER_DL = 2.4;

/** Equivalent factor when Hb is in g/L (NBA Australia presentation). */
export const GANZONI_FACTOR_G_PER_L = 0.24;

/** Weight at/above which store allowance is the fixed adult depot. */
export const IRON_STORES_WEIGHT_THRESHOLD_KG = 35;

/** Fixed iron depot (mg) for weight ≥ 35 kg. */
export const IRON_STORES_FIXED_MG = 500;

/** Per-kg iron depot (mg/kg) for weight &lt; 35 kg. */
export const IRON_STORES_MG_PER_KG = 15;

const LB_TO_KG = 0.45359237;

export const SOURCE_NOTE =
  'Ganzoni iron deficit (mg) = weight (kg) × (target Hb − actual Hb) (g/dL) × 2.4 + iron stores (mg). Equivalent g/L form uses factor 0.24. Stores: ≥35 kg → 500 mg; <35 kg → 15 mg/kg (National Blood Authority Australia 2016 Ganzoni table; CHOP pathway).';

export const DISCLAIMER =
  'Educational estimate of cumulative iron deficit — not a diagnosis, ferritin result, IV iron product dose, or prescription.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  return unit === 'kg' ? kg : kg / LB_TO_KG;
}

/** Convert displayed Hb to g/dL. Allows zero (edge) but rejects non-finite. */
export function hemoglobinToGPerDl(
  value: number,
  unit: HemoglobinUnit,
): number | null {
  if (!Number.isFinite(value)) return null;
  return unit === 'g/L' ? value / 10 : value;
}

export function gPerDlToHemoglobinUnit(
  gPerDl: number,
  unit: HemoglobinUnit,
): number {
  return unit === 'g/L' ? gPerDl * 10 : gPerDl;
}

/**
 * Weight-based iron depot used in Ganzoni cumulative-dose tables.
 * @throws if weightKg is non-finite or ≤ 0
 */
export function ironStoresMg(weightKg: number): number {
  if (!(Number.isFinite(weightKg) && weightKg > 0)) {
    throw new Error('Weight must be a positive finite number (kg).');
  }
  if (weightKg >= IRON_STORES_WEIGHT_THRESHOLD_KG) {
    return IRON_STORES_FIXED_MG;
  }
  return IRON_STORES_MG_PER_KG * weightKg;
}

/**
 * Core Ganzoni deficit with Hb already in g/dL.
 * Target below actual yields a negative hemoglobin component (raw formula).
 * @throws if weightKg ≤ 0 or Hb values are non-finite
 */
export function ganzoniIronDeficitMg(
  weightKg: number,
  actualHemoglobinGPerDl: number,
  targetHemoglobinGPerDl: number,
): { hemoglobinDeficitMg: number; ironStoresMg: number; deficitMg: number } {
  if (!(Number.isFinite(weightKg) && weightKg > 0)) {
    throw new Error('Weight must be a positive finite number (kg).');
  }
  if (!Number.isFinite(actualHemoglobinGPerDl)) {
    throw new Error('Actual hemoglobin must be finite.');
  }
  if (!Number.isFinite(targetHemoglobinGPerDl)) {
    throw new Error('Target hemoglobin must be finite.');
  }
  if (actualHemoglobinGPerDl < 0 || targetHemoglobinGPerDl < 0) {
    throw new Error('Hemoglobin values must be non-negative.');
  }

  const stores = ironStoresMg(weightKg);
  const hemoglobinDeficitMg =
    weightKg *
    (targetHemoglobinGPerDl - actualHemoglobinGPerDl) *
    GANZONI_FACTOR_G_PER_DL;
  return {
    hemoglobinDeficitMg,
    ironStoresMg: stores,
    deficitMg: hemoglobinDeficitMg + stores,
  };
}

/** Same math via g/L × 0.24 (verifies unit equivalence). */
export function ganzoniIronDeficitMgFromGPerL(
  weightKg: number,
  actualHemoglobinGPerL: number,
  targetHemoglobinGPerL: number,
): number {
  if (!(Number.isFinite(weightKg) && weightKg > 0)) {
    throw new Error('Weight must be a positive finite number (kg).');
  }
  if (
    !Number.isFinite(actualHemoglobinGPerL) ||
    !Number.isFinite(targetHemoglobinGPerL)
  ) {
    throw new Error('Hemoglobin values must be finite.');
  }
  if (actualHemoglobinGPerL < 0 || targetHemoglobinGPerL < 0) {
    throw new Error('Hemoglobin values must be non-negative.');
  }
  const stores = ironStoresMg(weightKg);
  return (
    weightKg *
      (targetHemoglobinGPerL - actualHemoglobinGPerL) *
      GANZONI_FACTOR_G_PER_L +
    stores
  );
}

function emptyResult(
  partial: Partial<IronDeficiencyResult> = {},
): IronDeficiencyResult {
  return {
    weightKg: null,
    actualHemoglobinGPerDl: null,
    targetHemoglobinGPerDl: null,
    ironStoresMg: null,
    deficitMg: null,
    hemoglobinDeficitMg: null,
    statusHeadline: 'Enter weight and hemoglobin',
    statusDetail:
      'Enter body weight plus actual and target hemoglobin to estimate Ganzoni iron deficit (mg).',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateIronDeficiency(
  input: IronDeficiencyInput,
): IronDeficiencyResult {
  const wRaw = parseNumber(input.weightText);
  const aRaw = parseNumber(input.actualHemoglobinText);
  const tRaw = parseNumber(input.targetHemoglobinText);

  const weightKg =
    wRaw != null && wRaw > 0 ? weightToKg(wRaw, input.weightUnit) : null;
  const actualGdl =
    aRaw != null
      ? hemoglobinToGPerDl(aRaw, input.actualHemoglobinUnit)
      : null;
  const targetGdl =
    tRaw != null
      ? hemoglobinToGPerDl(tRaw, input.targetHemoglobinUnit)
      : null;

  // Stores can show as soon as weight is valid.
  if (weightKg != null && weightKg > 0 && (actualGdl == null || targetGdl == null)) {
    const stores = ironStoresMg(weightKg);
    return emptyResult({
      weightKg,
      ironStoresMg: stores,
      statusHeadline: 'Enter actual and target hemoglobin',
      statusDetail: `Iron stores allowance ${formatMg(stores)} mg from weight ${formatMg(weightKg)} kg (≥${IRON_STORES_WEIGHT_THRESHOLD_KG} kg → ${IRON_STORES_FIXED_MG} mg; otherwise ${IRON_STORES_MG_PER_KG} mg/kg). Enter both hemoglobin values for total deficit.`,
    });
  }

  if (weightKg == null || actualGdl == null || targetGdl == null) {
    return emptyResult();
  }

  if (!(weightKg > 0)) {
    return emptyResult({
      statusHeadline: 'Invalid weight',
      statusDetail: 'Weight must be positive.',
    });
  }

  if (actualGdl < 0 || targetGdl < 0) {
    return emptyResult({
      weightKg,
      statusHeadline: 'Invalid hemoglobin',
      statusDetail: 'Hemoglobin values must be non-negative.',
    });
  }

  const { hemoglobinDeficitMg, ironStoresMg: stores, deficitMg } =
    ganzoniIronDeficitMg(weightKg, actualGdl, targetGdl);

  const targetNote =
    targetGdl < actualGdl
      ? ' Target is below actual, so the hemoglobin component is negative; the raw Ganzoni total still includes the store allowance.'
      : '';

  return {
    weightKg,
    actualHemoglobinGPerDl: actualGdl,
    targetHemoglobinGPerDl: targetGdl,
    ironStoresMg: stores,
    deficitMg,
    hemoglobinDeficitMg,
    statusHeadline: 'Estimated iron deficit',
    statusDetail: `Ganzoni: ${formatMg(weightKg)} kg × (${formatHb(targetGdl)} − ${formatHb(actualGdl)}) g/dL × ${GANZONI_FACTOR_G_PER_DL} + ${formatMg(stores)} mg stores = ${formatMg(deficitMg)} mg estimated deficit. This is not an IV iron prescription.${targetNote}`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

function formatHb(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

/** Display formatting for iron amounts (mg). */
export function formatMg(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  const abs = Math.abs(value);
  const maxFrac = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(value);
}
