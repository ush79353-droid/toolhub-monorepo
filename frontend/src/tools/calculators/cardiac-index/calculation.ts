/**
 * Cardiac index hemodynamics (ADR-018).
 *
 * Formulas:
 * - Mosteller BSA (m²) = √(height_cm × weight_kg / 3600) — Mosteller RD, N Engl J Med 1987.
 * - Cardiac index CI = CO / BSA (full-precision BSA; round only for display).
 * - Fick CO (L/min) = VO₂ / (CaO₂ − CvO₂) with contents in mL/L.
 * - O₂ content (mL/dL) = (Hüfner × Hb × Sat/100) + (0.0031 × PO₂_Torr);
 *   ×10 → mL/L. Hüfner coefficient 1.34 mL O₂/g Hb (common teaching constant).
 * - Estimated resting VO₂ (mL/min) = 125 × BSA when consumption left blank
 *   (Dehmer GJ et al. catheterization estimates; labeled as estimated).
 *
 * Educational arithmetic only — not a clinical diagnosis or care plan.
 */

import type {
  CardiacIndexInput,
  CardiacIndexResult,
  ConcentrationUnit,
  HeightUnit,
  TensionUnit,
  WeightUnit,
} from './types';

export const KG_PER_POUND = 0.45359237;
export const CM_PER_INCH = 2.54;
/** Torr (mmHg) per kPa. */
export const TORR_PER_KPA = 7.50061683;

/** Hüfner O₂ binding capacity (mL O₂ / g Hb). */
export const HUFNER_ML_PER_G = 1.34;

/** Dissolved O₂ solubility (mL/dL per Torr). */
export const DISSOLVED_ML_PER_DL_PER_TORR = 0.0031;

/** Resting VO₂ estimate factor (mL/min per m² BSA). */
export const VO2_PER_BSA_ML_MIN_M2 = 125;

export const SOURCE_NOTE =
  'Mosteller BSA (N Engl J Med 1987); Fick principle with Hüfner 1.34 mL O₂/g Hb and dissolved 0.0031 mL/dL/Torr; estimated VO₂ = 125 × BSA mL/min when blank (Dehmer-style resting estimate). Educational only.';

export const DISCLAIMER =
  'Educational hemodynamics arithmetic — not a diagnosis, monitoring decision, or substitute for measured cardiac output in clinical care.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_POUND : value;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  return unit === 'in' ? value * CM_PER_INCH : value;
}

export function kgToWeightUnit(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / KG_PER_POUND : kg;
}

export function cmToHeightUnit(cm: number, unit: HeightUnit): number {
  return unit === 'in' ? cm / CM_PER_INCH : cm;
}

export function tensionToTorr(value: number, unit: TensionUnit): number {
  return unit === 'kPa' ? value * TORR_PER_KPA : value;
}

export function torrToTensionUnit(torr: number, unit: TensionUnit): number {
  return unit === 'kPa' ? torr / TORR_PER_KPA : torr;
}

/**
 * Mosteller body surface area (m²).
 * Does not round — callers may format for display only.
 */
export function mostellerBsaM2(heightCm: number, weightKg: number): number {
  if (!(heightCm > 0) || !(weightKg > 0)) {
    throw new Error('Mosteller BSA requires positive height and weight.');
  }
  return Math.sqrt((heightCm * weightKg) / 3600);
}

/** Cardiac index = CO / BSA (no intermediate BSA rounding). */
export function cardiacIndexFromCo(
  coLPerMin: number,
  bsaM2: number,
): number {
  if (!(coLPerMin > 0) || !(bsaM2 > 0)) {
    throw new Error('CI requires positive CO and BSA.');
  }
  return coLPerMin / bsaM2;
}

/**
 * Blood O₂ content in mL/dL from hemoglobin, saturation %, and PO₂ in Torr.
 */
export function oxygenContentMlPerDl(
  hemoglobinGPerDl: number,
  saturationPercent: number,
  po2Torr: number,
): number {
  if (
    !(hemoglobinGPerDl >= 0) ||
    !(saturationPercent >= 0) ||
    !(saturationPercent <= 100) ||
    !(po2Torr >= 0)
  ) {
    throw new Error('Invalid oxygen content inputs.');
  }
  const bound =
    HUFNER_ML_PER_G * hemoglobinGPerDl * (saturationPercent / 100);
  const dissolved = DISSOLVED_ML_PER_DL_PER_TORR * po2Torr;
  return bound + dissolved;
}

export function contentToUnit(
  mlPerDl: number,
  unit: ConcentrationUnit,
): number {
  return unit === 'mL/L' ? mlPerDl * 10 : mlPerDl;
}

export function contentFromUnit(
  value: number,
  unit: ConcentrationUnit,
): number {
  return unit === 'mL/L' ? value / 10 : value;
}

/** Fick CO (L/min) = VO₂ (mL/min) / Δ content (mL/L). */
export function fickCardiacOutputLPerMin(
  vo2MlPerMin: number,
  arterialMlPerL: number,
  venousMlPerL: number,
): number {
  const delta = arterialMlPerL - venousMlPerL;
  if (!(vo2MlPerMin > 0) || !(delta > 0)) {
    throw new Error('Fick CO requires positive VO₂ and positive Ca−Cv.');
  }
  return vo2MlPerMin / delta;
}

export function estimatedVo2MlPerMin(bsaM2: number): number {
  if (!(bsaM2 > 0)) {
    throw new Error('Estimated VO₂ requires positive BSA.');
  }
  return VO2_PER_BSA_ML_MIN_M2 * bsaM2;
}

