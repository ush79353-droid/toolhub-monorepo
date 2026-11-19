import type { IncomeDistributionDataset, IncomeType } from './types';

/**
 * Household money income, calendar year 2024.
 * U.S. Census Bureau, Income in the United States: 2024, P60-286.
 * Selected percentiles: Table A-4a. Mean: Table A-2, all races, 2024 ($121,000).
 * Median: $83,730 (Table A-1 / A-4a). Pretax money income. Thresholds are the
 * published percentile limits only — nothing is filled in above the 95th or below the 10th.
 */
const HOUSEHOLD_2024: IncomeDistributionDataset = {
  incomeType: 'household',
  referenceYear: 2024,
  currency: 'USD',
  source:
    'U.S. Census Bureau, Income in the United States: 2024 (P60-286), CPS ASEC. Table A-4a selected percentiles; Table A-2 mean household income.',
  lastUpdated: '2025-09',
  populationLabel: 'U.S. households',
  medianIncome: 83730,
  meanIncome: 121000,
  /** Income at that percentile (share of households at or below). */
  brackets: [
    { income: 19900, percentile: 10 },
    { income: 34510, percentile: 20 },
    { income: 49520, percentile: 30 },
    { income: 65100, percentile: 40 },
    { income: 83730, percentile: 50 },
    { income: 105500, percentile: 60 },
    { income: 135000, percentile: 70 },
    { income: 175700, percentile: 80 },
    { income: 251000, percentile: 90 },
    { income: 335700, percentile: 95 },
  ],
};

/**
 * Person money income, calendar year 2024, people age 15+ with income.
 * U.S. Census Bureau, CPS ASEC 2025, PINC-01, Both sexes, All races,
 * total work experience, “All people” row.
 * Counts are thousands of people. Forty $2,500 brackets from $1–$2,499
 * (this first bracket also includes losses) through $97,500–$99,999,
 * then an open interval at $100,000 and over.
 * Published median on that row: $46,440. Published mean: $69,360.
 * Bracket counts can miss the published total slightly because Census rounds.
 */
const INDIVIDUAL_BRACKET_COUNTS = [
  10780, 4222, 4352, 3675, 7031, 5938, 6703, 4918, 7569, 5134, 7004, 4186, 8273,
  3659, 6768, 3858, 7102, 2923, 5507, 3404, 7518, 2846, 4228, 2233, 6532, 2059,
  3593, 1978, 4359, 1931, 3846, 1645, 3742, 1593, 2390, 1236, 2591, 1184, 1925,
  1170,
] as const;

export const INDIVIDUAL_WITH_INCOME_THOUSANDS = 214500;
export const INDIVIDUAL_OPEN_INTERVAL_START = 100000;
export const INDIVIDUAL_OPEN_INTERVAL_THOUSANDS = 42940;

function individualBrackets(): { income: number; percentile: number }[] {
  let cumulative = 0;
  return INDIVIDUAL_BRACKET_COUNTS.map((count, index) => {
    cumulative += count;
    const upper = (index + 1) * 2500 - 1;
    const percentile =
      (cumulative / INDIVIDUAL_WITH_INCOME_THOUSANDS) * 100;
    return { income: upper, percentile };
  });
}

const INDIVIDUAL_2024: IncomeDistributionDataset = {
  incomeType: 'individual',
  referenceYear: 2024,
  currency: 'USD',
  source:
    'U.S. Census Bureau, CPS ASEC 2025, PINC-01 (Both sexes, All races, total work experience, people 15+ with money income in 2024). Median $46,440 and mean $69,360 from that row. Percentiles are the cumulative share of rounded bracket counts.',
  lastUpdated: '2025-09',
  populationLabel: 'people age 15+ with money income',
  medianIncome: 46440,
  meanIncome: 69360,
  brackets: individualBrackets(),
};

export function datasetFor(incomeType: IncomeType): IncomeDistributionDataset {
  return incomeType === 'household' ? HOUSEHOLD_2024 : INDIVIDUAL_2024;
}
