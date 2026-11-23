/**
 * ECG Boxes → Seconds
 *
 * Duration (s) = boxCount × boxWidthMm / paperSpeedMmPerSec
 * Small box = 1 mm; big box = 5 mm (five small = one big).
 *
 * Sources: standard ECG paper geometry (1 mm fine grid / 5 mm bold grid);
 * common recording speeds 25 mm/s and 50 mm/s (AHA/ACC ECG teaching conventions).
 */

import type {
  DurationUnit,
  EcgBoxType,
  EcgBoxesToSecondsInput,
  EcgBoxesToSecondsResult,
  EcgPaperSpeed,
} from './types';

export const SOURCE_LABEL =
  'Standard ECG paper geometry: 1 mm small / 5 mm large horizontal boxes; common speeds 25 and 50 mm/s (AHA/ACC ECG recording conventions as taught in clinical ECG primers).';

export const DISCLAIMER =
  'Educational strip-timing aid only. Assumes undistorted standard grid paper and the selected speed. Not a diagnosis or rhythm interpretation.';

/** Small (fine) grid square width on standard ECG paper. */
export const SMALL_BOX_MM = 1;

/** Large (bold) grid square width on standard ECG paper. */
export const BIG_BOX_MM = 5;

export function boxWidthMm(boxType: EcgBoxType): number {
  return boxType === 'big' ? BIG_BOX_MM : SMALL_BOX_MM;
}

/**
 * Canonical duration in seconds.
 * durationSec = count × widthMm / speedMmPerSec
 */
export function durationSecondsFromBoxes(
  boxCount: number,
  boxType: EcgBoxType,
  paperSpeed: EcgPaperSpeed
): number | null {
  if (!Number.isFinite(boxCount) || boxCount < 0) return null;
  if (paperSpeed !== 25 && paperSpeed !== 50) return null;
  const width = boxWidthMm(boxType);
  return (boxCount * width) / paperSpeed;
}

/** Convert canonical seconds into the selected display unit (no rounding). */
export function secondsToDurationUnit(
  seconds: number,
  unit: DurationUnit
): number {
  switch (unit) {
    case 'ms':
      return seconds * 1000;
    case 'min':
      return seconds / 60;
    case 'sec':
    default:
      return seconds;
  }
}

/** Format for the read-only duration field (trim trailing zeros). */
export function formatDurationDisplay(value: number, unit: DurationUnit): string {
  if (!Number.isFinite(value)) return '';
  // Prefer enough precision for 0.04 s / 40 ms style answers without noise.
  const digits = unit === 'min' ? 6 : unit === 'ms' ? 4 : 6;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function calculateEcgBoxesToSeconds(
  input: Pick<EcgBoxesToSecondsInput, 'boxType' | 'paperSpeed' | 'durationUnit'>,
  boxCount: number
): EcgBoxesToSecondsResult | null {
  const durationSeconds = durationSecondsFromBoxes(
    boxCount,
    input.boxType,
    input.paperSpeed
  );
  if (durationSeconds == null) return null;

  const width = boxWidthMm(input.boxType);
  const durationDisplay = secondsToDurationUnit(
    durationSeconds,
    input.durationUnit
  );
  const formattedDuration = formatDurationDisplay(
    durationDisplay,
    input.durationUnit
  );

  return {
    durationSeconds,
    durationDisplay,
    durationUnit: input.durationUnit,
    formattedDuration,
    boxWidthMm: width,
    paperSpeedMmPerSec: input.paperSpeed,
    boxCount,
    explanation: `${boxCount} × ${width} mm ÷ ${input.paperSpeed} mm/s = ${formatDurationDisplay(durationSeconds, 'sec')} s (${formattedDuration} ${input.durationUnit}).`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
