/**
 * EROA (PISA) — mitral regurgitation educational worksheet.
 *
 * Instantaneous regurgitant flow (mL/s) = 2π r² Va  (hemispherical convergence;
 * r cm, Va cm/s → cm³/s = mL/s).
 * EROA (cm²) = flow / Vmax
 * Regurgitant volume (mL/beat) = EROA × VTI
 *
 * Sources: ASE valvular regurgitation quantitative PISA method (hemispheric
 * aliasing surface); classic EROA = 2πr²Va / Vmax.
 */

import type {
  AreaUnit,
  FlowUnit,
  LengthUnit,
  SpeedUnit,
  VolumeUnit,
} from './types';

export const SOURCE_LABEL =
  'PISA / proximal isovelocity surface area method for mitral regurgitant flow and EROA (hemispherical 2πr²Va), as used in ASE quantitative valvular regurgitation teaching summaries.';

export const DISCLAIMER =
  'Educational PISA arithmetic assuming hemispherical convergence. Does not grade MR severity, replace imaging quality checks, or account for constrained/non-hemispheric geometry.';

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

/** Instantaneous flow mL/s = 2π r² Va (r cm, Va cm/s). */
export function pisaFlowMlPerS(radiusCm: number, vaCmPerS: number): number | null {
  if (
    !Number.isFinite(radiusCm) ||
    !Number.isFinite(vaCmPerS) ||
    radiusCm <= 0 ||
    vaCmPerS <= 0
  ) {
    return null;
  }
  return 2 * Math.PI * radiusCm * radiusCm * vaCmPerS;
}

export function eroaCm2(flowMlPerS: number, vmaxCmPerS: number): number | null {
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

export function displayToFlowMlPerS(value: number, unit: FlowUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  switch (unit) {
    case 'L/s':
      return value * 1000;
    case 'mL/min':
      return value / 60;
    default:
      return value;
  }
}

export function areaToDisplay(cm2: number, unit: AreaUnit): number {
  return unit === 'mm2' ? cm2 * 100 : cm2;
}

export function displayToAreaCm2(value: number, unit: AreaUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  return unit === 'mm2' ? value / 100 : value;
}

export function volumeToDisplay(ml: number, unit: VolumeUnit): number {
  return unit === 'L' ? ml / 1000 : ml;
}

export function formatFixed(value: number, digits: number): string {
  if (!Number.isFinite(value)) return '';
  return value.toFixed(digits);
}
