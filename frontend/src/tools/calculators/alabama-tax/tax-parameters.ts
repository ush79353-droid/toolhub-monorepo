import type {
  AlabamaFilingStatus,
  AlabamaIncomePeriod,
  AlabamaJurisdiction,
  AlabamaPayFrequency,
} from './types';

/**
 * Verified Alabama Department of Revenue individual income tax parameters.
 * Sources:
 * - ADOR “What is Alabama’s Individual Income Tax Rate?” FAQ
 * - ADOR 2025 Form 40 instructions (standard deduction chart, exemptions)
 * Tax years 2025 and 2026 use these enacted schedules (TY2026 Form 40 chart
 * not separately published as of development; brackets/exemptions unchanged).
 */

export interface AlabamaBracket {
  upTo: number | null;
  rate: number;
}

/** Single / MFS / Head of family brackets (ADOR). */
const NON_JOINT_BRACKETS: readonly AlabamaBracket[] = [
  { upTo: 500, rate: 0.02 },
  { upTo: 3000, rate: 0.04 },
  { upTo: null, rate: 0.05 },
];

/** Married filing jointly brackets (ADOR). */
const JOINT_BRACKETS: readonly AlabamaBracket[] = [
  { upTo: 1000, rate: 0.02 },
  { upTo: 6000, rate: 0.04 },
  { upTo: null, rate: 0.05 },
];

export function bracketsForStatus(
  status: AlabamaFilingStatus
): readonly AlabamaBracket[] {
  return status === 'married-joint' ? JOINT_BRACKETS : NON_JOINT_BRACKETS;
}

export function personalExemption(status: AlabamaFilingStatus): number {
  switch (status) {
    case 'married-joint':
    case 'head-of-family':
      return 3000;
    case 'single':
    case 'married-separate':
      return 1500;
  }
}

/** Dependent exemption per ADOR Form 40 chart keyed to Alabama AGI. */
export function dependentExemptionPer(agi: number): number {
  if (!(agi >= 0) || !Number.isFinite(agi)) return 0;
  if (agi <= 50_000) return 1000;
  if (agi <= 100_000) return 500;
  return 300;
}

type StdBand = { maxAgiInclusive: number; deduction: number };

/**
 * 2025 Form 40 Standard Deduction Chart (ADOR).
 * Bands are ordered ascending by AGI ceiling.
 */
const STD_JOINT: readonly StdBand[] = [
  { maxAgiInclusive: 25_999, deduction: 8500 },
  { maxAgiInclusive: 26_499, deduction: 8325 },
  { maxAgiInclusive: 26_999, deduction: 8150 },
  { maxAgiInclusive: 27_499, deduction: 7975 },
  { maxAgiInclusive: 27_999, deduction: 7800 },
  { maxAgiInclusive: 28_499, deduction: 7625 },
  { maxAgiInclusive: 28_999, deduction: 7450 },
  { maxAgiInclusive: 29_499, deduction: 7275 },
  { maxAgiInclusive: 29_999, deduction: 7100 },
  { maxAgiInclusive: 30_499, deduction: 6925 },
  { maxAgiInclusive: 30_999, deduction: 6750 },
  { maxAgiInclusive: 31_499, deduction: 6575 },
  { maxAgiInclusive: 31_999, deduction: 6400 },
  { maxAgiInclusive: 32_499, deduction: 6225 },
  { maxAgiInclusive: 32_999, deduction: 6050 },
  { maxAgiInclusive: 33_499, deduction: 5875 },
  { maxAgiInclusive: 33_999, deduction: 5700 },
  { maxAgiInclusive: 34_499, deduction: 5525 },
  { maxAgiInclusive: 34_999, deduction: 5350 },
  { maxAgiInclusive: 35_499, deduction: 5175 },
  { maxAgiInclusive: Number.POSITIVE_INFINITY, deduction: 5000 },
];

const STD_SEPARATE: readonly StdBand[] = [
  { maxAgiInclusive: 12_999, deduction: 4250 },
  { maxAgiInclusive: 13_249, deduction: 4162 },
  { maxAgiInclusive: 13_499, deduction: 4074 },
  { maxAgiInclusive: 13_749, deduction: 3986 },
  { maxAgiInclusive: 13_999, deduction: 3898 },
  { maxAgiInclusive: 14_249, deduction: 3810 },
  { maxAgiInclusive: 14_499, deduction: 3722 },
  { maxAgiInclusive: 14_749, deduction: 3634 },
  { maxAgiInclusive: 14_999, deduction: 3546 },
  { maxAgiInclusive: 15_249, deduction: 3458 },
  { maxAgiInclusive: 15_499, deduction: 3370 },
  { maxAgiInclusive: 15_749, deduction: 3282 },
  { maxAgiInclusive: 15_999, deduction: 3194 },
  { maxAgiInclusive: 16_249, deduction: 3106 },
  { maxAgiInclusive: 16_499, deduction: 3018 },
  { maxAgiInclusive: 16_749, deduction: 2930 },
  { maxAgiInclusive: 16_999, deduction: 2842 },
  { maxAgiInclusive: 17_249, deduction: 2754 },
  { maxAgiInclusive: 17_499, deduction: 2666 },
  { maxAgiInclusive: 17_749, deduction: 2578 },
  { maxAgiInclusive: Number.POSITIVE_INFINITY, deduction: 2500 },
];

