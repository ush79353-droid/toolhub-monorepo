/**
 * ICH volume — educational ABC/2 (and ABC/3 for irregular) estimator.
 *
 * Ellipsoid/round: V = A×B×C / 2 (Kothari/Kwak ellipsoid approximation).
 * Irregular/separated/multinodular: V = A×B×C / 3 (Huttner 2006 suggestion).
 *
 * C (cm) =
 *   - Simplified: numberOfSlices × sliceThicknessCm, or
 *   - Weighted (Kothari): (n≥75 + 0.5×n25–75 + 0×n<25) × sliceThicknessCm
 *
 * A, B are orthogonal diameters on the largest axial slice (cm).
 * Do not mix simplified slice count with weighted counts in one C.
 */

import type { HemorrhageShape, IchVolumeInput, IchVolumeResult } from './types';

export const SOURCE_LABEL =
  'Educational ABC/2 (Kothari Stroke 1996; Kwak simplified C) and ABC/3 for irregular shapes (Huttner 2006). Not a substitute for planimetry or clinical judgment.';

export const DISCLAIMER =
  'Educational CT volume estimate only. Irregular, multilobulated, and anticoagulation-related hematomas may be mis-estimated. Not for treatment decisions.';

export function divisorForShape(shape: HemorrhageShape): 2 | 3 {
  return shape === 'irregular' ? 3 : 2;
}

export function formulaLabelForShape(shape: HemorrhageShape): string {
  return shape === 'irregular' ? 'ABC/3' : 'ABC/2';
}

export function mmToCm(mm: number): number {
  return mm / 10;
}

/** Kothari weights: ≥75% → 1, 25–75% → 0.5, <25% → 0. */
export function weightedSliceSum(
  ge75: number,
  mid: number,
  lt25: number
): number {
  return ge75 * 1 + mid * 0.5 + lt25 * 0;
}

export function calculateIchVolume(params: {
  lengthCm: number;
  widthCm: number;
  sliceThicknessMm: number;
  shape: HemorrhageShape;
  numberOfSlices: number | null;
  slicesGe75: number | null;
  slices25to75: number | null;
  slicesLt25: number | null;
  usedWeightedSlices: boolean;
}): IchVolumeResult {
  const thicknessCm = mmToCm(params.sliceThicknessMm);
  let weightedSliceCount: number | null = null;
  let cCm: number;

  if (params.usedWeightedSlices) {
    const ge = params.slicesGe75 ?? 0;
    const mid = params.slices25to75 ?? 0;
    const lt = params.slicesLt25 ?? 0;
    weightedSliceCount = weightedSliceSum(ge, mid, lt);
    cCm = weightedSliceCount * thicknessCm;
  } else {
    cCm = (params.numberOfSlices ?? 0) * thicknessCm;
  }

  const divisor = divisorForShape(params.shape);
  const volumeMl = (params.lengthCm * params.widthCm * cCm) / divisor;
  const formulaLabel = formulaLabelForShape(params.shape);

  const rounded =
    Math.abs(volumeMl) >= 100
      ? Math.round(volumeMl)
      : Math.round(volumeMl * 100) / 100;

  return {
    volumeMl: rounded,
    formattedVolumeMl: String(rounded),
    cCm,
    weightedSliceCount,
    usedWeightedSlices: params.usedWeightedSlices,
    divisor,
    formulaLabel,
    explanation: params.usedWeightedSlices
      ? `${formulaLabel}: A×B×C/${divisor} with Kothari-weighted C = ${weightedSliceCount} × ${thicknessCm} cm slice thickness → C = ${cCm} cm → ${rounded} mL.`
      : `${formulaLabel}: A×B×C/${divisor} with C = ${params.numberOfSlices} slices × ${thicknessCm} cm → C = ${cCm} cm → ${rounded} mL.`,
    disclaimer: DISCLAIMER,
  };
}

/** Pure helper kept for tests — accepts already-parsed numbers via validation. */
export function calculateFromInput(
  _input: IchVolumeInput,
  parsed: Parameters<typeof calculateIchVolume>[0]
): IchVolumeResult {
  return calculateIchVolume(parsed);
}
