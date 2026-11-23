/**
 * Gorlin valve area (catheter hemodynamics) — educational.
 *
 * Area (cm²) = (CO_mL_per_min) / (HR × period_s_per_beat × K × √mean_gradient_mmHg)
 *
 * K_aortic = 44.3 (discharge coefficient 1.0 × √(2g))
 * K_mitral = 37.7 ≈ 44.3 × 0.85 (Cohen–Gorlin mitral empiric coefficient)
 *
 * Sources: Gorlin R, Gorlin SG. Am Heart J. 1951; Cohen–Gorlin mitral revision;
 * modern cath summaries (JSCAI 2022).
 */

import type {
  AreaUnit,
  FlowUnit,
  GorlinResult,
  GorlinValveResult,
  PeriodUnit,
  PressureUnit,
} from './types';

export const SOURCE_LABEL =
  'Gorlin R, Gorlin SG. Hydraulic formula for calculation of the area of the stenotic mitral valve, other cardiac valves, and central circulatory shunts. Am Heart J. 1951;41:1–29; mitral empiric coefficient ≈0.85 (Cohen–Gorlin) → K≈37.7.';

export const DISCLAIMER =
  'Educational Gorlin estimate only. It does not diagnose stenosis severity or replace catheterization interpreted by a qualified clinician. Low flow and regurgitation can bias calculated areas.';

export const AORTIC_K = 44.3;
export const MITRAL_K = 37.7;

export function flowToMlPerMin(value: number, unit: FlowUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'Lmin' ? value * 1000 : value;
}

export function pressureToMmHg(
  value: number,
  unit: PressureUnit
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'kPa' ? value * 7.500616827 : value;
}

export function periodToSec(value: number, unit: PeriodUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'msec' ? value / 1000 : value;
}

export function cm2ToArea(cm2: number, unit: AreaUnit): number {
  return unit === 'mm2' ? cm2 * 100 : cm2;
}

export function formatArea(value: number, unit: AreaUnit): string {
  const digits = unit === 'mm2' ? 1 : 2;
  return String(Number(value.toFixed(digits)));
}

/**
 * Classic Gorlin orifice area. Rejects non-positive inputs and non-finite results.
 */
export function computeGorlinAreaCm2(
  coMlPerMin: number,
  heartRateBpm: number,
  periodSecPerBeat: number,
  meanGradientMmHg: number,
  empiricK: number
): number | null {
  if (
    !Number.isFinite(coMlPerMin) ||
    !Number.isFinite(heartRateBpm) ||
    !Number.isFinite(periodSecPerBeat) ||
    !Number.isFinite(meanGradientMmHg) ||
    !Number.isFinite(empiricK)
  ) {
    return null;
  }
  if (
    coMlPerMin <= 0 ||
    heartRateBpm <= 0 ||
    periodSecPerBeat <= 0 ||
    meanGradientMmHg <= 0 ||
    empiricK <= 0
  ) {
    return null;
  }
  const denom =
    heartRateBpm *
    periodSecPerBeat *
    empiricK *
    Math.sqrt(meanGradientMmHg);
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const area = coMlPerMin / denom;
  if (!Number.isFinite(area) || area < 0) return null;
  return area;
}

export function toValveResult(
  areaCm2: number,
  unit: AreaUnit
): GorlinValveResult {
  const areaDisplay = cm2ToArea(areaCm2, unit);
  return {
    areaCm2,
    areaDisplay,
    formattedArea: formatArea(areaDisplay, unit),
  };
}

export function calculateGorlin(
  coMlPerMin: number | null,
  heartRateBpm: number | null,
  aorticPeriodSec: number | null,
  aorticGradientMmHg: number | null,
  aorticAreaUnit: AreaUnit,
  mitralPeriodSec: number | null,
  mitralGradientMmHg: number | null,
  mitralAreaUnit: AreaUnit
): GorlinResult {
  let aortic: GorlinValveResult | null = null;
  let mitral: GorlinValveResult | null = null;

  if (
    coMlPerMin != null &&
    heartRateBpm != null &&
    aorticPeriodSec != null &&
    aorticGradientMmHg != null
  ) {
    const a = computeGorlinAreaCm2(
      coMlPerMin,
      heartRateBpm,
      aorticPeriodSec,
      aorticGradientMmHg,
      AORTIC_K
    );
    if (a != null) aortic = toValveResult(a, aorticAreaUnit);
  }

  if (
    coMlPerMin != null &&
    heartRateBpm != null &&
    mitralPeriodSec != null &&
    mitralGradientMmHg != null
  ) {
    const m = computeGorlinAreaCm2(
      coMlPerMin,
      heartRateBpm,
      mitralPeriodSec,
      mitralGradientMmHg,
      MITRAL_K
    );
    if (m != null) mitral = toValveResult(m, mitralAreaUnit);
  }

  return {
    aortic,
    mitral,
    explanation:
      'Area = CO(mL/min) ÷ (HR × period × K × √mean gradient). Aortic K = 44.3; mitral K = 37.7 (≈44.3×0.85). Panels are independent once shared CO and HR are set.',
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
