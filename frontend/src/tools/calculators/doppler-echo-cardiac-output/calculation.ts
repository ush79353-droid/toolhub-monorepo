/**
 * Doppler echo cardiac output — continuity equation at the LVOT (educational).
 *
 * LVOT CSA (cm²) = π (d_cm / 2)²
 * Stroke volume (mL) = CSA × VTI_cm  (cm² × cm = cm³ = mL)
 * Cardiac output (L/min) = SV × HR / 1000
 * Cardiac index (L/min/m²) = CO / BSA
 * BSA: Mosteller √(H_cm × W_kg / 3600) — same method as Cardiac Index tool.
 *
 * Sources: standard pulsed-wave Doppler LVOT stroke volume methods; Mosteller RD,
 * N Engl J Med. 1987;317:1098 (BSA).
 */

import {
  cardiacIndexFromCo,
  heightToCm,
  mostellerBsaM2,
  parseNumber,
  weightToKg,
} from '../cardiac-index/calculation';
import { lengthToCm, vtiToCm } from '../aortic-valve-area/calculation';
import type {
  DopplerEchoCardiacOutputInput,
  DopplerEchoCardiacOutputResult,
  HeightUnit,
  LvotDiameterUnit,
  LvotVtiUnit,
  WeightUnit,
} from './types';

export { parseNumber };

export const SOURCE_LABEL =
  'LVOT continuity-equation stroke volume (educational Doppler echo); Mosteller BSA (N Engl J Med. 1987;317:1098) for cardiac index.';

export const DISCLAIMER =
  'Educational Doppler echo arithmetic only. Does not replace interpreted echocardiography, hemodynamic monitoring, or clinical decision-making.';

/** Practical upper LVOT diameter bound (cm) — typo guard aligned with AVA tool. */
export const MAX_LVOT_CM = 5;

/** Practical heart-rate bounds (bpm). */
export const MIN_HEART_RATE_BPM = 20;
export const MAX_HEART_RATE_BPM = 250;

export function lvotDiameterToCm(
  value: number,
  unit: LvotDiameterUnit,
): number | null {
  return lengthToCm(value, unit);
}

export function lvotVtiToCm(value: number, unit: LvotVtiUnit): number | null {
  return vtiToCm(value, unit);
}

/** Circular LVOT cross-sectional area (cm²). */
export function lvotCrossSectionalAreaCm2(lvotDiameterCm: number): number | null {
  if (!Number.isFinite(lvotDiameterCm) || lvotDiameterCm <= 0) return null;
  const radius = lvotDiameterCm / 2;
  const area = Math.PI * radius * radius;
  return Number.isFinite(area) && area > 0 ? area : null;
}

/** Stroke volume from LVOT area and VTI (mL). */
export function strokeVolumeMl(
  lvotAreaCm2: number,
  lvotVtiCm: number,
): number | null {
  if (
    !Number.isFinite(lvotAreaCm2) ||
    !Number.isFinite(lvotVtiCm) ||
    lvotAreaCm2 <= 0 ||
    lvotVtiCm <= 0
  ) {
    return null;
  }
  const sv = lvotAreaCm2 * lvotVtiCm;
  return Number.isFinite(sv) && sv > 0 ? sv : null;
}

/** Cardiac output (L/min) from stroke volume (mL) and heart rate (bpm). */
export function cardiacOutputLPerMin(
  strokeVolumeMl: number,
  heartRateBpm: number,
): number | null {
  if (
    !Number.isFinite(strokeVolumeMl) ||
    !Number.isFinite(heartRateBpm) ||
    strokeVolumeMl <= 0 ||
    heartRateBpm <= 0
  ) {
    return null;
  }
  const co = (strokeVolumeMl * heartRateBpm) / 1000;
  return Number.isFinite(co) && co > 0 ? co : null;
}

export function formatDisplay(value: number | null, digits: number): string {
  if (value == null || !Number.isFinite(value)) return '';
  return Number(value.toFixed(digits)).toFixed(digits);
}

export function tryBsaM2(
  heightRaw: number | null,
  heightUnit: HeightUnit,
  weightRaw: number | null,
  weightUnit: WeightUnit,
): number | null {
  if (heightRaw == null || weightRaw == null || heightRaw <= 0 || weightRaw <= 0) {
    return null;
  }
  try {
    const heightCm = heightToCm(heightRaw, heightUnit);
    const weightKg = weightToKg(weightRaw, weightUnit);
    return mostellerBsaM2(heightCm, weightKg);
  } catch {
    return null;
  }
}

