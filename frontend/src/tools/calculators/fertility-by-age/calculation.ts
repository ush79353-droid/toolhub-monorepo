/**
 * Fertility by Age — educational per-cycle fecundability lookup.
 *
 * Maps female age (years) to cohort average chance of pregnancy per menstrual
 * cycle among couples without known infertility. Values are the commonly cited
 * ASRM/ACOG patient-education fecundability bands (not individualized prediction).
 *
 * Endpoint: pregnancy per cycle (fecundability), not live birth.
 * Do not derive these by dividing cumulative 12-month rates by 12.
 */

import type { FertilityByAgeInput, FertilityByAgeResult } from './types';

export const SOURCE_LABEL =
  'Educational fecundability bands summarized in ASRM/ACOG patient materials on age-related fertility (approximate average chance of pregnancy per cycle among couples without known infertility). Not individualized clinical prediction.';

export const DISCLAIMER =
  'Cohort educational estimate only. Individual chance varies with cycle timing, health, male partner factors, and prior pregnancy history. This tool does not diagnose infertility or recommend treatment.';

export interface FecundabilityBand {
  /** Inclusive age range. */
  minAge: number;
  maxAge: number;
  label: string;
  /** Average chance of pregnancy per cycle (%). */
  percent: number;
}

/**
 * Age bins and percents used for lookup (no extrapolation outside 20–44).
 * Sources: ASRM/ACOG age-and-fertility patient guidance summaries of average
 * per-cycle conception chance.
 */
export const FECUNDABILITY_BANDS: readonly FecundabilityBand[] = [
  { minAge: 20, maxAge: 24, label: '20–24 years', percent: 24 },
  { minAge: 25, maxAge: 29, label: '25–29 years', percent: 20 },
  { minAge: 30, maxAge: 34, label: '30–34 years', percent: 17 },
  { minAge: 35, maxAge: 39, label: '35–39 years', percent: 12 },
  { minAge: 40, maxAge: 44, label: '40–44 years', percent: 6 },
];

export const MIN_AGE = 20;
export const MAX_AGE = 44;

export function findBand(ageYears: number): FecundabilityBand | null {
  if (!Number.isInteger(ageYears)) return null;
  for (const band of FECUNDABILITY_BANDS) {
    if (ageYears >= band.minAge && ageYears <= band.maxAge) return band;
  }
  return null;
}

export function calculateFertilityByAge(
  input: FertilityByAgeInput,
  ageYears: number,
  band: FecundabilityBand
): FertilityByAgeResult {
  return {
    ageYears,
    ageBandLabel: band.label,
    chancePerCyclePercent: band.percent,
    formattedPercent: String(band.percent),
    explanation: `At age ${ageYears}, the educational cohort estimate for average chance of pregnancy in each cycle is ${band.percent}% (${band.label} band).`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
