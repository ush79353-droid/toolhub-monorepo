/**
 * PISA — proximal isovelocity surface area educational worksheet.
 *
 * Hemispherical shell: A = 2π r² (r in cm → cm²).
 * Leaflet / MS angle correction: A_α = A × (α° / 180).
 * Blank α is treated as 180° (full hemisphere).
 * Volume flow rate (mL/s) = A_α × Vr (Vr in cm/s).
 * Orifice area (cm²) = VFR / Vmax — labeled MVA (stenosis) and EROA (regurgitation).
 * EROA mm² = 100 × cm²; RVol (mL/beat) = EROA_cm² × VTI_cm.
 *
 * Sources: ASE quantitative valvular regurgitation / MS PISA teaching summaries
 * (hemispheric 2πr²Va; α/180 constrained-leaflet correction for MS).
 */

import type { AreaUnit, FlowUnit, LengthUnit, SpeedUnit, VolumeUnit } from './types';

export const SOURCE_LABEL =
  'PISA / proximal isovelocity surface area method (hemispherical 2πr² × Vr; α/180 leaflet constraint for mitral stenosis), as used in ASE quantitative valvular teaching summaries.';

export const DISCLAIMER =
  'Educational PISA arithmetic. Assumes hemispheric convergence with optional α/180 correction. Does not grade stenosis or regurgitation, replace imaging quality checks, or choose the clinical jet path for you.';

/** Blank α → full hemisphere (180°). */
export const DEFAULT_ALPHA_DEG = 180;

export function speedToCmPerS(value: number, unit: SpeedUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  return unit === 'm/s' ? value * 100 : value;
}

export function cmPerSToSpeedUnit(cmPerS: number, unit: SpeedUnit): number {
  return unit === 'm/s' ? cmPerS / 100 : cmPerS;
}

export function lengthToCm(value: number, unit: LengthUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  switch (unit) {
    case 'cm':
      return value;
    case 'mm':
      return value / 10;
    case 'm':
      return value * 100;
    default:
      return null;
  }
}

export function cmToLengthUnit(cm: number, unit: LengthUnit): number {
  switch (unit) {
    case 'cm':
      return cm;
    case 'mm':
      return cm * 10;
    case 'm':
      return cm / 100;
    default:
      return cm;
  }
}

/** Full hemispherical surface 2πr² (cm²). */
export function hemisphereSurfaceCm2(radiusCm: number): number | null {
  if (!Number.isFinite(radiusCm) || radiusCm <= 0) return null;
  return 2 * Math.PI * radiusCm * radiusCm;
}

/**
 * Angle-corrected PISA surface (cm²).
 * α in (0, 180]; factor = α/180. α = 180 → full hemisphere.
 */
export function angleCorrectedPisaCm2(
  radiusCm: number,
  alphaDeg: number
): number | null {
  const base = hemisphereSurfaceCm2(radiusCm);
  if (base == null) return null;
  if (!Number.isFinite(alphaDeg) || alphaDeg <= 0 || alphaDeg > 180) return null;
  return base * (alphaDeg / 180);
}

/** VFR mL/s = A_α × Vr. */
export function volumeFlowRateMlPerS(
  pisaCm2: number,
  vrCmPerS: number
): number | null {
  if (
    !Number.isFinite(pisaCm2) ||
    !Number.isFinite(vrCmPerS) ||
    pisaCm2 <= 0 ||
    vrCmPerS <= 0
  ) {
    return null;
  }
  return pisaCm2 * vrCmPerS;
}

/** Orifice area cm² = VFR / Vmax (MVA or EROA). */
export function orificeAreaCm2(
  flowMlPerS: number,
  vmaxCmPerS: number
): number | null {
  if (
    !Number.isFinite(flowMlPerS) ||
    !Number.isFinite(vmaxCmPerS) ||
    flowMlPerS <= 0 ||
    vmaxCmPerS <= 0
  ) {
    return null;
  }
  return flowMlPerS / vmaxCmPerS;
}

export function regurgitantVolumeMl(
  eroaCm2Value: number,
  vtiCm: number
): number | null {
  if (
    !Number.isFinite(eroaCm2Value) ||
    !Number.isFinite(vtiCm) ||
    eroaCm2Value <= 0 ||
    vtiCm <= 0
  ) {
    return null;
  }
  return eroaCm2Value * vtiCm;
}

export function flowToDisplay(mlPerS: number, unit: FlowUnit): number {
  switch (unit) {
    case 'L/s':
      return mlPerS / 1000;
    case 'mL/min':
      return mlPerS * 60;
    default:
      return mlPerS;
  }
}

export function areaToDisplay(cm2: number, unit: AreaUnit): number {
  return unit === 'mm2' ? cm2 * 100 : cm2;
}

export function volumeToDisplay(ml: number, unit: VolumeUnit): number {
  return unit === 'L' ? ml / 1000 : ml;
}

export function formatFixed(value: number, digits: number): string {
  if (!Number.isFinite(value)) return '';
  return value.toFixed(digits);
}
