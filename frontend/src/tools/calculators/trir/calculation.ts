import type { TrirBand, TrirResult } from './types';

export const TRIR_NORMALIZATION_FACTOR = 200_000;

export interface TrirBreakdown {
  hoursWorked: number;
  injuries: number;
  injuriesEstimated: boolean;
  trir: number;
  normalizationFactor: number;
  band: TrirBand;
  interpretation: string;
}

export function formatTrir(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatHours(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatInjuries(value: number, estimated: boolean): string {
  if (estimated) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Illustrative reference bands from the product spec — not OSHA/BLS official thresholds.
 * Low < 3 · Moderate 3–8 · High > 8
 */
export function classifyTrirBand(trir: number): TrirBand {
  if (trir < 3) return 'low';
  if (trir <= 8) return 'moderate';
  return 'high';
}

export function interpretTrir(trir: number): { band: TrirBand; interpretation: string } {
  const band = classifyTrirBand(trir);
  const rate = formatTrir(trir);

  if (band === 'low') {
    return {
      band,
      interpretation: `TRIR ${rate} is in the illustrative “low” range (below 3). Fewer recordable cases relative to hours worked; not a guarantee of a hazard-free workplace. Compare with industry and historical baselines.`,
    };
  }
  if (band === 'moderate') {
    return {
      band,
      interpretation: `TRIR ${rate} is in the illustrative “moderate” range (3–8). Review incident patterns, controls, and prevention measures. These bands are reference categories, not OSHA grading thresholds.`,
    };
  }
  return {
    band,
    interpretation: `TRIR ${rate} is in the illustrative “high” range (above 8). Consider additional safety assessment and corrective action. Bands are illustrative; not regulatory classifications.`,
  };
}

/** Forward: TRIR = (I × 200,000) / H */
export function calculateTRIR(
  injuries: number,
  hoursWorked: number,
): TrirBreakdown | null {
  if (!Number.isSafeInteger(injuries) || injuries < 0) return null;
  if (!Number.isFinite(hoursWorked) || !(hoursWorked > 0)) return null;

  const trir = (injuries * TRIR_NORMALIZATION_FACTOR) / hoursWorked;
  if (!Number.isFinite(trir) || trir < 0) return null;

  const { band, interpretation } = interpretTrir(trir);
  return {
    hoursWorked,
    injuries,
    injuriesEstimated: false,
    trir,
    normalizationFactor: TRIR_NORMALIZATION_FACTOR,
    band,
    interpretation,
  };
}

/** Hours = (I × 200,000) / TRIR */
export function solveHoursWorked(
  injuries: number,
  trir: number,
): TrirBreakdown | null {
  if (!Number.isSafeInteger(injuries) || injuries < 0) return null;
  if (!Number.isFinite(trir) || !(trir > 0)) return null;
  if (injuries === 0) return null;

  const hoursWorked = (injuries * TRIR_NORMALIZATION_FACTOR) / trir;
  if (!Number.isFinite(hoursWorked) || !(hoursWorked > 0)) return null;

  const { band, interpretation } = interpretTrir(trir);
  return {
    hoursWorked,
    injuries,
    injuriesEstimated: false,
    trir,
    normalizationFactor: TRIR_NORMALIZATION_FACTOR,
    band,
    interpretation,
  };
}

/** Estimated cases = TRIR × H / 200,000 (may be fractional). */
export function solveEstimatedInjuries(
  trir: number,
  hoursWorked: number,
): TrirBreakdown | null {
  if (!Number.isFinite(trir) || trir < 0) return null;
  if (!Number.isFinite(hoursWorked) || !(hoursWorked > 0)) return null;

  const injuries = (trir * hoursWorked) / TRIR_NORMALIZATION_FACTOR;
  if (!Number.isFinite(injuries) || injuries < 0) return null;

  const { band, interpretation } = interpretTrir(trir);
  return {
    hoursWorked,
    injuries,
    injuriesEstimated: true,
    trir,
    normalizationFactor: TRIR_NORMALIZATION_FACTOR,
    band,
    interpretation,
  };
}

export function toTrirResult(breakdown: TrirBreakdown): TrirResult {
  return {
    ...breakdown,
    formattedHoursWorked: formatHours(breakdown.hoursWorked),
    formattedInjuries: formatInjuries(breakdown.injuries, breakdown.injuriesEstimated),
    formattedTrir: formatTrir(breakdown.trir),
  };
}

export function shareResultText(
  result: TrirResult,
  path = '/tools/trir-calculator',
): string {
  const caseLine = result.injuriesEstimated
    ? `Estimated recordable cases: ${result.formattedInjuries}`
    : `Recordable injuries/illnesses: ${result.formattedInjuries}`;
  return [
    'TRIR Calculator | Omega Calculators',
    '',
    `Hours worked: ${result.formattedHoursWorked}`,
    caseLine,
    `Normalization: ${TRIR_NORMALIZATION_FACTOR.toLocaleString('en-US')} hours (100 FTE × 40 × 50)`,
    `TRIR: ${result.formattedTrir}`,
    `Illustrative band: ${result.band}`,
    '',
    result.interpretation,
    path,
  ].join('\n');
}
