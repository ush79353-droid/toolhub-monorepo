/**
 * England & Northern Ireland residential SDLT bands (HMRC / GOV.UK).
 *
 * Does not apply to Scotland (LBTT) or Wales (LTT).
 *
 * Sources (retrieved 2026-11-21):
 * - https://www.gov.uk/stamp-duty-land-tax/residential-property-rates
 * - https://www.gov.uk/guidance/stamp-duty-land-tax-buying-an-additional-residential-property
 * - https://www.gov.uk/guidance/rates-of-stamp-duty-land-tax-for-non-uk-residents
 *
 * Effective from 1 April 2025 (standard nil-rate band £125,000; higher-rates
 * surcharge +5 percentage points; first-time buyer relief £300k/£500k).
 * GOV.UK residential tables unchanged through 2026-11-21 for these bands.
 */

export type SdltBuyerScenario =
  | 'first_time_buyer'
  | 'moving_home'
  | 'additional_property'
  | 'let_or_flip';

export type SdltResidency = 'uk' | 'non_uk';

export interface SdltBand {
  /** Inclusive upper bound of the band portion (GBP). Infinity for open-ended. */
  upTo: number;
  /** Marginal rate as a decimal (e.g. 0.05 = 5%). */
  rate: number;
  label: string;
}

export interface SdltRateSchedule {
  id: string;
  /** ISO date — rates apply on and after this completion date. */
  effectiveFrom: string;
  label: string;
  standardBands: readonly SdltBand[];
  /** Used when price ≤ firstTimeBuyerMaxPrice. */
  firstTimeBuyerBands: readonly SdltBand[];
  firstTimeBuyerMaxPrice: number;
  /** Percentage points added for additional dwellings / BTL (from 1 Apr 2025: 5). */
  higherRatesSurchargePp: number;
  /** Percentage points added for non-UK residents (from 1 Apr 2021: 2). */
  nonResidentSurchargePp: number;
  sourceNote: string;
}

/** Current supported schedule (England & NI residential freehold / lease premium). */
export const SDLT_SCHEDULE_FROM_2025_04_01: SdltRateSchedule = {
  id: '2025-04-01',
  effectiveFrom: '2025-04-01',
  label: 'From 1 April 2025',
  standardBands: [
    { upTo: 125_000, rate: 0, label: 'Up to £125,000' },
    { upTo: 250_000, rate: 0.02, label: '£125,001 to £250,000' },
    { upTo: 925_000, rate: 0.05, label: '£250,001 to £925,000' },
    { upTo: 1_500_000, rate: 0.1, label: '£925,001 to £1.5 million' },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.12, label: 'Above £1.5 million' },
  ],
  firstTimeBuyerBands: [
    { upTo: 300_000, rate: 0, label: 'Up to £300,000 (FTB)' },
    { upTo: 500_000, rate: 0.05, label: '£300,001 to £500,000 (FTB)' },
  ],
  firstTimeBuyerMaxPrice: 500_000,
  higherRatesSurchargePp: 0.05,
  nonResidentSurchargePp: 0.02,
  sourceNote:
    'GOV.UK residential SDLT rates (England & Northern Ireland), retrieved 2026-11-21.',
};

export const DEFAULT_SDLT_SCHEDULE = SDLT_SCHEDULE_FROM_2025_04_01;

export function usesHigherRates(scenario: SdltBuyerScenario): boolean {
  return scenario === 'additional_property' || scenario === 'let_or_flip';
}

export function buyerScenarioLabel(scenario: SdltBuyerScenario): string {
  switch (scenario) {
    case 'first_time_buyer':
      return 'a first-time buyer';
    case 'moving_home':
      return 'moving home';
    case 'additional_property':
      return 'buying additional property';
    case 'let_or_flip':
      return 'buying a property to let or flip';
  }
}
