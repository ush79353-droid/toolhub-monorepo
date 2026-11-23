/**
 * Cardiac Output — Fick principle (educational).
 *
 * CO = VO₂ / (CaO₂ − CvO₂) with contents in mL O₂/L.
 * Content (mL/dL) = 1.34×Hb×Sat + 0.0031×PO₂; ×10 → mL/L.
 * BSA: Mosteller √(H_cm×W_kg/3600). Estimated VO₂: 125 mL/min/m² × BSA.
 *
 * Sources: StatPearls NBK606091 (Fick CO); Mosteller RD. N Engl J Med.
 * 1987;317:1098; classic Hüfner 1.34 mL/g and dissolved 0.0031 mL/dL/Torr.
 */

import type {
  BsaUnit,
  CardiacOutputInput,
  CardiacOutputResult,
  ContentUnit,
  CoUnit,
  HbUnit,
  HeightUnit,
  TensionUnit,
  Vo2Unit,
  WeightUnit,
} from './types';

export const SOURCE_LABEL =
  'Fick principle as summarized in StatPearls “Calculating FICK Cardiac Output” (NBK606091); Mosteller BSA (N Engl J Med. 1987;317:1098); O₂ content with Hüfner 1.34 mL/g + dissolved 0.0031 mL/dL/Torr.';

export const DISCLAIMER =
  'Educational Fick estimate only. Estimated oxygen consumption is not a measured VO₂. Does not diagnose, guide catheters, or replace clinical haemodynamic assessment.';

/** Hüfner constant (mL O₂ bound per g Hb when fully saturated). */
export const HB_BINDING_ML_PER_G = 1.34;

/** Dissolved O₂ solubility (mL O₂ / dL / Torr). */
export const DISSOLVED_ML_PER_DL_PER_TORR = 0.0031;

/** Resting indexed O₂ consumption used when VO₂ is estimated (mL/min/m²). */
export const VO2_INDEX_ML_PER_MIN_M2 = 125;

const M2_PER_FT2 = 0.09290304;
const CM_PER_IN = 2.54;
const KG_PER_LB = 0.45359237;
const TORR_PER_KPA = 7.50061683;

export function heightToCm(value: number, unit: HeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    case 'in':
      return value * CM_PER_IN;
    case 'ft':
      return value * 12 * CM_PER_IN;
    default:
      return null;
  }
}

export function cmToHeightUnit(cm: number, unit: HeightUnit): number {
  switch (unit) {
    case 'cm':
      return cm;
    case 'm':
      return cm / 100;
    case 'in':
      return cm / CM_PER_IN;
    case 'ft':
      return cm / (12 * CM_PER_IN);
    default:
      return cm;
  }
}

export function weightToKg(value: number, unit: WeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'lb' ? value * KG_PER_LB : value;
}

export function kgToWeightUnit(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / KG_PER_LB : kg;
}

/** Mosteller: BSA (m²) = √(height_cm × weight_kg / 3600). */
export function mostellerBsaM2(heightCm: number, weightKg: number): number | null {
  if (
    !Number.isFinite(heightCm) ||
    !Number.isFinite(weightKg) ||
    heightCm <= 0 ||
    weightKg <= 0
  ) {
    return null;
  }
  return Math.sqrt((heightCm * weightKg) / 3600);
}

export function bsaToM2(value: number, unit: BsaUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'ft2' ? value * M2_PER_FT2 : value;
}

export function m2ToBsaUnit(m2: number, unit: BsaUnit): number {
  return unit === 'ft2' ? m2 / M2_PER_FT2 : m2;
}

export function vo2ToMlPerMin(value: number, unit: Vo2Unit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'mL/s' ? value * 60 : value;
}

export function mlPerMinToVo2Unit(mlPerMin: number, unit: Vo2Unit): number {
  return unit === 'mL/s' ? mlPerMin / 60 : mlPerMin;
}

