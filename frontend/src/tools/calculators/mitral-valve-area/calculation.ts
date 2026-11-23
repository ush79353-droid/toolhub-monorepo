/**
 * Mitral Valve Area — educational Doppler estimates (ADR-018).
 *
 * Continuity: CSA_LVOT = π(d/2)²; MVA = CSA × VTI_LVOT / VTI_MV
 * Pressure half-time (Hatle): MVA = 220 / PHT_ms
 * Deceleration time: PHT ≈ 0.29 × DT_ms → MVA = 220 / PHT
 *
 * Limitations: significant AR / altered compliance can invalidate PHT/DT;
 * continuity assumes no significant shunt/regurgitation between sample sites.
 *
 * Sources: Hatle et al. Circulation 1979; Nakatani et al. Circulation 1988;
 * standard echo texts relating PHT ≈ 0.29 × DT.
 */

import type {
  AreaUnit,
  LengthUnit,
  MitralValveAreaResult,
  MvaMethod,
  TimeUnit,
  VtiUnit,
} from './types';

export const SOURCE_LABEL =
  'Hatle L et al. Circulation 1979 (PHT); continuity-equation Doppler MVA; PHT ≈ 0.29 × deceleration time (standard echo relation).';

export const DISCLAIMER =
  'Educational mitral valve area estimate only. It does not diagnose mitral stenosis, grade severity for intervention, or replace echocardiography interpreted by a qualified clinician.';

export const LIMITATION_NOTE =
  'Pressure half-time / deceleration methods can be unreliable with significant aortic regurgitation, tachycardia, or abnormal chamber compliance. Continuity assumes representative stroke volumes without major intervening shunt or regurgitation.';

/** Hatle empirical constant (ms·cm²). */
export const HATLE_CONSTANT_MS = 220;

/** PHT ≈ k × DT (dimensionless). */
export const PHT_FROM_DT_FACTOR = 0.29;

export const MAX_LVOT_CM = 5;
export const MAX_VTI_CM = 500;
export const MAX_PHT_MS = 5000;
export const MAX_DT_MS = 10000;

export function lengthToCm(value: number, unit: LengthUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'mm' ? value / 10 : value;
}

export function cmToLength(cm: number, unit: LengthUnit): number {
  return unit === 'mm' ? cm * 10 : cm;
}

export function vtiToCm(value: number, unit: VtiUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'm' ? value * 100 : value;
}

export function cmToVti(cm: number, unit: VtiUnit): number {
  return unit === 'm' ? cm / 100 : cm;
}

export function timeToMs(value: number, unit: TimeUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 's' ? value * 1000 : value;
}

export function msToTime(ms: number, unit: TimeUnit): number {
  return unit === 's' ? ms / 1000 : ms;
}

export function cm2ToArea(cm2: number, unit: AreaUnit): number {
  return unit === 'mm2' ? cm2 * 100 : cm2;
}

export function lvotAreaCm2(diameterCm: number): number | null {
  if (!Number.isFinite(diameterCm) || diameterCm <= 0) return null;
  if (diameterCm > MAX_LVOT_CM) return null;
  return Math.PI * (diameterCm / 2) ** 2;
}

export function mvaContinuityCm2(
  diameterCm: number,
  lvotVtiCm: number,
  mitralVtiCm: number
): number | null {
  const area = lvotAreaCm2(diameterCm);
  if (area == null) return null;
  if (!Number.isFinite(lvotVtiCm) || lvotVtiCm <= 0 || lvotVtiCm > MAX_VTI_CM) {
    return null;
  }
  if (
    !Number.isFinite(mitralVtiCm) ||
    mitralVtiCm <= 0 ||
    mitralVtiCm > MAX_VTI_CM
  ) {
    return null;
  }
  const mva = (area * lvotVtiCm) / mitralVtiCm;
  if (!Number.isFinite(mva) || mva <= 0) return null;
  return mva;
}

