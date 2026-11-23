/**
 * Cerebral Perfusion Pressure — educational MAP − ICP worksheet.
 *
 * CPP = MAP − ICP (mmHg).
 * Approximate MAP from cuff pressures: (SBP + 2×DBP) / 3.
 *
 * Age-group bands are educational literature reference ranges summarized from
 * age-specific CPP discussions (Allen et al., Pediatr Crit Care Med.
 * 2014;15(1):62–70 and related teaching tables). They are NOT treatment targets.
 *
 * Sources: Hawryluk et al. Intensive Care Med. 2022 (ICP physiology overview);
 * Allen et al. Pediatr Crit Care Med. 2014 (age-specific CPP thresholds study).
 */

import { CPP_SOURCE_NOTE } from './content';
import type {
  CerebralPerfusionPressureResult,
  CppAgeGroup,
  MapSource,
} from './types';

export const SOURCE_LABEL = CPP_SOURCE_NOTE;

export const DISCLAIMER =
  'Educational arithmetic only. Age-group bands are literature reference ranges, not individualized treatment targets. Not medical advice and not a substitute for monitored care by a qualified clinician.';

/** Practical entry bounds (mmHg) — reject non-physical extremes, not clinical gates. */
export const MIN_PRESSURE_MMHG = -20;
export const MAX_PRESSURE_MMHG = 400;

/** Educational literature reference bands by age group (mmHg). Not targets. */
export const AGE_REFERENCE_BANDS: Record<
  CppAgeGroup,
  { low: number; high: number; label: string }
> = {
  '0-5': { low: 30, high: 40, label: '30–40 mmHg (ages 0–5, educational)' },
  '6-11': { low: 35, high: 50, label: '35–50 mmHg (ages 6–11, educational)' },
  '12-17': { low: 50, high: 60, label: '50–60 mmHg (ages 12–17, educational)' },
  '18+': { low: 60, high: 80, label: '60–80 mmHg (18 years or older, educational)' },
};

/**
 * Approximate MAP from systolic and diastolic pressures.
 * MAP = (SBP + 2×DBP) / 3 = DBP + (SBP − DBP) / 3.
 */
export function approximateMapFromBloodPressure(
  sbpMmHg: number,
  dbpMmHg: number
): number | null {
  if (!Number.isFinite(sbpMmHg) || !Number.isFinite(dbpMmHg)) return null;
  if (sbpMmHg < dbpMmHg) return null;
  return (sbpMmHg + 2 * dbpMmHg) / 3;
}

export function formatPressureMmHg(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(Number(rounded.toFixed(2)));
}

export function calculateCerebralPerfusionPressure(args: {
  ageGroup: CppAgeGroup;
  mapMmHg: number;
  icpMmHg: number;
  mapSource: MapSource;
}): CerebralPerfusionPressureResult {
  const { ageGroup, mapMmHg, icpMmHg, mapSource } = args;
  const cppMmHg = mapMmHg - icpMmHg;
  const band = AGE_REFERENCE_BANDS[ageGroup];
  const sourceWord =
    mapSource === 'calculated' ? 'calculated MAP' : 'measured/entered MAP';

  return {
    mapMmHg,
    icpMmHg,
    cppMmHg,
    mapSource,
    formattedMap: formatPressureMmHg(mapMmHg),
    formattedIcp: formatPressureMmHg(icpMmHg),
    formattedCpp: formatPressureMmHg(cppMmHg),
    ageGroup,
    referenceBandLabel: band.label,
    referenceLowMmHg: band.low,
    referenceHighMmHg: band.high,
    explanation: `CPP = ${formatPressureMmHg(mapMmHg)} − ${formatPressureMmHg(icpMmHg)} = ${formatPressureMmHg(cppMmHg)} mmHg (using ${sourceWord}). Educational literature reference band for this age group: ${band.label}. This is not a treatment target.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
