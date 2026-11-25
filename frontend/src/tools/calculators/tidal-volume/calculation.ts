/**
 * Tidal volume range (6–8 mL/kg Devine IBW) + Chula Ideal ETT depth.
 *
 * IBW (Devine inch form): female 45.5 + 2.3×(height_in − 60); male 50 + 2.3×(height_in − 60).
 * (Approximate SI: female 45.5 + 0.9×(height_cm − 152); male 50 + 0.9×(height_cm − 152).)
 * ETT depth (cm, right upper canine): 0.1 × height_cm + 4 (Chula / Techanivate 2005).
 *
 * Educational only — not a ventilator or intubation order.
 */

import { DISCLAIMER, SOURCE_NOTE } from './content';
import type {
  DepthUnit,
  HeightUnit,
  Sex,
  TidalVolumeInput,
  TidalVolumeResult,
  VolumeUnit,
} from './types';

export { DISCLAIMER, SOURCE_NOTE };

/** Devine IBW formulas assume adult stature near or above 152 cm / 60 in. */
export const MIN_HEIGHT_CM = 100;
export const MAX_HEIGHT_CM = 250;

export function heightToCm(value: number, unit: HeightUnit): number {
  if (unit === 'cm') return value;
  if (unit === 'm') return value * 100;
  return value * 2.54;
}

export function cmToHeightUnit(cm: number, unit: HeightUnit): number {
  if (unit === 'cm') return cm;
  if (unit === 'm') return cm / 100;
  return cm / 2.54;
}

export function depthFromCm(cm: number, unit: DepthUnit): number {
  return unit === 'cm' ? cm : cm / 2.54;
}

export function volumeFromMl(ml: number, unit: VolumeUnit): number {
  return unit === 'mL' ? ml : ml / 1000;
}

/**
 * Devine ideal body weight (kg) from height in cm and sex.
 * Uses the inch form (canonical Devine / ARDSnet PBW style) so 167 cm ≈ 58.73 kg female.
 */
export function idealBodyWeightKg(heightCm: number, sex: Sex): number {
  const heightIn = heightCm / 2.54;
  const delta = heightIn - 60;
  return sex === 'female' ? 45.5 + 2.3 * delta : 50 + 2.3 * delta;
}

/** Chula Ideal ETT depth from right upper canine (cm). */
export function chulaEttDepthCm(heightCm: number): number {
  return 0.1 * heightCm + 4;
}

export function formatNumber(value: number, digits: number): string {
  const f = 10 ** digits;
  return String(Math.round(value * f) / f);
}

export function formatVolume(ml: number, unit: VolumeUnit): string {
  const v = volumeFromMl(ml, unit);
  if (unit === 'mL') return `${formatNumber(v, 0)} mL`;
  return `${formatNumber(v, 3)} L`;
}

export function formatDepth(cm: number, unit: DepthUnit): string {
  const v = depthFromCm(cm, unit);
  return unit === 'cm'
    ? `${formatNumber(v, 1)} cm`
    : `${formatNumber(v, 2)} in`;
}

export function calculateTidalVolume(input: TidalVolumeInput): TidalVolumeResult {
  const empty: TidalVolumeResult = {
    heightCm: null,
    ibwKg: null,
    vtMinMl: null,
    vtMaxMl: null,
    ettDepthCm: null,
    formattedIbw: '',
    formattedVtMin: '',
    formattedVtMax: '',
    formattedEttDepth: '',
    statusHeadline: 'Enter height',
    statusDetail:
      'Enter patient height and sex. Results show Devine IBW, a 6–8 mL/kg tidal-volume band, and Chula Ideal ETT depth.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (input.height == null || !Number.isFinite(input.height)) {
    return empty;
  }

  const heightCm = heightToCm(input.height, input.heightUnit);
  if (!(heightCm >= MIN_HEIGHT_CM && heightCm <= MAX_HEIGHT_CM)) {
    return {
      ...empty,
      statusHeadline: 'Height out of range',
      statusDetail: `Use a stature between ${MIN_HEIGHT_CM} and ${MAX_HEIGHT_CM} cm (or equivalent). Devine IBW is an adult formula.`,
    };
  }

  const ibwKg = idealBodyWeightKg(heightCm, input.sex);
  if (!(ibwKg > 0) || !Number.isFinite(ibwKg)) {
    return {
      ...empty,
      heightCm,
      statusHeadline: 'IBW not defined',
      statusDetail:
        'Devine IBW is non-positive for this stature. Confirm height units and use an adult-scale measurement.',
    };
  }

  const vtMinMl = 6 * ibwKg;
  const vtMaxMl = 8 * ibwKg;
  const ettDepthCm = chulaEttDepthCm(heightCm);

  return {
    heightCm,
    ibwKg,
    vtMinMl,
    vtMaxMl,
    ettDepthCm,
    formattedIbw: `${formatNumber(ibwKg, 2)} kg`,
    formattedVtMin: formatVolume(vtMinMl, input.volumeUnit),
    formattedVtMax: formatVolume(vtMaxMl, input.volumeUnit),
    formattedEttDepth: formatDepth(ettDepthCm, input.depthUnit),
    statusHeadline: 'Tidal volume range and Ideal ETT depth',
    statusDetail: `IBW ${formatNumber(ibwKg, 2)} kg · VT ${formatNumber(vtMinMl, 0)}–${formatNumber(vtMaxMl, 0)} mL (6–8 mL/kg) · Chula depth ${formatNumber(ettDepthCm, 1)} cm from right upper canine. Educational only.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
