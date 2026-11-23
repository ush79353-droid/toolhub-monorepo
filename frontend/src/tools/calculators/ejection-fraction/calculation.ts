/**
 * Ejection Fraction — educational ventricular pump fraction.
 *
 * EF% = 100 × SV / EDV
 * SV from: entered SV; or EDV − ESV; or 1000 × CO(L/min) / HR(bpm)
 *
 * Sources: standard echocardiographic EF identity (SV/EDV); CO = SV × HR
 * rearranged for SV (mL) = 1000 × CO(L/min) / HR(bpm).
 */

import type { EjectionFractionInput, EjectionFractionResult } from './types';

export const SOURCE_LABEL =
  'Standard echocardiographic ejection-fraction identity EF = SV/EDV; stroke volume from ESV (SV = EDV − ESV) or from cardiac output (SV_mL = 1000 × CO_L/min / HR_bpm).';

export const DISCLAIMER =
  'Educational arithmetic only. Does not grade heart failure, interpret imaging, or replace clinical assessment of ventricular function.';

export function strokeVolumeFromEsv(
  edvMl: number,
  esvMl: number
): number | null {
  if (
    !Number.isFinite(edvMl) ||
    !Number.isFinite(esvMl) ||
    edvMl <= 0 ||
    esvMl < 0 ||
    esvMl > edvMl
  ) {
    return null;
  }
  return edvMl - esvMl;
}

/** SV (mL) = 1000 × CO (L/min) / HR (bpm). */
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

export function ejectionFractionPercent(
  strokeVolumeMl: number,
  edvMl: number
): number | null {
  if (
    !Number.isFinite(strokeVolumeMl) ||
    !Number.isFinite(edvMl) ||
    edvMl <= 0 ||
    strokeVolumeMl < 0 ||
    strokeVolumeMl > edvMl
  ) {
    return null;
  }
  const ef = (100 * strokeVolumeMl) / edvMl;
  return Number.isFinite(ef) ? ef : null;
}

export function calculateEjectionFraction(
  input: EjectionFractionInput,
  parsed: {
    edvMl: number;
    strokeVolumeMl?: number;
    esvMl?: number;
    cardiacOutputLMin?: number;
    heartRateBpm?: number;
  }
): EjectionFractionResult | null {
  const { edvMl } = parsed;
  let sv: number | null = null;
  let explanation = '';

  switch (input.mode) {
    case 'sv':
      sv = parsed.strokeVolumeMl ?? null;
      if (sv == null) return null;
      explanation = `EF = 100 × SV / EDV = 100 × ${sv} / ${edvMl}.`;
      break;
    case 'esv': {
      if (parsed.esvMl == null) return null;
      sv = strokeVolumeFromEsv(edvMl, parsed.esvMl);
      if (sv == null) return null;
      explanation = `SV = EDV − ESV = ${edvMl} − ${parsed.esvMl} = ${sv} mL; EF = 100 × SV / EDV.`;
      break;
    }
    case 'coHr': {
      if (parsed.cardiacOutputLMin == null || parsed.heartRateBpm == null) {
        return null;
      }
      sv = strokeVolumeFromCoHr(
        parsed.cardiacOutputLMin,
        parsed.heartRateBpm
      );
      if (sv == null) return null;
      explanation = `SV = 1000 × CO / HR = 1000 × ${parsed.cardiacOutputLMin} / ${parsed.heartRateBpm} ≈ ${Number(sv.toFixed(2))} mL; EF = 100 × SV / EDV.`;
      break;
    }
    default:
      return null;
  }

  const ef = ejectionFractionPercent(sv, edvMl);
  if (ef == null) return null;

  return {
    edvMl,
    strokeVolumeMl: sv,
    ejectionFractionPercent: ef,
    formattedEf: ef.toFixed(1).replace(/\.0$/, ''),
    explanation,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
