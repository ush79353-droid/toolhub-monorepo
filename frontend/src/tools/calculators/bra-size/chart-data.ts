/**
 * Documented illustrative bra sizing tables (approximate).
 * Brand charts vary — not universal standards.
 */

import type { BraSizingRegion } from './types';

export const CHART_SOURCE =
  'Illustrative conventional sizing guide (approximate). Brand charts vary.';

/** US/UK inch band ladder */
export const US_UK_BANDS = [
  28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50,
] as const;

/** EU cm-style band labels */
export const EU_BANDS = [
  60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115,
] as const;

/** AU/NZ dress-style band labels */
export const AU_BANDS = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28] as const;

/** FR/ES = EU + 15 conventionally */
export const FR_BANDS = [
  75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130,
] as const;

/** Cup steps: index 0 = AA … (≈1 inch / ≈2 cm per step in this model) */
export const US_CUPS = [
  'AA',
  'A',
  'B',
  'C',
  'D',
  'DD',
  'DDD',
  'G',
  'H',
  'I',
  'J',
] as const;

export const UK_CUPS = [
  'AA',
  'A',
  'B',
  'C',
  'D',
  'DD',
  'E',
  'F',
  'FF',
  'G',
  'GG',
  'H',
] as const;

/** EU/AU/FR often share letter names early; use UK-like progression after D */
export const EU_CUPS = [
  'AA',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
] as const;

export function cupsForRegion(region: BraSizingRegion): readonly string[] {
  if (region === 'US') return US_CUPS;
  if (region === 'UK') return UK_CUPS;
  return EU_CUPS;
}

/** US inch band index ↔ EU/AU/FR band labels (parallel arrays). */
export function bandLabelAtIndex(
  region: BraSizingRegion,
  index: number,
): string | null {
  if (index < 0 || index >= US_UK_BANDS.length) return null;
  if (region === 'US' || region === 'UK') return String(US_UK_BANDS[index]);
  if (region === 'EU') return String(EU_BANDS[index]);
  if (region === 'AU') return String(AU_BANDS[index]);
  return String(FR_BANDS[index]);
}

export function findBandIndex(
  region: BraSizingRegion,
  bandLabel: string,
): number {
  const n = Number(bandLabel);
  if (!Number.isFinite(n)) return -1;
  const list =
    region === 'US' || region === 'UK'
      ? US_UK_BANDS
      : region === 'EU'
        ? EU_BANDS
        : region === 'AU'
          ? AU_BANDS
          : FR_BANDS;
  return list.findIndex((b) => b === n);
}