export function buildDopplerEchoCardiacOutputResult(args: {
  bsaM2: number | null;
  lvotAreaCm2: number | null;
  strokeVolumeMl: number | null;
  cardiacOutputLPerMin: number | null;
  cardiacIndexLPerMinM2: number | null;
}): DopplerEchoCardiacOutputResult {
  const parts: string[] = [];
  if (args.lvotAreaCm2 != null) {
    parts.push(
      `LVOT area = π×(d/2)² = ${formatDisplay(args.lvotAreaCm2, 4)} cm²`,
    );
  }
  if (args.strokeVolumeMl != null) {
    parts.push(`SV = area×VTI = ${formatDisplay(args.strokeVolumeMl, 2)} mL`);
  }
  if (args.cardiacOutputLPerMin != null) {
    parts.push(
      `CO = SV×HR/1000 = ${formatDisplay(args.cardiacOutputLPerMin, 2)} L/min`,
    );
  }
  if (args.cardiacIndexLPerMinM2 != null) {
    parts.push(
      `CI = CO/BSA = ${formatDisplay(args.cardiacIndexLPerMinM2, 2)} L/min/m²`,
    );
  }
  if (args.bsaM2 != null && args.cardiacIndexLPerMinM2 == null) {
    parts.push(`BSA (Mosteller) = ${formatDisplay(args.bsaM2, 3)} m²`);
  }

  const explanation =
    parts.length > 0
      ? `${parts.join('. ')}.`
      : 'Enter measurements to see Doppler echo estimates.';

  return {
    ...args,
    formattedBsa: formatDisplay(args.bsaM2, 3),
    formattedLvotArea: formatDisplay(args.lvotAreaCm2, 4),
    formattedStrokeVolume: formatDisplay(args.strokeVolumeMl, 2),
    formattedCo: formatDisplay(args.cardiacOutputLPerMin, 2),
    formattedCi: formatDisplay(args.cardiacIndexLPerMinM2, 2),
    explanation,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

/**
 * Pure derivatives from normalized numeric values (may be partial).
 */
export function deriveOutputsFromNumbers(args: {
  heightCm: number | null;
  weightKg: number | null;
  heartRateBpm: number | null;
  lvotDiameterCm: number | null;
  lvotVtiCm: number | null;
}): DopplerEchoCardiacOutputResult {
  const bsaM2 =
    args.heightCm != null &&
    args.weightKg != null &&
    args.heightCm > 0 &&
    args.weightKg > 0
      ? (() => {
          try {
            return mostellerBsaM2(args.heightCm, args.weightKg);
          } catch {
            return null;
          }
        })()
      : null;

  const lvotAreaCm2 =
    args.lvotDiameterCm != null
      ? lvotCrossSectionalAreaCm2(args.lvotDiameterCm)
      : null;

  const strokeVol =
    lvotAreaCm2 != null && args.lvotVtiCm != null
      ? strokeVolumeMl(lvotAreaCm2, args.lvotVtiCm)
      : null;

  const co =
    strokeVol != null && args.heartRateBpm != null
      ? cardiacOutputLPerMin(strokeVol, args.heartRateBpm)
      : null;

  let ci: number | null = null;
  if (co != null && bsaM2 != null) {
    try {
      ci = cardiacIndexFromCo(co, bsaM2);
    } catch {
      ci = null;
    }
  }

  return buildDopplerEchoCardiacOutputResult({
    bsaM2,
    lvotAreaCm2,
    strokeVolumeMl: strokeVol,
    cardiacOutputLPerMin: co,
    cardiacIndexLPerMinM2: ci,
  });
}

export function deriveOutputsFromInput(
  input: DopplerEchoCardiacOutputInput,
  parsed: {
    height: number | null;
    weight: number | null;
    heartRate: number | null;
    lvotDiameter: number | null;
    lvotVti: number | null;
  },
): DopplerEchoCardiacOutputResult {
  const heightCm =
    parsed.height != null && parsed.height > 0
      ? heightToCm(parsed.height, input.heightUnit)
      : null;
  const weightKg =
    parsed.weight != null && parsed.weight > 0
      ? weightToKg(parsed.weight, input.weightUnit)
      : null;
  const lvotDiameterCm =
    parsed.lvotDiameter != null && parsed.lvotDiameter > 0
      ? lvotDiameterToCm(parsed.lvotDiameter, input.lvotDiameterUnit)
      : null;
  const lvotVtiCm =
    parsed.lvotVti != null && parsed.lvotVti > 0
      ? lvotVtiToCm(parsed.lvotVti, input.lvotVtiUnit)
      : null;

  return deriveOutputsFromNumbers({
    heightCm,
    weightKg,
    heartRateBpm: parsed.heartRate,
    lvotDiameterCm,
    lvotVtiCm,
  });
}