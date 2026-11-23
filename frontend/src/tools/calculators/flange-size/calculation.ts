/**
 * Flange Size — Spectra Baby USA published discrete nipple→flange bands.
 *
 * Measure nipple base diameter excluding areola. Map to Spectra guide sizes
 * (not a universal +N mm clearance rule).
 *
 * Source: Spectra Baby USA S1/S2 instructions & FAQ flange sizing guide
 * (https://www.spectrababyusa.com/pages/s1-and-s2-instructions).
 */

import type {
  DiameterUnit,
  FlangeFitStatus,
  FlangeSizeInput,
  FlangeSizeResult,
} from './types';

export const SOURCE_LABEL =
  'Spectra Baby USA flange sizing guide (S1/S2 instructions / FAQ): up to 12→16, 16→20, 20→24, 24→28, 28→32 mm.';

export const DISCLAIMER =
  'Educational Spectra sizing-table lookup only. Nipples change during pumping; comfort and milk flow while pumping decide final fit. Not a clinical prescription and not a Medela Room-to-Move (+4 mm) calculator.';

/** Spectra published upper bounds (mm) → flange tunnel mm. */
export const SPECTRA_BANDS: readonly {
  maxNippleMm: number;
  flangeMm: number;
}[] = [
  { maxNippleMm: 12, flangeMm: 16 },
  { maxNippleMm: 16, flangeMm: 20 },
  { maxNippleMm: 20, flangeMm: 24 },
  { maxNippleMm: 24, flangeMm: 28 },
  { maxNippleMm: 28, flangeMm: 32 },
];

export const MIN_SUPPORTED_MM = 1;
export const MAX_SUPPORTED_MM = 28;

export function diameterToMm(value: number, unit: DiameterUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  switch (unit) {
    case 'mm':
      return value;
    case 'in':
      return value * 25.4;
    default:
      return null;
  }
}

export function mmToDiameterUnit(mm: number, unit: DiameterUnit): number {
  return unit === 'in' ? mm / 25.4 : mm;
}

/**
 * Spectra discrete lookup: first band where nippleMm ≤ maxNippleMm.
 * Returns null when above the largest published band.
 */
export function suggestSpectraFlangeMm(nippleMm: number): {
  flangeMm: number | null;
  status: FlangeFitStatus;
} {
  if (!Number.isFinite(nippleMm) || nippleMm < 0) {
    return { flangeMm: null, status: 'outOfRangeLow' };
  }
  if (nippleMm > 0 && nippleMm < MIN_SUPPORTED_MM) {
    return { flangeMm: null, status: 'outOfRangeLow' };
  }
  if (nippleMm === 0) {
    return { flangeMm: null, status: 'outOfRangeLow' };
  }
  for (const band of SPECTRA_BANDS) {
    if (nippleMm <= band.maxNippleMm) {
      return { flangeMm: band.flangeMm, status: 'suggested' };
    }
  }
  return { flangeMm: null, status: 'outOfRangeHigh' };
}

export function calculateFlangeSize(
  input: Pick<FlangeSizeInput, 'diameterUnit'>,
  diameterMm: number
): FlangeSizeResult {
  const { flangeMm, status } = suggestSpectraFlangeMm(diameterMm);

  let formattedSuggestion = '';
  let explanation = '';

  if (status === 'suggested' && flangeMm != null) {
    formattedSuggestion = `${flangeMm} mm`;
    explanation = `Nipple base ${formatMm(diameterMm)} mm maps to Spectra flange ${flangeMm} mm (published “up to” band). Confirm comfort and free nipple movement while pumping.`;
  } else if (status === 'outOfRangeHigh') {
    formattedSuggestion = 'Out of published range';
    explanation = `Nipple base ${formatMm(diameterMm)} mm is above Spectra’s published “up to 28 mm → 32 mm” band. No stock size is suggested here — ask a lactation professional or the pump maker for larger options.`;
  } else {
    formattedSuggestion = 'Out of published range';
    explanation = `Nipple base ${formatMm(diameterMm)} mm is below the supported educational range for this Spectra table. Recheck the measurement (base diameter, excluding areola).`;
  }

  return {
    diameterMm,
    flangeSizeMm: flangeMm,
    fitStatus: status,
    formattedSuggestion,
    explanation,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

function formatMm(mm: number): string {
  const rounded = Number(mm.toFixed(2));
  return String(rounded);
}
