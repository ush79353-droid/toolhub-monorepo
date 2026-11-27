/**
 * Adult healthy weight range from BMI band — educational (ADR-018).
 *
 * Prompt / screenshot: adult BMI from 18.5 to below 25 (upper exclusive).
 * weight = BMI × height_m²
 *
 * Fixture: 180 cm → min 18.5×1.8² = 59.94 kg; upper boundary 25×1.8² = 81.00 kg exclusive.
 */

import type {
  HealthyWeightInput,
  HealthyWeightResult,
  UnitSystem,
} from './types';

export const SOURCE_NOTE =
  'Adult educational BMI band: healthy weight satisfies 18.5 ≤ BMI < 25 kg/m² (upper exclusive). Weight (kg) = BMI × height_m². Not for pediatric use.';

export const DISCLAIMER =
  'BMI-based ranges are population screening estimates — they ignore muscle mass, fat distribution, pregnancy, and clinical context. Not a diagnosis or diet plan.';

/** Inclusive lower BMI (kg/m²). */
export const BMI_MIN = 18.5;
/** Exclusive upper BMI (kg/m²) — “below 25”. */
export const BMI_MAX_EXCLUSIVE = 25;

export const METERS_PER_INCH = 0.0254;
export const KG_PER_LB = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function usHeightToMeters(ft: number, inches: number): number {
  return (ft * 12 + inches) * METERS_PER_INCH;
}

export function metersToUsParts(meters: number): { ft: number; inches: number } {
  const totalIn = meters / METERS_PER_INCH;
  const ft = Math.floor(totalIn / 12);
  const inches = totalIn - ft * 12;
  return { ft, inches };
}

export function heightInputToMeters(input: HealthyWeightInput): number | null {
  if (input.unitSystem === 'metric') {
    const cm = parseNumber(input.heightCm);
    if (cm === null) return null;
    return cm / 100;
  }
  const ft = parseNumber(input.heightFt) ?? 0;
  const inches = parseNumber(input.heightIn) ?? 0;
  if (ft === 0 && inches === 0) {
    if (
      input.heightFt.trim() === '' &&
      input.heightIn.trim() === ''
    ) {
      return null;
    }
  }
  if (!(ft >= 0) || !(inches >= 0)) return null;
  return usHeightToMeters(ft, inches);
}

export function formatKg(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(value);
}

export function formatLb(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: false,
  }).format(value);
}

/**
 * Healthy weight interval in kg: [BMI_MIN × h², BMI_MAX_EXCLUSIVE × h²).
 */
export function healthyWeightBandKg(heightMeters: number): {
  minKg: number;
  maxExclusiveKg: number;
} {
  const h2 = heightMeters * heightMeters;
  return {
    minKg: BMI_MIN * h2,
    maxExclusiveKg: BMI_MAX_EXCLUSIVE * h2,
  };
}

export function formatHealthyRange(
  minKg: number,
  maxExclusiveKg: number,
  unitSystem: UnitSystem,
): string {
  if (unitSystem === 'metric') {
    return `${formatKg(minKg)} kg ≤ weight < ${formatKg(maxExclusiveKg)} kg`;
  }
  const minLb = minKg / KG_PER_LB;
  const maxLb = maxExclusiveKg / KG_PER_LB;
  return `${formatLb(minLb)} lb ≤ weight < ${formatLb(maxLb)} lb`;
}

export function calculateHealthyWeight(
  input: HealthyWeightInput,
): HealthyWeightResult | null {
  const heightMeters = heightInputToMeters(input);
  if (heightMeters === null) return null;
  if (!(heightMeters > 0)) return null;

  const { minKg, maxExclusiveKg } = healthyWeightBandKg(heightMeters);
  const formattedRange = formatHealthyRange(
    minKg,
    maxExclusiveKg,
    input.unitSystem,
  );

  return {
    heightMeters,
    minKg,
    maxExclusiveKg,
    formattedRange,
    statusHeadline: 'Adult healthy weight range',
    statusDetail: `For height ${heightMeters.toFixed(2)} m, BMI 18.5 to below 25 implies ${formattedRange}.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
