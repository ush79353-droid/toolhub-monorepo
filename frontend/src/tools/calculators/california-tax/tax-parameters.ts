import type {
  CaliforniaCounty,
  CaliforniaFilingStatus,
  CaliforniaIncomePeriod,
  CaliforniaPayFrequency,
  CaliforniaTaxYear,
} from './types';

/**
 * Verified California + federal + payroll parameters.
 *
 * Sources:
 * - FTB 2025 Form 540 / 2025 California Tax Rate Schedules / FTB Tax News indexing
 * - Rev. Proc. 2024-40 (TY 2025 federal ordinary brackets & standard deduction)
 * - Rev. Proc. 2025-32 + IRS IR-2025-103 (TY 2026 federal)
 * - IRS Pub. 15 (2025)/(2026); SSA wage bases 2025 $176,100 / 2026 $184,500
 * - EDD DE 44 / DE 3395: SDI 1.2% (2025), 1.3% (2026); no SDI wage limit (SB 951)
 * - CA BOE 2024–25 county-average statutory property-tax rates (assessed value)
 * - Mental Health Services Tax: Rev. & Tax. Code §17043 — 1% over $1,000,000 taxable
 *
 * TY 2026 California brackets/credits reuse 2025 FTB schedules pending published
 * TY 2026 indexing (disclosed in results).
 */

export interface ProgressiveBracket {
  /** Exclusive upper bound; null = open top. */
  upTo: number | null;
  rate: number;
  /** Cumulative tax at the start of this bracket. */
  baseTax: number;
  from: number;
}

function buildBrackets(
  bands: ReadonlyArray<{ upTo: number | null; rate: number }>
): readonly ProgressiveBracket[] {
  const out: ProgressiveBracket[] = [];
  let from = 0;
  let baseTax = 0;
  for (const band of bands) {
    out.push({ from, upTo: band.upTo, rate: band.rate, baseTax });
    if (band.upTo != null) {
      baseTax += (band.upTo - from) * band.rate;
      from = band.upTo;
    }
  }
  return out;
}

/** FTB Schedule X — Single / MFS (2025). */
const CA_SINGLE_2025 = buildBrackets([
  { upTo: 11_079, rate: 0.01 },
  { upTo: 26_264, rate: 0.02 },
  { upTo: 41_452, rate: 0.04 },
  { upTo: 57_542, rate: 0.06 },
  { upTo: 72_724, rate: 0.08 },
  { upTo: 371_479, rate: 0.093 },
  { upTo: 445_771, rate: 0.103 },
  { upTo: 742_953, rate: 0.113 },
  { upTo: null, rate: 0.123 },
]);

/** FTB Schedule Y — MFJ / QSS (2025). */
const CA_JOINT_2025 = buildBrackets([
  { upTo: 22_158, rate: 0.01 },
  { upTo: 52_528, rate: 0.02 },
  { upTo: 82_904, rate: 0.04 },
  { upTo: 115_084, rate: 0.06 },
  { upTo: 145_448, rate: 0.08 },
  { upTo: 742_958, rate: 0.093 },
  { upTo: 891_542, rate: 0.103 },
  { upTo: 1_485_906, rate: 0.113 },
  { upTo: null, rate: 0.123 },
]);

/** FTB Schedule Z — Head of household (2025). */
const CA_HOH_2025 = buildBrackets([
  { upTo: 22_173, rate: 0.01 },
  { upTo: 52_530, rate: 0.02 },
  { upTo: 67_716, rate: 0.04 },
  { upTo: 83_805, rate: 0.06 },
  { upTo: 98_990, rate: 0.08 },
  { upTo: 505_208, rate: 0.093 },
  { upTo: 606_251, rate: 0.103 },
  { upTo: 1_010_417, rate: 0.113 },
  { upTo: null, rate: 0.123 },
]);

export function californiaBrackets(
  status: CaliforniaFilingStatus
): readonly ProgressiveBracket[] {
  switch (status) {
    case 'married-joint':
      return CA_JOINT_2025;
    case 'head-of-household':
      return CA_HOH_2025;
    case 'single':
    case 'married-separate':
      return CA_SINGLE_2025;
  }
}

export function californiaStandardDeduction(status: CaliforniaFilingStatus): number {
  switch (status) {
    case 'single':
    case 'married-separate':
      return 5_706;
    case 'married-joint':
    case 'head-of-household':
      return 11_412;
  }
}

/** Personal exemption credit(s) before dependent credits / phaseout. */
export function californiaPersonalExemptionCredit(
  status: CaliforniaFilingStatus
): number {
  switch (status) {
    case 'married-joint':
      return 306;
    case 'single':
    case 'married-separate':
    case 'head-of-household':
      return 153;
  }
}

export const CALIFORNIA_DEPENDENT_EXEMPTION_CREDIT = 475;

/** Federal AGI threshold where CA exemption credits begin to phase out (FTB 2025 Form 540). */
export function californiaExemptionPhaseoutStart(
  status: CaliforniaFilingStatus
): number {
  switch (status) {
    case 'married-joint':
      return 504_406;
    case 'married-separate':
      return 252_203;
    case 'single':
    case 'head-of-household':
      return 252_203;
  }
}