function awaiting(
  mode: CardiacIndexInput['knowsCardiacOutput'],
  detail: string,
): CardiacIndexResult {
  return {
    cardiacIndexLPerMinPerM2: null,
    cardiacOutputLPerMin: null,
    bsaM2: null,
    vo2MlPerMin: null,
    arterialContentMlPerL: null,
    venousContentMlPerL: null,
    mode,
    statusHeadline: 'Enter inputs to see cardiac index',
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/**
 * Pure cardiac-index calculation from validated numeric-ready input.
 * Callers must validate field strings first.
 */
export function calculateCardiacIndex(
  input: CardiacIndexInput,
): CardiacIndexResult {
  const heightRaw = parseNumber(input.heightText);
  const weightRaw = parseNumber(input.weightText);

  if (heightRaw === null || weightRaw === null) {
    return awaiting(
      input.knowsCardiacOutput,
      input.knowsCardiacOutput === 'yes'
        ? 'Enter cardiac output, height, and weight.'
        : 'Enter height, weight, hemoglobin, and arterial/venous oxygen values.',
    );
  }
  if (!(heightRaw > 0) || !(weightRaw > 0)) {
    return awaiting(
      input.knowsCardiacOutput,
      'Height and weight must be positive.',
    );
  }

  const heightCm = heightToCm(heightRaw, input.heightUnit);
  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const bsaM2 = mostellerBsaM2(heightCm, weightKg);

  if (input.knowsCardiacOutput === 'yes') {
    const coRaw = parseNumber(input.cardiacOutputText);
    if (coRaw === null) {
      return {
        ...awaiting('yes', 'Enter cardiac output in L/min.'),
        bsaM2,
      };
    }
    if (!(coRaw > 0)) {
      return awaiting('yes', 'Cardiac output must be positive.');
    }
    const ci = cardiacIndexFromCo(coRaw, bsaM2);
    return {
      cardiacIndexLPerMinPerM2: ci,
      cardiacOutputLPerMin: coRaw,
      bsaM2,
      vo2MlPerMin: null,
      arterialContentMlPerL: null,
      venousContentMlPerL: null,
      mode: 'yes',
      statusHeadline: 'Cardiac index (known output)',
      statusDetail: `CI = CO ÷ Mosteller BSA. BSA used at full precision (${bsaM2} m² before display rounding).`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  // Fick / unknown CO branch
  const hb = parseNumber(input.hemoglobinText);
  const artSat = parseNumber(input.arterialSaturationText);
  const artTen = parseNumber(input.arterialTensionText);
  const venSat = parseNumber(input.venousSaturationText);
  const venTen = parseNumber(input.venousTensionText);

  if (
    hb === null ||
    artSat === null ||
    artTen === null ||
    venSat === null ||
    venTen === null
  ) {
    return {
      ...awaiting(
        'no',
        'Enter hemoglobin and complete arterial and venous saturation and tension.',
      ),
      bsaM2,
      vo2MlPerMin: estimatedVo2MlPerMin(bsaM2),
    };
  }
  if (!(hb > 0)) {
    return awaiting('no', 'Hemoglobin must be positive.');
  }
  if (!(artSat >= 0) || !(artSat <= 100) || !(venSat >= 0) || !(venSat <= 100)) {
    return awaiting('no', 'Saturation must be between 0 and 100%.');
  }
  if (!(artTen >= 0) || !(venTen >= 0)) {
    return awaiting('no', 'Oxygen tension cannot be negative.');
  }

  const artTorr = tensionToTorr(artTen, input.arterialTensionUnit);
  const venTorr = tensionToTorr(venTen, input.venousTensionUnit);
  const artMlDl = oxygenContentMlPerDl(hb, artSat, artTorr);
  const venMlDl = oxygenContentMlPerDl(hb, venSat, venTorr);
  const artMlL = contentToUnit(artMlDl, 'mL/L');
  const venMlL = contentToUnit(venMlDl, 'mL/L');

  const vo2Override = parseNumber(input.oxygenConsumptionText);
  let vo2: number;
  let vo2Estimated = false;
  if (vo2Override !== null) {
    if (!(vo2Override > 0)) {
      return awaiting('no', 'O₂ consumption must be positive when entered.');
    }
    vo2 = vo2Override;
  } else {
    vo2 = estimatedVo2MlPerMin(bsaM2);
    vo2Estimated = true;
  }

  const delta = artMlL - venMlL;
  if (!(delta > 0)) {
    return {
      cardiacIndexLPerMinPerM2: null,
      cardiacOutputLPerMin: null,
      bsaM2,
      vo2MlPerMin: vo2,
      arterialContentMlPerL: artMlL,
      venousContentMlPerL: venMlL,
      mode: 'no',
      statusHeadline: 'Cannot compute Fick output',
      statusDetail:
        'Arterial−venous oxygen content difference must be positive (Ca > Cv).',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const co = fickCardiacOutputLPerMin(vo2, artMlL, venMlL);
  const ci = cardiacIndexFromCo(co, bsaM2);

  return {
    cardiacIndexLPerMinPerM2: ci,
    cardiacOutputLPerMin: co,
    bsaM2,
    vo2MlPerMin: vo2,
    arterialContentMlPerL: artMlL,
    venousContentMlPerL: venMlL,
    mode: 'no',
    statusHeadline: 'Cardiac index (Fick)',
    statusDetail: vo2Estimated
      ? `VO₂ estimated as ${VO2_PER_BSA_ML_MIN_M2} × BSA mL/min. CO = VO₂ / (Ca−Cv); CI = CO / BSA.`
      : 'CO = VO₂ / (Ca−Cv) with entered consumption; CI = CO / BSA.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** Display helper — round CI for read-only field (engine keeps full precision). */
export function formatCardiacIndex(ci: number | null): string {
  if (ci == null || !Number.isFinite(ci)) return '';
  return (Math.round(ci * 100) / 100).toFixed(2);
}
