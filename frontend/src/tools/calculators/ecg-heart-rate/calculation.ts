/**
 * ECG Heart Rate — educational single R–R interval → BPM worksheet.
 *
 * distance_mm from ruler (mm) or boxes (small=1 mm, big=5 mm);
 * duration_sec = distance_mm / paper_speed_mm_per_s;
 * BPM = 60 / duration_sec.
 *
 * Sources: Becker DE. Fundamentals of electrocardiography interpretation.
 * Anesth Prog. 2006; standard ECG paper geometry and 25/50 mm/s speeds.
 */

import {
  BIG_BOX_MM,
  SMALL_BOX_MM,
} from '../ecg-boxes-to-seconds/calculation';
import type {
  EcgBoxType,
  EcgHeartRateResult,
  EcgPaperSpeed,
  RrIntervalUnit,
} from './types';

export { BIG_BOX_MM, SMALL_BOX_MM };

export const SOURCE_LABEL =
  'BPM = 60 / (R–R distance_mm ÷ paper speed mm/s). Small box = 1 mm; big box = 5 mm. Becker DE. Anesth Prog. 2006; standard ECG paper teaching conventions.';

export const DISCLAIMER =
  'Educational single-interval estimate for regular rhythms only. Irregular rhythms need a timed strip method — this tool does not diagnose arrhythmia.';

export function boxWidthMm(boxType: EcgBoxType): number {
  return boxType === 'big' ? BIG_BOX_MM : SMALL_BOX_MM;
}

/** Convert an R–R interval field value into horizontal distance in mm. */
export function intervalToDistanceMm(
  value: number,
  unit: RrIntervalUnit,
  paperSpeed: EcgPaperSpeed
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  if (paperSpeed !== 25 && paperSpeed !== 50) return null;
  switch (unit) {
    case 'mm':
      return value;
    case 's':
      return value * paperSpeed;
    case 'ms':
      return (value / 1000) * paperSpeed;
    default:
      return null;
  }
}

export function boxesToDistanceMm(
  boxes: number,
  boxType: EcgBoxType
): number | null {
  if (!Number.isFinite(boxes) || boxes <= 0) return null;
  return boxes * boxWidthMm(boxType);
}

export function distanceMmToBoxes(
  distanceMm: number,
  boxType: EcgBoxType
): number | null {
  if (!Number.isFinite(distanceMm) || distanceMm <= 0) return null;
  return distanceMm / boxWidthMm(boxType);
}

export function distanceMmToIntervalValue(
  distanceMm: number,
  unit: RrIntervalUnit,
  paperSpeed: EcgPaperSpeed
): number | null {
  if (!Number.isFinite(distanceMm) || distanceMm <= 0) return null;
  if (paperSpeed !== 25 && paperSpeed !== 50) return null;
  switch (unit) {
    case 'mm':
      return distanceMm;
    case 's':
      return distanceMm / paperSpeed;
    case 'ms':
      return (distanceMm / paperSpeed) * 1000;
    default:
      return null;
  }
}

export function durationSecFromDistanceMm(
  distanceMm: number,
  paperSpeed: EcgPaperSpeed
): number | null {
  if (!Number.isFinite(distanceMm) || distanceMm <= 0) return null;
  if (paperSpeed !== 25 && paperSpeed !== 50) return null;
  return distanceMm / paperSpeed;
}

export function bpmFromDurationSec(durationSec: number): number | null {
  if (!Number.isFinite(durationSec) || durationSec <= 0) return null;
  return 60 / durationSec;
}

export function formatBpm(bpm: number): string {
  if (!Number.isFinite(bpm)) return '';
  const rounded = Math.round(bpm * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(Number(rounded.toFixed(2)));
}

export function formatDurationSec(sec: number): string {
  if (!Number.isFinite(sec)) return '';
  const rounded = Math.round(sec * 10000) / 10000;
  return String(Number(rounded.toFixed(4)));
}

export function calculateEcgHeartRate(args: {
  distanceMm: number;
  paperSpeed: EcgPaperSpeed;
}): EcgHeartRateResult | null {
  const durationSec = durationSecFromDistanceMm(
    args.distanceMm,
    args.paperSpeed
  );
  if (durationSec == null) return null;
  const bpm = bpmFromDurationSec(durationSec);
  if (bpm == null) return null;

  return {
    distanceMm: args.distanceMm,
    durationSec,
    bpm,
    formattedBpm: formatBpm(bpm),
    formattedDurationSec: formatDurationSec(durationSec),
    explanation: `R–R duration = ${formatDurationSec(durationSec)} s (${formatDurationSec(args.distanceMm)} mm at ${args.paperSpeed} mm/s). BPM = 60 ÷ ${formatDurationSec(durationSec)} = ${formatBpm(bpm)}. Single-interval estimate — unsuitable alone for irregular rhythms.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
