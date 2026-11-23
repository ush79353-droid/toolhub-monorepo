/**
 * Mean arterial pressure (MAP) from cuff pressures.
 *
 * MAP = (SBP + 2×DBP) / 3 = DBP + (SBP − DBP) / 3.
 * Pulse pressure PP = SBP − DBP.
 */

import { MAP_SOURCE_NOTE } from './content';
import type { MapInput, MapResult } from './types';

export const SOURCE_LABEL = MAP_SOURCE_NOTE;

export const DISCLAIMER =
  'Educational MAP estimate from cuff SBP/DBP only. Not a treatment target, not for diagnosis, and not a substitute for monitored care by a qualified clinician.';

export const MIN_PRESSURE_MMHG = 20;
export const MAX_PRESSURE_MMHG = 300;

export function calculateMeanArterialPressure(
  sbpMmHg: number,
  dbpMmHg: number
): number | null {
  if (!Number.isFinite(sbpMmHg) || !Number.isFinite(dbpMmHg)) return null;
  if (sbpMmHg < dbpMmHg) return null;
  return (sbpMmHg + 2 * dbpMmHg) / 3;
}

export function calculatePulsePressure(
  sbpMmHg: number,
  dbpMmHg: number
): number | null {
  if (!Number.isFinite(sbpMmHg) || !Number.isFinite(dbpMmHg)) return null;
  if (sbpMmHg < dbpMmHg) return null;
  return sbpMmHg - dbpMmHg;
}

export function formatPressureMmHg(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(Number(rounded.toFixed(2)));
}

export function buildMapResult(
  input: MapInput,
  sbpMmHg: number,
  dbpMmHg: number
): MapResult {
  const mapMmHg = calculateMeanArterialPressure(sbpMmHg, dbpMmHg)!;
  const ppMmHg = calculatePulsePressure(sbpMmHg, dbpMmHg);
  const showPp = input.displayPulsePressure;

  let explanation = `MAP = (${formatPressureMmHg(sbpMmHg)} + 2 × ${formatPressureMmHg(dbpMmHg)}) ÷ 3 = ${formatPressureMmHg(mapMmHg)} mmHg.`;
  if (showPp && ppMmHg != null) {
    explanation += ` Pulse pressure = ${formatPressureMmHg(sbpMmHg)} − ${formatPressureMmHg(dbpMmHg)} = ${formatPressureMmHg(ppMmHg)} mmHg.`;
  }

  return {
    sbpMmHg,
    dbpMmHg,
    mapMmHg,
    pulsePressureMmHg: showPp ? ppMmHg : null,
    formattedMap: formatPressureMmHg(mapMmHg),
    formattedPulsePressure:
      showPp && ppMmHg != null ? formatPressureMmHg(ppMmHg) : '',
    formattedSbp: formatPressureMmHg(sbpMmHg),
    formattedDbp: formatPressureMmHg(dbpMmHg),
    explanation,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}