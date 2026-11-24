/**
 * US twin birth rates (twin deliveries per 1,000 total births).
 *
 * Endpoint: twin deliveries ÷ total births (NVSS), not twin pregnancy incidence.
 * One stratum at a time — age OR race/Hispanic origin; rates are not multiplied.
 *
 * Age: CDC/NCHS Health E-Stat 117 (2024 twin rates by maternal age).
 * Race/Hispanic: NVSS Births Final Data 2024.
 */

import type { TwinsRaceEthnicity, TwinsResult, TwinsStratumMode } from './types';
import { RACE_ETHNICITY_OPTIONS } from './types';

export const OVERALL_US_TWIN_RATE_2024 = 30.1;

export const AGE_SOURCE_LABEL =
  'CDC/NCHS Health E-Stat 117 — 2024 US twin birth rate by maternal age (twin deliveries per 1,000 total births)';

export const RACE_SOURCE_LABEL =
  'NVSS Births: Final Data for 2024 — twin birth rate by race and Hispanic origin (per 1,000 total births)';

export const ENDPOINT_NOTE =
  'Twin deliveries divided by all live births in the same population year (NVSS). This is a population birth rate, not twin pregnancy incidence.';

export const ART_NOTE =
  'Published US twin birth rates include births after assisted reproductive technology (ART) and other fertility treatment.';

export const DISCLAIMER =
  'This shows a US population average for one demographic stratum. It is not a personalized prediction of whether you will have twins and does not replace medical advice.';

export type AgeBandId =
  | 'under_20'
  | '20_24'
  | '25_29'
  | '30_34'
  | '35_39'
  | '40_plus';

export const AGE_BAND_RATES: Record<AgeBandId, { label: string; rate: number }> = {
  under_20: { label: 'Under 20 years', rate: 16.1 },
  '20_24': { label: '20–24 years', rate: 22.7 },
  '25_29': { label: '25–29 years', rate: 28.9 },
  '30_34': { label: '30–34 years', rate: 33.2 },
  '35_39': { label: '35–39 years', rate: 35.4 },
  '40_plus': { label: '40 years and over', rate: 35.6 },
};

export const RACE_RATES: Record<TwinsRaceEthnicity, number> = {
  nh_white: 31.3,
  nh_black: 42.0,
  hispanic: 23.4,
  asian: 23.3,
  aian: 26.1,
  nhopi: 24.5,
};

export function resolveAgeBand(ageYears: number): AgeBandId | null {
  if (!Number.isInteger(ageYears)) return null;
  if (ageYears < 12 || ageYears > 55) return null;
  if (ageYears < 20) return 'under_20';
  if (ageYears <= 24) return '20_24';
  if (ageYears <= 29) return '25_29';
  if (ageYears <= 34) return '30_34';
  if (ageYears <= 39) return '35_39';
  return '40_plus';
}

export function raceLabel(race: TwinsRaceEthnicity): string {
  return RACE_ETHNICITY_OPTIONS.find((o) => o.value === race)?.label ?? race;
}

/** Percent of births that are twin deliveries: rate ÷ 10 (per 1,000 → %). */
export function twinRateToPercent(ratePerThousand: number): number {
  return ratePerThousand / 10;
}

/** Approximate 1-in-N births: round(1,000 ÷ rate). */
export function twinRateToOneInN(ratePerThousand: number): number {
  if (!Number.isFinite(ratePerThousand) || ratePerThousand <= 0) return Number.NaN;
  return Math.round(1000 / ratePerThousand);
}

export function formatRatePerThousand(rate: number): string {
  if (!Number.isFinite(rate)) return '—';
  const rounded = Math.round(rate * 10) / 10;
  return `${rounded.toFixed(1)} per 1,000 births`;
}

export function formatTwinPercent(ratePerThousand: number): string {
  const pct = twinRateToPercent(ratePerThousand);
  if (!Number.isFinite(pct)) return '—';
  const rounded = Math.round(pct * 100) / 100;
  return `${rounded.toFixed(2)}%`;
}

export function formatOneInN(ratePerThousand: number): string {
  const n = twinRateToOneInN(ratePerThousand);
  if (!Number.isFinite(n)) return '—';
  return `about 1 in ${n}`;
}

export interface TwinsCalculationInput {
  stratumMode: TwinsStratumMode;
  motherAgeYears?: number;
  raceEthnicity?: TwinsRaceEthnicity;
}

export function calculateTwinBirthRate(input: TwinsCalculationInput): TwinsResult | null {
  let rate: number;
  let stratumDescription: string;
  let sourceLabel: string;

  if (input.stratumMode === 'by_age') {
    if (input.motherAgeYears == null) return null;
    const band = resolveAgeBand(input.motherAgeYears);
    if (band == null) return null;
    const row = AGE_BAND_RATES[band];
    rate = row.rate;
    stratumDescription = `Maternal age ${input.motherAgeYears} (${row.label})`;
    sourceLabel = AGE_SOURCE_LABEL;
  } else {
    if (input.raceEthnicity == null) return null;
    rate = RACE_RATES[input.raceEthnicity];
    if (!Number.isFinite(rate)) return null;
    stratumDescription = raceLabel(input.raceEthnicity);
    sourceLabel = RACE_SOURCE_LABEL;
  }

  const oneInN = twinRateToOneInN(rate);

  return {
    twinBirthsPerThousand: rate,
    percentTwinBirths: twinRateToPercent(rate),
    formattedRatePerThousand: formatRatePerThousand(rate),
    formattedPercent: formatTwinPercent(rate),
    oneInN,
    formattedOneInN: formatOneInN(rate),
    stratumDescription,
    sourceLabel,
    overallUsReferenceRate: OVERALL_US_TWIN_RATE_2024,
    formattedOverallUsRate: formatRatePerThousand(OVERALL_US_TWIN_RATE_2024),
    disclaimer: DISCLAIMER,
    endpointNote: ENDPOINT_NOTE,
    artNote: ART_NOTE,
  };
}