const STD_HEAD: readonly StdBand[] = [
  { maxAgiInclusive: 25_999, deduction: 5200 },
  { maxAgiInclusive: 26_499, deduction: 5065 },
  { maxAgiInclusive: 26_999, deduction: 4930 },
  { maxAgiInclusive: 27_499, deduction: 4795 },
  { maxAgiInclusive: 27_999, deduction: 4660 },
  { maxAgiInclusive: 28_499, deduction: 4525 },
  { maxAgiInclusive: 28_999, deduction: 4390 },
  { maxAgiInclusive: 29_499, deduction: 4255 },
  { maxAgiInclusive: 29_999, deduction: 4120 },
  { maxAgiInclusive: 30_499, deduction: 3985 },
  { maxAgiInclusive: 30_999, deduction: 3850 },
  { maxAgiInclusive: 31_499, deduction: 3715 },
  { maxAgiInclusive: 31_999, deduction: 3580 },
  { maxAgiInclusive: 32_499, deduction: 3445 },
  { maxAgiInclusive: 32_999, deduction: 3310 },
  { maxAgiInclusive: 33_499, deduction: 3175 },
  { maxAgiInclusive: 33_999, deduction: 3040 },
  { maxAgiInclusive: 34_499, deduction: 2905 },
  { maxAgiInclusive: 34_999, deduction: 2770 },
  { maxAgiInclusive: 35_499, deduction: 2635 },
  { maxAgiInclusive: Number.POSITIVE_INFINITY, deduction: 2500 },
];

const STD_SINGLE: readonly StdBand[] = [
  { maxAgiInclusive: 25_999, deduction: 3000 },
  { maxAgiInclusive: 26_499, deduction: 2975 },
  { maxAgiInclusive: 26_999, deduction: 2950 },
  { maxAgiInclusive: 27_499, deduction: 2925 },
  { maxAgiInclusive: 27_999, deduction: 2900 },
  { maxAgiInclusive: 28_499, deduction: 2875 },
  { maxAgiInclusive: 28_999, deduction: 2850 },
  { maxAgiInclusive: 29_499, deduction: 2825 },
  { maxAgiInclusive: 29_999, deduction: 2800 },
  { maxAgiInclusive: 30_499, deduction: 2775 },
  { maxAgiInclusive: 30_999, deduction: 2750 },
  { maxAgiInclusive: 31_499, deduction: 2725 },
  { maxAgiInclusive: 31_999, deduction: 2700 },
  { maxAgiInclusive: 32_499, deduction: 2675 },
  { maxAgiInclusive: 32_999, deduction: 2650 },
  { maxAgiInclusive: 33_499, deduction: 2625 },
  { maxAgiInclusive: 33_999, deduction: 2600 },
  { maxAgiInclusive: 34_499, deduction: 2575 },
  { maxAgiInclusive: 34_999, deduction: 2550 },
  { maxAgiInclusive: 35_499, deduction: 2525 },
  { maxAgiInclusive: Number.POSITIVE_INFINITY, deduction: 2500 },
];

function lookupStd(agi: number, bands: readonly StdBand[]): number {
  for (const band of bands) {
    if (agi <= band.maxAgiInclusive) return band.deduction;
  }
  return bands[bands.length - 1]!.deduction;
}

export function standardDeduction(
  status: AlabamaFilingStatus,
  alabamaAgi: number
): number {
  if (!Number.isFinite(alabamaAgi) || alabamaAgi < 0) return 0;
  switch (status) {
    case 'married-joint':
      return lookupStd(alabamaAgi, STD_JOINT);
    case 'married-separate':
      return lookupStd(alabamaAgi, STD_SEPARATE);
    case 'head-of-family':
      return lookupStd(alabamaAgi, STD_HEAD);
    case 'single':
      return lookupStd(alabamaAgi, STD_SINGLE);
  }
}

/**
 * Local occupational rates (Bessemer/Birmingham 1%, Gadsden 2%, Macon County 1%).
 * Apply only to wages for work performed in the jurisdiction.
 */
export const LOCAL_OCCUPATIONAL_RATES: Record<AlabamaJurisdiction, number> = {
  bessemer: 0.01,
  birmingham: 0.01,
  gadsden: 0.02,
  'macon-county': 0.01,
};

export function incomePeriodToAnnualMultiplier(
  period: AlabamaIncomePeriod
): number {
  switch (period) {
    case 'year':
      return 1;
    case 'month':
      return 12;
    case 'semimonthly':
      return 24;
    case 'biweekly':
      return 26;
    case 'week':
      return 52;
  }
}

export function payPeriodsPerYear(frequency: AlabamaPayFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 52;
    case 'biweekly':
      return 26;
    case 'semimonthly':
      return 24;
    case 'monthly':
      return 12;
    case 'annually':
      return 1;
  }
}
