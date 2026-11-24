/**
 * Stroke Volume — educational hemodynamics (ADR-018).
 *
 * SV (mL) = 1000 × CO (L/min) / HR (bpm)
 * BSA (m²) = √(height_cm × weight_kg / 3600) — Mosteller RD, N Engl J Med 1987
 * CI (L/min/m²) = CO / BSA
 * SVI (mL/m²) = SV / BSA
 *
 * Each output fills as soon as its own dependencies exist (prompt).
 * Sources: standard CO = SV × HR rearrangement; Mosteller BSA.
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
  'Stroke volume SV = 1000 × CO / HR; Mosteller BSA √(H_cm × W_kg / 3600) (N Engl J Med. 1987;317:1098); CI = CO/BSA; SVI = SV/BSA. Educational physiology arithmetic.';

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

/** Mosteller BSA (m²). Returns null when inputs are non-positive. */
export function mostellerBsaM2(
  heightCm: number,
  weightKg: number
): number | null {
  if (
    !Number.isFinite(heightCm) ||
    !Number.isFinite(weightKg) ||
    heightCm <= 0 ||
    weightKg <= 0
  ) {
    return null;
  }
  const bsa = Math.sqrt((heightCm * weightKg) / 3600);
  return Number.isFinite(bsa) && bsa > 0 ? bsa : null;
}

/** SV (mL) = 1000 × CO (L/min) / HR (bpm). Rejects non-positive CO or HR. */
export function strokeVolumeFromCoHr(
  coLMin: number,
  hrBpm: number
): number | null {
  if (
    !Number.isFinite(coLMin) ||
    !Number.isFinite(hrBpm) ||
    coLMin <= 0 ||
    hrBpm <= 0
  ) {
    return null;
  }
  const sv = (1000 * coLMin) / hrBpm;
  return Number.isFinite(sv) && sv > 0 ? sv : null;
}

export function cardiacIndexFromCo(
  coLMin: number,
  bsaM2: number
): number | null {
  if (
    !Number.isFinite(coLMin) ||
    !Number.isFinite(bsaM2) ||
    coLMin <= 0 ||
    bsaM2 <= 0
  ) {
    return null;
  }
  const ci = coLMin / bsaM2;
  return Number.isFinite(ci) && ci > 0 ? ci : null;
}

export function strokeVolumeIndex(
  svMl: number,
  bsaM2: number
): number | null {
  if (
    !Number.isFinite(svMl) ||
    !Number.isFinite(bsaM2) ||
    svMl <= 0 ||
    bsaM2 <= 0
  ) {
    return null;
  }
  const svi = svMl / bsaM2;
  return Number.isFinite(svi) && svi > 0 ? svi : null;
}

function formatDisplay(value: number, digits: number): string {
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
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

/**
 * Partial calculation — each metric appears when its dependencies are present.
 * Callers should pass already-validated positive canonical numbers (or null).
 */
export function calculateStrokeVolume(
  input: StrokeVolumeInput,
  parsed: {
    coLMin: number | null;
    hrBpm: number | null;
    heightCm: number | null;
    weightKg: number | null;
  }
): StrokeVolumeResult {
  const result = emptyResult();
  const parts: string[] = [];

  const sv =
    parsed.coLMin != null && parsed.hrBpm != null
      ? strokeVolumeFromCoHr(parsed.coLMin, parsed.hrBpm)
      : null;
  const bsa =
    parsed.heightCm != null && parsed.weightKg != null
      ? mostellerBsaM2(parsed.heightCm, parsed.weightKg)
      : null;

  result.strokeVolumeMl = sv;
  result.bsaM2 = bsa;

  if (sv != null) {
    const displaySv = mlToSvUnit(sv, input.svUnit);
    result.formattedSv = formatDisplay(displaySv, input.svUnit === 'L' ? 4 : 2);
    parts.push(
      `SV = 1000 × ${parsed.coLMin} / ${parsed.hrBpm} = ${formatDisplay(sv, 2)} mL`
    );
  }

  if (bsa != null) {
    const displayBsa = m2ToBsaUnit(bsa, input.bsaUnit);
    result.formattedBsa = formatDisplay(
      displayBsa,
      input.bsaUnit === 'ft2' ? 2 : 3
    );
    parts.push(
      `BSA (Mosteller) = ${formatDisplay(bsa, 3)} m²`
    );
  }

  if (parsed.coLMin != null && bsa != null) {
    const ci = cardiacIndexFromCo(parsed.coLMin, bsa);
    result.cardiacIndex = ci;
    if (ci != null) {
      result.formattedCi = formatDisplay(ci, 2);
      parts.push(`CI = ${formatDisplay(ci, 2)} L/min/m²`);
    }
  }

  if (sv != null && bsa != null) {
    const svi = strokeVolumeIndex(sv, bsa);
    result.strokeVolumeIndex = svi;
    if (svi != null) {
      result.formattedSvi = formatDisplay(svi, 2);
      parts.push(`SVI = ${formatDisplay(svi, 2)} mL/m²`);
    }
  }

  if (parts.length > 0) {
    result.explanation = parts.join('. ') + '.';
  }

  return result;
}