export function estimateVo2MlPerMin(bsaM2: number): number | null {
  if (!Number.isFinite(bsaM2) || bsaM2 <= 0) return null;
  return VO2_INDEX_ML_PER_MIN_M2 * bsaM2;
}

export function hemoglobinToGPerDl(value: number, unit: HbUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'g/L' ? value / 10 : value;
}

export function gPerDlToHbUnit(gPerDl: number, unit: HbUnit): number {
  return unit === 'g/L' ? gPerDl * 10 : gPerDl;
}

export function tensionToTorr(value: number, unit: TensionUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  return unit === 'kPa' ? value * TORR_PER_KPA : value;
}

export function torrToTensionUnit(torr: number, unit: TensionUnit): number {
  return unit === 'kPa' ? torr / TORR_PER_KPA : torr;
}

export function contentToMlPerL(value: number, unit: ContentUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  return unit === 'mL/dL' ? value * 10 : value;
}

export function mlPerLToContentUnit(mlPerL: number, unit: ContentUnit): number {
  return unit === 'mL/dL' ? mlPerL / 10 : mlPerL;
}

export function coToLPerMin(value: number, unit: CoUnit): number {
  return unit === 'mL/min' ? value / 1000 : value;
}

export function lPerMinToCoUnit(lPerMin: number, unit: CoUnit): number {
  return unit === 'mL/min' ? lPerMin * 1000 : lPerMin;
}

/**
 * Oxygen content in mL O₂ / dL blood.
 * = Hb-binding × Hb(g/dL) × saturation fraction + dissolved × PO₂(Torr).
 */
export function oxygenContentMlPerDl(
  hemoglobinGPerDl: number,
  saturationPercent: number,
  po2Torr: number
): number | null {
  if (
    !Number.isFinite(hemoglobinGPerDl) ||
    !Number.isFinite(saturationPercent) ||
    !Number.isFinite(po2Torr) ||
    hemoglobinGPerDl <= 0 ||
    saturationPercent < 0 ||
    saturationPercent > 100 ||
    po2Torr < 0
  ) {
    return null;
  }
  const bound =
    HB_BINDING_ML_PER_G * hemoglobinGPerDl * (saturationPercent / 100);
  const dissolved = DISSOLVED_ML_PER_DL_PER_TORR * po2Torr;
  return bound + dissolved;
}

export function oxygenContentMlPerL(
  hemoglobinGPerDl: number,
  saturationPercent: number,
  po2Torr: number
): number | null {
  const perDl = oxygenContentMlPerDl(
    hemoglobinGPerDl,
    saturationPercent,
    po2Torr
  );
  return perDl == null ? null : perDl * 10;
}

/**
 * Fick CO (L/min) = VO₂ (mL/min) / (Ca − Cv) (mL/L).
 * Rejects non-positive AV differences.
 */
export function fickCardiacOutputLPerMin(
  vo2MlPerMin: number,
  arterialContentMlPerL: number,
  venousContentMlPerL: number
): number | null {
  if (
    !Number.isFinite(vo2MlPerMin) ||
    !Number.isFinite(arterialContentMlPerL) ||
    !Number.isFinite(venousContentMlPerL) ||
    vo2MlPerMin <= 0
  ) {
    return null;
  }
  const av = arterialContentMlPerL - venousContentMlPerL;
  if (!(av > 0)) return null;
  const co = vo2MlPerMin / av;
  return Number.isFinite(co) && co > 0 ? co : null;
}

export function cardiacIndex(
  coLPerMin: number,
  bsaM2: number
): number | null {
  if (
    !Number.isFinite(coLPerMin) ||
    !Number.isFinite(bsaM2) ||
    coLPerMin <= 0 ||
    bsaM2 <= 0
  ) {
    return null;
  }
  const ci = coLPerMin / bsaM2;
  return Number.isFinite(ci) && ci > 0 ? ci : null;
}

export function formatFixed(value: number, digits: number): string {
  if (!Number.isFinite(value)) return '';
  return value.toFixed(digits);
}