export function mvaFromPhtMs(phtMs: number): number | null {
  if (!Number.isFinite(phtMs) || phtMs <= 0 || phtMs > MAX_PHT_MS) return null;
  const mva = HATLE_CONSTANT_MS / phtMs;
  if (!Number.isFinite(mva) || mva <= 0) return null;
  return mva;
}

export function phtFromDtMs(dtMs: number): number | null {
  if (!Number.isFinite(dtMs) || dtMs <= 0 || dtMs > MAX_DT_MS) return null;
  return PHT_FROM_DT_FACTOR * dtMs;
}

export function mvaFromDtMs(dtMs: number): number | null {
  const pht = phtFromDtMs(dtMs);
  if (pht == null) return null;
  return mvaFromPhtMs(pht);
}

function formatArea(cm2: number, unit: AreaUnit): string {
  const display = cm2ToArea(cm2, unit);
  const digits = unit === 'mm2' ? 1 : 3;
  return display.toFixed(digits);
}

export function calculateMitralValveArea(
  method: MvaMethod,
  areaUnit: AreaUnit,
  args: {
    diameterCm?: number;
    lvotVtiCm?: number;
    mitralVtiCm?: number;
    phtMs?: number;
    dtMs?: number;
  }
): MitralValveAreaResult | null {
  if (method === 'continuity') {
    if (
      args.diameterCm == null ||
      args.lvotVtiCm == null ||
      args.mitralVtiCm == null
    ) {
      return null;
    }
    const area = lvotAreaCm2(args.diameterCm);
    const mva = mvaContinuityCm2(
      args.diameterCm,
      args.lvotVtiCm,
      args.mitralVtiCm
    );
    if (area == null || mva == null) return null;
    return {
      method,
      mvaCm2: mva,
      mvaDisplay: cm2ToArea(mva, areaUnit),
      formattedMva: formatArea(mva, areaUnit),
      lvotAreaCm2: area,
      formattedLvotArea: formatArea(area, areaUnit),
      explanation: `MVA = π(d/2)² × LVOT VTI / mitral VTI = ${formatArea(mva, areaUnit)} ${areaUnit === 'mm2' ? 'mm²' : 'cm²'}.`,
      limitationNote: LIMITATION_NOTE,
      disclaimer: DISCLAIMER,
      sourceLabel: SOURCE_LABEL,
    };
  }

  if (method === 'pht') {
    if (args.phtMs == null) return null;
    const mva = mvaFromPhtMs(args.phtMs);
    if (mva == null) return null;
    return {
      method,
      mvaCm2: mva,
      mvaDisplay: cm2ToArea(mva, areaUnit),
      formattedMva: formatArea(mva, areaUnit),
      lvotAreaCm2: null,
      formattedLvotArea: null,
      explanation: `MVA = 220 / PHT = 220 / ${args.phtMs.toFixed(0)} ms = ${formatArea(mva, areaUnit)} ${areaUnit === 'mm2' ? 'mm²' : 'cm²'}.`,
      limitationNote: LIMITATION_NOTE,
      disclaimer: DISCLAIMER,
      sourceLabel: SOURCE_LABEL,
    };
  }

  if (args.dtMs == null) return null;
  const pht = phtFromDtMs(args.dtMs);
  const mva = mvaFromDtMs(args.dtMs);
  if (pht == null || mva == null) return null;
  return {
    method,
    mvaCm2: mva,
    mvaDisplay: cm2ToArea(mva, areaUnit),
    formattedMva: formatArea(mva, areaUnit),
    lvotAreaCm2: null,
    formattedLvotArea: null,
    explanation: `PHT ≈ 0.29 × DT = ${pht.toFixed(1)} ms; MVA = 220 / PHT = ${formatArea(mva, areaUnit)} ${areaUnit === 'mm2' ? 'mm²' : 'cm²'}.`,
    limitationNote: LIMITATION_NOTE,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