export const MENTAL_HEALTH_TAX_RATE = 0.01;
export const MENTAL_HEALTH_TAX_THRESHOLD = 1_000_000;

const FEDERAL_RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37] as const;

const FED_T2025 = {
  single: [11_925, 48_475, 103_350, 197_300, 250_525, 626_350],
  joint: [23_850, 96_950, 206_700, 394_600, 501_050, 751_600],
  hoh: [17_000, 64_850, 103_350, 197_300, 250_500, 626_350],
  mfs: [11_925, 48_475, 103_350, 197_300, 250_525, 375_800],
} as const;

const FED_T2026 = {
  single: [12_400, 50_400, 105_700, 201_775, 256_225, 640_600],
  joint: [24_800, 100_800, 211_400, 403_550, 512_450, 768_700],
  hoh: [17_700, 67_450, 105_700, 201_750, 256_200, 640_600],
  mfs: [12_400, 50_400, 105_700, 201_775, 256_225, 384_350],
} as const;

function federalBracketsFromThresholds(
  thresholds: readonly number[]
): readonly ProgressiveBracket[] {
  const bands: Array<{ upTo: number | null; rate: number }> = [];
  for (let i = 0; i < FEDERAL_RATES.length; i++) {
    bands.push({
      upTo: i < thresholds.length ? thresholds[i]! : null,
      rate: FEDERAL_RATES[i]!,
    });
  }
  return buildBrackets(bands);
}

export function federalOrdinaryBrackets(
  year: CaliforniaTaxYear,
  status: CaliforniaFilingStatus
): readonly ProgressiveBracket[] {
  const table = year === 2025 ? FED_T2025 : FED_T2026;
  switch (status) {
    case 'married-joint':
      return federalBracketsFromThresholds(table.joint);
    case 'head-of-household':
      return federalBracketsFromThresholds(table.hoh);
    case 'married-separate':
      return federalBracketsFromThresholds(table.mfs);
    case 'single':
      return federalBracketsFromThresholds(table.single);
  }
}

export function federalStandardDeduction(
  year: CaliforniaTaxYear,
  status: CaliforniaFilingStatus
): number {
  if (year === 2025) {
    switch (status) {
      case 'single':
      case 'married-separate':
        return 15_750;
      case 'married-joint':
        return 31_500;
      case 'head-of-household':
        return 23_625;
    }
  }
  switch (status) {
    case 'single':
    case 'married-separate':
      return 16_100;
    case 'married-joint':
      return 32_200;
    case 'head-of-household':
      return 24_150;
  }
}

/** Other dependent credit ($500) — age of dependents is unknown. */
export const FEDERAL_OTHER_DEPENDENT_CREDIT = 500;

export const OASDI_RATE = 0.062;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009;

export function socialSecurityWageBase(year: CaliforniaTaxYear): number {
  return year === 2025 ? 176_100 : 184_500;
}

export function additionalMedicareThreshold(
  status: CaliforniaFilingStatus
): number {
  switch (status) {
    case 'married-joint':
      return 250_000;
    case 'married-separate':
      return 125_000;
    case 'single':
    case 'head-of-household':
      return 200_000;
  }
}

/** Employee SDI rate (EDD). */
export function californiaSdiRate(year: CaliforniaTaxYear): number {
  return year === 2025 ? 0.012 : 0.013;
}

/**
 * BOE 2024–25 county-average statutory rates (% of assessed / taxable value).
 * Source: California Property Tools BOE-derived county averages (boe_rate_year 2024-25).
 */
export const COUNTY_PROPERTY_TAX_RATES: Record<
  CaliforniaCounty,
  { label: string; ratePercent: number }
> = {
  alameda: { label: 'Alameda County', ratePercent: 1.22 },
  'contra-costa': { label: 'Contra Costa County', ratePercent: 1.151 },
  'los-angeles': { label: 'Los Angeles County', ratePercent: 1.181 },
  orange: { label: 'Orange County', ratePercent: 1.064 },
  riverside: { label: 'Riverside County', ratePercent: 1.173 },
  sacramento: { label: 'Sacramento County', ratePercent: 1.155 },
  'san-diego': { label: 'San Diego County', ratePercent: 1.171 },
  'san-francisco': { label: 'San Francisco County', ratePercent: 1.174 },
  'santa-clara': { label: 'Santa Clara County', ratePercent: 1.193 },
  ventura: { label: 'Ventura County', ratePercent: 1.116 },
};

export function incomePeriodToAnnualMultiplier(
  period: CaliforniaIncomePeriod
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

export function payPeriodsPerYear(frequency: CaliforniaPayFrequency): number {
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

export function taxFromBrackets(
  taxable: number,
  brackets: readonly ProgressiveBracket[]
): number {
  if (!(taxable > 0)) return 0;
  for (const bracket of brackets) {
    const cap = bracket.upTo ?? Number.POSITIVE_INFINITY;
    if (taxable <= cap) {
      return bracket.baseTax + (taxable - bracket.from) * bracket.rate;
    }
  }
  const last = brackets[brackets.length - 1]!;
  return last.baseTax + (taxable - last.from) * last.rate;
}