export function buildCardiacOutputResult(args: {
  bsaM2: number;
  vo2MlPerMin: number;
  vo2Estimated: boolean;
  arterialContentMlPerL: number;
  venousContentMlPerL: number;
  coUnit: CoUnit;
}): CardiacOutputResult | null {
  const {
    bsaM2,
    vo2MlPerMin,
    vo2Estimated,
    arterialContentMlPerL,
    venousContentMlPerL,
    coUnit,
  } = args;

  const av = arterialContentMlPerL - venousContentMlPerL;
  const co = fickCardiacOutputLPerMin(
    vo2MlPerMin,
    arterialContentMlPerL,
    venousContentMlPerL
  );
  if (co == null) return null;
  const ci = cardiacIndex(co, bsaM2);
  if (ci == null) return null;

  const displayCo = lPerMinToCoUnit(co, coUnit);
  const coDigits = coUnit === 'mL/min' ? 0 : 2;

  return {
    bsaM2,
    vo2MlPerMin,
    vo2Estimated,
    arterialContentMlPerL,
    venousContentMlPerL,
    avDifferenceMlPerL: av,
    cardiacOutputLPerMin: co,
    cardiacIndex: ci,
    formattedCo: formatFixed(displayCo, coDigits),
    formattedCi: formatFixed(ci, 2),
    explanation: vo2Estimated
      ? `Fick CO from estimated VO₂ (125 mL/min/m² × BSA) and arteriovenous O₂ content difference ${formatFixed(av, 1)} mL/L.`
      : `Fick CO from entered VO₂ and arteriovenous O₂ content difference ${formatFixed(av, 1)} mL/L.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

/** Resolve display strings for derived BSA / VO₂ / contents when not manual. */
export function deriveDisplayPatches(
  input: CardiacOutputInput,
  parsed: {
    heightCm: number | null;
    weightKg: number | null;
    bsaM2: number | null;
    hbGPerDl: number | null;
    artSat: number | null;
    artTorr: number | null;
    venSat: number | null;
    venTorr: number | null;
  }
): Partial<CardiacOutputInput> {
  const patch: Partial<CardiacOutputInput> = {};

  if (!input.bsaManual && parsed.heightCm != null && parsed.weightKg != null) {
    const bsa = mostellerBsaM2(parsed.heightCm, parsed.weightKg);
    if (bsa != null) {
      patch.bsaValue = formatFixed(m2ToBsaUnit(bsa, input.bsaUnit), 3);
    }
  }

  const bsaForVo2 =
    parsed.bsaM2 ??
    (parsed.heightCm != null && parsed.weightKg != null
      ? mostellerBsaM2(parsed.heightCm, parsed.weightKg)
      : null);

  if (!input.vo2Manual && bsaForVo2 != null) {
    const vo2 = estimateVo2MlPerMin(bsaForVo2);
    if (vo2 != null) {
      patch.vo2Value = formatFixed(mlPerMinToVo2Unit(vo2, input.vo2Unit), 1);
    }
  }

  if (
    !input.arterialContentManual &&
    parsed.hbGPerDl != null &&
    parsed.artSat != null &&
    parsed.artTorr != null
  ) {
    const c = oxygenContentMlPerL(
      parsed.hbGPerDl,
      parsed.artSat,
      parsed.artTorr
    );
    if (c != null) {
      patch.arterialContent = formatFixed(
        mlPerLToContentUnit(c, input.arterialContentUnit),
        1
      );
    }
  }

  if (
    !input.venousContentManual &&
    parsed.hbGPerDl != null &&
    parsed.venSat != null &&
    parsed.venTorr != null
  ) {
    const c = oxygenContentMlPerL(
      parsed.hbGPerDl,
      parsed.venSat,
      parsed.venTorr
    );
    if (c != null) {
      patch.venousContent = formatFixed(
        mlPerLToContentUnit(c, input.venousContentUnit),
        1
      );
    }
  }

  return patch;
}
