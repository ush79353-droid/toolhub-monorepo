/**
 * Arterial age from coronary artery calcium (MESA / McClelland 2009).
 *
 * Arterial age Â = 39.1 + 7.25 × ln(CAC + 1), where ln is the natural log.
 * Chronologic age is comparison-only and never enters the coefficients.
 *
 * Source: McClelland RL et al. Arterial age as a function of coronary artery
 * calcium (from MESA). Am J Cardiol. 2009;103(1):59–63. PMC2621006.
 * Cohort: MESA adults 45–84 free of clinical CVD at baseline.
 */

import type { ArterialAgeInput, ArterialAgeResult } from './types';

export const SOURCE_LABEL =
  'McClelland RL, Nasir K, Budoff M, Blumenthal RS, Kronmal RA. Arterial age as a function of coronary artery calcium (from the Multi-Ethnic Study of Atherosclerosis [MESA]). Am J Cardiol. 2009;103(1):59–63.';

export const DISCLAIMER =
  'Educational CHD risk-equivalent arterial-age estimate from Agatston CAC only. It is not a diagnosis, Framingham risk score, treatment plan, or substitute for clinician interpretation. Derived in MESA (ages 45–84, free of clinical CVD at baseline); short-term CHD risk context.';

/** Published linear transform coefficients (natural log). */
export const INTERCEPT = 39.1;
export const SLOPE = 7.25;

/**
 * Published Table 1 95% CIs (years) for selected CAC Agatston scores.
 * Used only for exact CAC matches — no invented interpolation.
 */
export const TABLE1_CI: Readonly<
  Record<number, readonly [low: number, high: number]>
> = {
  0: [32, 46],
  10: [53, 60],
  20: [59, 63],
  30: [62, 66],
  40: [65, 67],
  50: [67, 69],
  60: [68, 70],
  70: [69, 71],
  80: [70, 72],
  90: [71, 73],
  100: [71, 74],
  200: [75, 80],
  300: [78, 83],
  400: [79, 86],
  500: [80, 88],
  750: [83, 92],
  1000: [84, 94],
  1500: [87, 98],
  2000: [88, 100],
  2500: [89, 102],
};

/** Practical upper bound for Agatston CAC entry (reject extremes). */
export const MAX_CAC = 10000;

/** Chronologic age bounds for optional comparison (years). */
export const MIN_AGE = 1;
export const MAX_AGE = 120;

export function computeArterialAgeYears(cac: number): number | null {
  if (!Number.isFinite(cac) || cac < 0) return null;
  return INTERCEPT + SLOPE * Math.log(cac + 1);
}

export function lookupTable1Ci(
  cac: number
): { low: number; high: number } | null {
  if (!Number.isFinite(cac) || !Number.isInteger(cac)) return null;
  const band = TABLE1_CI[cac];
  if (!band) return null;
  return { low: band[0], high: band[1] };
}

export function roundArterialAge(years: number): number {
  // Match published table presentation (nearest whole year).
  return Math.round(years);
}

export function formatArterialAge(years: number): string {
  return String(roundArterialAge(years));
}

function comparisonLabel(
  arterial: number,
  chronologic: number
): { label: string; delta: number } {
  const delta = roundArterialAge(arterial) - Math.round(chronologic);
  if (delta === 0) {
    return {
      label: `Arterial age matches your chronologic age of ${Math.round(chronologic)} years (rounded).`,
      delta: 0,
    };
  }
  if (delta > 0) {
    return {
      label: `Arterial age is about ${delta} year${delta === 1 ? '' : 's'} older than your chronologic age of ${Math.round(chronologic)}.`,
      delta,
    };
  }
  const younger = Math.abs(delta);
  return {
    label: `Arterial age is about ${younger} year${younger === 1 ? '' : 's'} younger than your chronologic age of ${Math.round(chronologic)}.`,
    delta,
  };
}

export function calculateArterialAge(
  cac: number,
  chronologicAgeYears: number | null,
  _input: ArterialAgeInput
): ArterialAgeResult {
  const arterialAgeYears = computeArterialAgeYears(cac);
  if (arterialAgeYears == null) {
    throw new Error('Invalid CAC for arterial age');
  }

  const rounded = roundArterialAge(arterialAgeYears);
  const ci = lookupTable1Ci(cac);
  const formatted = formatArterialAge(arterialAgeYears);

  let comparison: string | null = null;
  let ageDelta: number | null = null;
  if (chronologicAgeYears != null) {
    const c = comparisonLabel(arterialAgeYears, chronologicAgeYears);
    comparison = c.label;
    ageDelta = c.delta;
  }

  const ciText = ci
    ? ` Published Table 1 95% CI for CAC ${cac}: ${ci.low}–${ci.high} years.`
    : ' Approximate 95% CIs for selected CAC values appear in McClelland et al. Table 1; this CAC is not an exact table row.';

  const explanation = [
    `MESA arterial age = ${INTERCEPT} + ${SLOPE} × ln(CAC + 1) = ${INTERCEPT} + ${SLOPE} × ln(${cac} + 1) ≈ ${arterialAgeYears.toFixed(2)} years (displayed ${formatted}).`,
    comparison,
    ciText.trim(),
  ]
    .filter(Boolean)
    .join(' ');

  return {
    arterialAgeYears,
    formattedArterialAge: formatted,
    chronologicAgeYears,
    ageDeltaYears: ageDelta,
    comparisonLabel: comparison,
    ciLow: ci?.low ?? null,
    ciHigh: ci?.high ?? null,
    ciExactTable: ci != null,
    explanation,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
