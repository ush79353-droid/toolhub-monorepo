/**
 * Stroke Volume Calculator — UI stub (engine commit fills physiology math).
 *
 * Planned formulas (screenshot / prompt):
 * - SV (mL) = 1000 × CO (L/min) / HR (bpm)
 * - BSA (m²) = √(height_cm × weight_kg / 3600) (Mosteller)
 * - CI = CO / BSA ; SVI = SV / BSA
 */

import type {
  BsaUnit,
  CoUnit,
  HeightUnit,
  StrokeVolumeInput,
  StrokeVolumeResult,
  SvUnit,
  WeightUnit,
} from './types';

export const SOURCE_LABEL =
  'Stroke volume SV = 1000 × CO / HR; Mosteller BSA √(H_cm × W_kg / 3600); CI = CO/BSA; SVI = SV/BSA. Educational physiology arithmetic.';

export const DISCLAIMER =
  'Educational hemodynamics arithmetic only. Does not interpret imaging, guide therapy, or replace clinical assessment.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function coToLPerMin(value: number, unit: CoUnit): number {
  return unit === 'mL/min' ? value / 1000 : value;
}

export function lPerMinToCoUnit(lPerMin: number, unit: CoUnit): number {
  return unit === 'mL/min' ? lPerMin * 1000 : lPerMin;
}

export function mlToSvUnit(ml: number, unit: SvUnit): number {
  return unit === 'L' ? ml / 1000 : ml;
}

export function svUnitToMl(value: number, unit: SvUnit): number {
  return unit === 'L' ? value * 1000 : value;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  return unit === 'in' ? value * 2.54 : value;
}

export function cmToHeightUnit(cm: number, unit: HeightUnit): number {
  return unit === 'in' ? cm / 2.54 : cm;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * 0.45359237 : value;
}

export function kgToWeightUnit(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / 0.45359237 : kg;
}

export function m2ToBsaUnit(m2: number, unit: BsaUnit): number {
  return unit === 'ft2' ? m2 * 10.76391041671 : m2;
}

export function emptyResult(): StrokeVolumeResult {
  return {
    strokeVolumeMl: null,
    bsaM2: null,
    cardiacIndex: null,
    strokeVolumeIndex: null,
    formattedSv: '',
    formattedBsa: '',
    formattedCi: '',
    formattedSvi: '',
    explanation: '',
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

/** UI stub — returns empty partial result until the engine commit. */
export function calculateStrokeVolume(
  _input: StrokeVolumeInput
): StrokeVolumeResult {
  return emptyResult();
}
