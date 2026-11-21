/**
 * State / DC individual income tax estimates for Mega Millions payouts.
 *
 * Tax year reference: 2025 (rates compiled from published state schedules).
 * Last updated: 2026-03-26
 *
 * Scope notes:
 * - No state income tax jurisdictions return $0 state tax.
 * - Flat-rate states use the published flat rate on taxable winnings.
 * - Progressive states use abbreviated bracket tables sufficient for large
 *   lottery awards (top brackets dominate jackpot lump sums).
 * - Massachusetts includes the 4% surtax on taxable income above the threshold.
 * - Estimates assume winnings are taxable as ordinary income in the selected
 *   residence state, with no other income and no state-specific lottery
 *   exemptions unless listed. Local taxes are omitted.
 * - Not official lottery or DOR advice.
 */

import type { FilingStatus, UsStateCode } from '../types';
import { applyProgressiveTax, type TaxBracket } from './federal';

export const STATE_TAX_YEAR = 2025;

type StateTaxKind = 'none' | 'flat' | 'progressive';

interface NoneStateTax {
  kind: 'none';
  name: string;
  note?: string;
}

interface FlatStateTax {
  kind: 'flat';
  name: string;
  rate: number;
  /** Optional flat deduction / exclusion before applying the rate. */
  deduction?: number;
  note?: string;
}

interface ProgressiveStateTax {
  kind: 'progressive';
  name: string;
  brackets: Record<'single' | 'joint', readonly TaxBracket[]>;
  standardDeduction?: Record<'single' | 'joint', number>;
  note?: string;
}

export type StateTaxConfig = NoneStateTax | FlatStateTax | ProgressiveStateTax;

function filingBucket(
  filingStatus: FilingStatus,
): 'single' | 'joint' {
  return filingStatus === 'married_jointly' ||
    filingStatus === 'qualifying_surviving_spouse'
    ? 'joint'
    : 'single';
}

/** Compact progressive helper used by several mid-tier states. */
function progressive(
  name: string,
  single: readonly TaxBracket[],
  joint: readonly TaxBracket[],
  deductionSingle = 0,
  deductionJoint = 0,
  note?: string,
): ProgressiveStateTax {
  return {
    kind: 'progressive',
    name,
    brackets: { single, joint },
    standardDeduction: {
      single: deductionSingle,
      joint: deductionJoint,
    },
    note,
  };
}

export const STATE_TAX_CONFIG: Record<UsStateCode, StateTaxConfig> = {
  AL: progressive(
    'Alabama',
    [
      { upTo: 500, rate: 0.02 },
      { upTo: 3_000, rate: 0.04 },
      { upTo: Infinity, rate: 0.05 },
    ],
    [
      { upTo: 1_000, rate: 0.02 },
      { upTo: 6_000, rate: 0.04 },
      { upTo: Infinity, rate: 0.05 },
    ],
  ),
  AK: { kind: 'none', name: 'Alaska', note: 'No state individual income tax.' },
  AZ: { kind: 'flat', name: 'Arizona', rate: 0.025 },
  AR: progressive(
    'Arkansas',
    [
      { upTo: 4_300, rate: 0.02 },
      { upTo: 8_500, rate: 0.04 },
      { upTo: Infinity, rate: 0.044 },
    ],
    [
      { upTo: 4_300, rate: 0.02 },
      { upTo: 8_500, rate: 0.04 },
      { upTo: Infinity, rate: 0.044 },
    ],
  ),
  CA: progressive(
    'California',
    [
      { upTo: 10_756, rate: 0.01 },
      { upTo: 25_499, rate: 0.02 },
      { upTo: 40_245, rate: 0.04 },
      { upTo: 55_866, rate: 0.06 },
      { upTo: 70_606, rate: 0.08 },
      { upTo: 360_659, rate: 0.093 },
      { upTo: 432_787, rate: 0.103 },
      { upTo: 721_314, rate: 0.113 },
      { upTo: 1_000_000, rate: 0.123 },
      { upTo: Infinity, rate: 0.133 },
    ],
    [
      { upTo: 21_512, rate: 0.01 },
      { upTo: 50_998, rate: 0.02 },
      { upTo: 80_490, rate: 0.04 },
      { upTo: 111_732, rate: 0.06 },
      { upTo: 141_212, rate: 0.08 },
      { upTo: 721_318, rate: 0.093 },
      { upTo: 865_574, rate: 0.103 },
      { upTo: 1_000_000, rate: 0.113 },
      { upTo: 1_442_628, rate: 0.123 },
      { upTo: Infinity, rate: 0.133 },
    ],
    5_540,
    11_080,
    'Includes Mental Health Services Tax at top rates for high incomes.',
  ),
  CO: { kind: 'flat', name: 'Colorado', rate: 0.044 },
  CT: progressive(
    'Connecticut',
    [
      { upTo: 10_000, rate: 0.02 },
      { upTo: 50_000, rate: 0.045 },
      { upTo: 100_000, rate: 0.055 },
      { upTo: 200_000, rate: 0.06 },
      { upTo: 250_000, rate: 0.065 },
      { upTo: 500_000, rate: 0.069 },
      { upTo: Infinity, rate: 0.0699 },
    ],
    [
      { upTo: 20_000, rate: 0.02 },
      { upTo: 100_000, rate: 0.045 },
      { upTo: 200_000, rate: 0.055 },
      { upTo: 400_000, rate: 0.06 },
      { upTo: 500_000, rate: 0.065 },
      { upTo: 1_000_000, rate: 0.069 },
      { upTo: Infinity, rate: 0.0699 },
    ],
  ),
  DE: progressive(
    'Delaware',
    [
      { upTo: 2_000, rate: 0.022 },
      { upTo: 5_000, rate: 0.039 },
      { upTo: 10_000, rate: 0.048 },
      { upTo: 20_000, rate: 0.052 },
      { upTo: 25_000, rate: 0.0555 },
      { upTo: 60_000, rate: 0.066 },
      { upTo: Infinity, rate: 0.066 },
    ],
    [
      { upTo: 2_000, rate: 0.022 },
      { upTo: 5_000, rate: 0.039 },
      { upTo: 10_000, rate: 0.048 },
      { upTo: 20_000, rate: 0.052 },
      { upTo: 25_000, rate: 0.0555 },
      { upTo: 60_000, rate: 0.066 },
      { upTo: Infinity, rate: 0.066 },
    ],
  ),
  DC: progressive(
    'District of Columbia',
    [
      { upTo: 10_000, rate: 0.04 },
      { upTo: 40_000, rate: 0.06 },
      { upTo: 60_000, rate: 0.065 },
      { upTo: 250_000, rate: 0.085 },
      { upTo: 500_000, rate: 0.0925 },
      { upTo: 1_000_000, rate: 0.0975 },
      { upTo: Infinity, rate: 0.1075 },
    ],
    [
      { upTo: 10_000, rate: 0.04 },
      { upTo: 40_000, rate: 0.06 },
      { upTo: 60_000, rate: 0.065 },
      { upTo: 250_000, rate: 0.085 },
      { upTo: 500_000, rate: 0.0925 },
      { upTo: 1_000_000, rate: 0.0975 },
      { upTo: Infinity, rate: 0.1075 },
    ],
  ),
  FL: { kind: 'none', name: 'Florida', note: 'No state individual income tax.' },
  GA: { kind: 'flat', name: 'Georgia', rate: 0.0539 },
  HI: progressive(
    'Hawaii',
    [
      { upTo: 9_600, rate: 0.014 },
      { upTo: 19_200, rate: 0.032 },
      { upTo: 28_800, rate: 0.055 },
      { upTo: 38_400, rate: 0.064 },
      { upTo: 48_000, rate: 0.068 },
      { upTo: 72_000, rate: 0.072 },
      { upTo: 96_000, rate: 0.076 },
      { upTo: 300_000, rate: 0.079 },
      { upTo: Infinity, rate: 0.11 },
    ],
    [
      { upTo: 19_200, rate: 0.014 },
      { upTo: 38_400, rate: 0.032 },
      { upTo: 57_600, rate: 0.055 },
      { upTo: 76_800, rate: 0.064 },
      { upTo: 96_000, rate: 0.068 },
      { upTo: 144_000, rate: 0.072 },
      { upTo: 192_000, rate: 0.076 },
      { upTo: 300_000, rate: 0.079 },
      { upTo: Infinity, rate: 0.11 },
    ],
  ),
  ID: progressive(
    'Idaho',
    [
      { upTo: 1_000, rate: 0.0 },
      { upTo: Infinity, rate: 0.058 },
    ],
    [
      { upTo: 2_000, rate: 0.0 },
      { upTo: Infinity, rate: 0.058 },
    ],
  ),
  IL: { kind: 'flat', name: 'Illinois', rate: 0.0495 },
  IN: { kind: 'flat', name: 'Indiana', rate: 0.03 },
  IA: { kind: 'flat', name: 'Iowa', rate: 0.038 },
  KS: progressive(
    'Kansas',
    [
      { upTo: 15_000, rate: 0.052 },
      { upTo: 30_000, rate: 0.056 },
      { upTo: Infinity, rate: 0.057 },
    ],
    [
      { upTo: 30_000, rate: 0.052 },
      { upTo: 60_000, rate: 0.056 },
      { upTo: Infinity, rate: 0.057 },
    ],
  ),
  KY: { kind: 'flat', name: 'Kentucky', rate: 0.04 },
  LA: progressive(
    'Louisiana',
    [
      { upTo: 12_500, rate: 0.0185 },
      { upTo: 50_000, rate: 0.035 },
      { upTo: Infinity, rate: 0.0425 },
    ],
    [
      { upTo: 25_000, rate: 0.0185 },
      { upTo: 100_000, rate: 0.035 },
      { upTo: Infinity, rate: 0.0425 },
    ],
  ),
  ME: progressive(
    'Maine',
    [
      { upTo: 26_800, rate: 0.058 },
      { upTo: 63_450, rate: 0.0675 },
      { upTo: Infinity, rate: 0.0715 },
    ],
    [
      { upTo: 53_600, rate: 0.058 },
      { upTo: 126_900, rate: 0.0675 },
      { upTo: Infinity, rate: 0.0715 },
    ],
  ),
  MD: progressive(
    'Maryland',
    [
      { upTo: 1_000, rate: 0.02 },
      { upTo: 2_000, rate: 0.03 },
      { upTo: 3_000, rate: 0.04 },
      { upTo: 100_000, rate: 0.0475 },
      { upTo: 125_000, rate: 0.05 },
      { upTo: 150_000, rate: 0.0525 },
      { upTo: 250_000, rate: 0.055 },
      { upTo: Infinity, rate: 0.0575 },
    ],
    [
      { upTo: 1_000, rate: 0.02 },
      { upTo: 2_000, rate: 0.03 },
      { upTo: 3_000, rate: 0.04 },
      { upTo: 150_000, rate: 0.0475 },
      { upTo: 175_000, rate: 0.05 },
      { upTo: 225_000, rate: 0.0525 },
      { upTo: 300_000, rate: 0.055 },
      { upTo: Infinity, rate: 0.0575 },
    ],
    0,
    0,
    'State tax only; local Maryland piggyback taxes omitted.',
  ),
  MA: {
    kind: 'flat',
    name: 'Massachusetts',
    rate: 0.05,
    note: 'Includes 4% surtax on taxable income above $1,053,750 (TY 2024 threshold used as estimate).',
  },
  MI: { kind: 'flat', name: 'Michigan', rate: 0.0425 },
  MN: progressive(
    'Minnesota',
    [
      { upTo: 31_690, rate: 0.0535 },
      { upTo: 104_090, rate: 0.068 },
      { upTo: 193_240, rate: 0.0785 },
      { upTo: Infinity, rate: 0.0985 },
    ],
    [
      { upTo: 46_330, rate: 0.0535 },
      { upTo: 184_040, rate: 0.068 },
      { upTo: 321_450, rate: 0.0785 },
      { upTo: Infinity, rate: 0.0985 },
    ],
  ),
  MS: { kind: 'flat', name: 'Mississippi', rate: 0.044 },
  MO: progressive(
    'Missouri',
    [
      { upTo: 1_273, rate: 0.0 },
      { upTo: 2_546, rate: 0.02 },
      { upTo: 3_819, rate: 0.025 },
      { upTo: 5_092, rate: 0.03 },
      { upTo: 6_365, rate: 0.035 },
      { upTo: 7_638, rate: 0.04 },
      { upTo: 8_911, rate: 0.045 },
      { upTo: Infinity, rate: 0.048 },
    ],
    [
      { upTo: 1_273, rate: 0.0 },
      { upTo: 2_546, rate: 0.02 },
      { upTo: 3_819, rate: 0.025 },
      { upTo: 5_092, rate: 0.03 },
      { upTo: 6_365, rate: 0.035 },
      { upTo: 7_638, rate: 0.04 },
      { upTo: 8_911, rate: 0.045 },
      { upTo: Infinity, rate: 0.048 },
    ],
  ),
  MT: progressive(
    'Montana',
    [
      { upTo: 20_500, rate: 0.047 },
      { upTo: Infinity, rate: 0.059 },
    ],
    [
      { upTo: 41_000, rate: 0.047 },
      { upTo: Infinity, rate: 0.059 },
    ],
  ),
  NE: progressive(
    'Nebraska',
    [
      { upTo: 3_900, rate: 0.0246 },
      { upTo: 23_370, rate: 0.0351 },
      { upTo: 37_670, rate: 0.0501 },
      { upTo: Infinity, rate: 0.0584 },
    ],
    [
      { upTo: 7_790, rate: 0.0246 },
      { upTo: 46_750, rate: 0.0351 },
      { upTo: 75_340, rate: 0.0501 },
      { upTo: Infinity, rate: 0.0584 },
    ],
  ),
  NV: { kind: 'none', name: 'Nevada', note: 'No state individual income tax.' },
  NH: {
    kind: 'none',
    name: 'New Hampshire',
    note: 'No broad individual income tax on lottery winnings in this estimate.',
  },
  NJ: progressive(
    'New Jersey',
    [
      { upTo: 20_000, rate: 0.014 },
      { upTo: 35_000, rate: 0.0175 },
      { upTo: 40_000, rate: 0.035 },
      { upTo: 75_000, rate: 0.05525 },
      { upTo: 500_000, rate: 0.0637 },
      { upTo: 1_000_000, rate: 0.0897 },
      { upTo: Infinity, rate: 0.1075 },
    ],
    [
      { upTo: 20_000, rate: 0.014 },
      { upTo: 50_000, rate: 0.0175 },
      { upTo: 70_000, rate: 0.0245 },
      { upTo: 80_000, rate: 0.035 },
      { upTo: 150_000, rate: 0.05525 },
      { upTo: 500_000, rate: 0.0637 },
      { upTo: 1_000_000, rate: 0.0897 },
      { upTo: Infinity, rate: 0.1075 },
    ],
  ),
  NM: progressive(
    'New Mexico',
    [
      { upTo: 5_500, rate: 0.017 },
      { upTo: 11_000, rate: 0.032 },
      { upTo: 16_000, rate: 0.047 },
      { upTo: 210_000, rate: 0.049 },
      { upTo: Infinity, rate: 0.059 },
    ],
    [
      { upTo: 8_000, rate: 0.017 },
      { upTo: 16_000, rate: 0.032 },
      { upTo: 24_000, rate: 0.047 },
      { upTo: 315_000, rate: 0.049 },
      { upTo: Infinity, rate: 0.059 },
    ],
  ),
  NY: progressive(
    'New York',
    [
      { upTo: 8_500, rate: 0.04 },
      { upTo: 11_700, rate: 0.045 },
      { upTo: 13_900, rate: 0.0525 },
      { upTo: 80_650, rate: 0.055 },
      { upTo: 215_400, rate: 0.06 },
      { upTo: 1_077_550, rate: 0.0685 },
      { upTo: 5_000_000, rate: 0.0965 },
      { upTo: 25_000_000, rate: 0.103 },
      { upTo: Infinity, rate: 0.109 },
    ],
    [
      { upTo: 17_150, rate: 0.04 },
      { upTo: 23_600, rate: 0.045 },
      { upTo: 27_900, rate: 0.0525 },
      { upTo: 161_550, rate: 0.055 },
      { upTo: 323_200, rate: 0.06 },
      { upTo: 2_155_350, rate: 0.0685 },
      { upTo: 5_000_000, rate: 0.0965 },
      { upTo: 25_000_000, rate: 0.103 },
      { upTo: Infinity, rate: 0.109 },
    ],
    0,
    0,
    'State tax only; NYC local tax omitted.',
  ),
  NC: { kind: 'flat', name: 'North Carolina', rate: 0.0425 },
  ND: progressive(
    'North Dakota',
    [
      { upTo: 44_725, rate: 0.0 },
      { upTo: 225_975, rate: 0.0195 },
      { upTo: Infinity, rate: 0.025 },
    ],
    [
      { upTo: 74_750, rate: 0.0 },
      { upTo: 275_100, rate: 0.0195 },
      { upTo: Infinity, rate: 0.025 },
    ],
  ),
  OH: progressive(
    'Ohio',
    [
      { upTo: 26_050, rate: 0.0 },
      { upTo: 100_000, rate: 0.0275 },
      { upTo: Infinity, rate: 0.035 },
    ],
    [
      { upTo: 26_050, rate: 0.0 },
      { upTo: 100_000, rate: 0.0275 },
      { upTo: Infinity, rate: 0.035 },
    ],
  ),
  OK: progressive(
    'Oklahoma',
    [
      { upTo: 1_000, rate: 0.0025 },
      { upTo: 2_500, rate: 0.0075 },
      { upTo: 3_750, rate: 0.0175 },
      { upTo: 4_900, rate: 0.0275 },
      { upTo: 7_200, rate: 0.0375 },
      { upTo: Infinity, rate: 0.0475 },
    ],
    [
      { upTo: 2_000, rate: 0.0025 },
      { upTo: 5_000, rate: 0.0075 },
      { upTo: 7_500, rate: 0.0175 },
      { upTo: 9_800, rate: 0.0275 },
      { upTo: 12_200, rate: 0.0375 },
      { upTo: Infinity, rate: 0.0475 },
    ],
  ),
  OR: progressive(
    'Oregon',
    [
      { upTo: 4_050, rate: 0.0475 },
      { upTo: 10_200, rate: 0.0675 },
      { upTo: 125_000, rate: 0.0875 },
      { upTo: Infinity, rate: 0.099 },
    ],
    [
      { upTo: 8_100, rate: 0.0475 },
      { upTo: 20_400, rate: 0.0675 },
      { upTo: 250_000, rate: 0.0875 },
      { upTo: Infinity, rate: 0.099 },
    ],
  ),
  PA: { kind: 'flat', name: 'Pennsylvania', rate: 0.0307 },
  RI: progressive(
    'Rhode Island',
    [
      { upTo: 77_450, rate: 0.0375 },
      { upTo: 176_050, rate: 0.0475 },
      { upTo: Infinity, rate: 0.0599 },
    ],
    [
      { upTo: 77_450, rate: 0.0375 },
      { upTo: 176_050, rate: 0.0475 },
      { upTo: Infinity, rate: 0.0599 },
    ],
  ),
  SC: progressive(
    'South Carolina',
    [
      { upTo: 3_460, rate: 0.0 },
      { upTo: 17_330, rate: 0.03 },
      { upTo: Infinity, rate: 0.064 },
    ],
    [
      { upTo: 3_460, rate: 0.0 },
      { upTo: 17_330, rate: 0.03 },
      { upTo: Infinity, rate: 0.064 },
    ],
  ),
  SD: {
    kind: 'none',
    name: 'South Dakota',
    note: 'No state individual income tax.',
  },
  TN: {
    kind: 'none',
    name: 'Tennessee',
    note: 'No state individual income tax on lottery winnings in this estimate.',
  },
  TX: { kind: 'none', name: 'Texas', note: 'No state individual income tax.' },
  UT: { kind: 'flat', name: 'Utah', rate: 0.0455 },
  VT: progressive(
    'Vermont',
    [
      { upTo: 45_400, rate: 0.0335 },
      { upTo: 110_050, rate: 0.066 },
      { upTo: 229_550, rate: 0.076 },
      { upTo: Infinity, rate: 0.0875 },
    ],
    [
      { upTo: 75_850, rate: 0.0335 },
      { upTo: 183_400, rate: 0.066 },
      { upTo: 279_450, rate: 0.076 },
      { upTo: Infinity, rate: 0.0875 },
    ],
  ),
  VA: progressive(
    'Virginia',
    [
      { upTo: 3_000, rate: 0.02 },
      { upTo: 5_000, rate: 0.03 },
      { upTo: 17_000, rate: 0.05 },
      { upTo: Infinity, rate: 0.0575 },
    ],
    [
      { upTo: 3_000, rate: 0.02 },
      { upTo: 5_000, rate: 0.03 },
      { upTo: 17_000, rate: 0.05 },
      { upTo: Infinity, rate: 0.0575 },
    ],
  ),
  WA: {
    kind: 'none',
    name: 'Washington',
    note: 'No broad state individual income tax; capital-gains tax omitted for lottery cash estimates.',
  },
  WV: progressive(
    'West Virginia',
    [
      { upTo: 10_000, rate: 0.0236 },
      { upTo: 25_000, rate: 0.0315 },
      { upTo: 40_000, rate: 0.0354 },
      { upTo: 60_000, rate: 0.0472 },
      { upTo: Infinity, rate: 0.0512 },
    ],
    [
      { upTo: 10_000, rate: 0.0236 },
      { upTo: 25_000, rate: 0.0315 },
      { upTo: 40_000, rate: 0.0354 },
      { upTo: 60_000, rate: 0.0472 },
      { upTo: Infinity, rate: 0.0512 },
    ],
  ),
  WI: progressive(
    'Wisconsin',
    [
      { upTo: 14_320, rate: 0.0354 },
      { upTo: 28_640, rate: 0.0465 },
      { upTo: 315_310, rate: 0.053 },
      { upTo: Infinity, rate: 0.0765 },
    ],
    [
      { upTo: 19_090, rate: 0.0354 },
      { upTo: 38_190, rate: 0.0465 },
      { upTo: 420_420, rate: 0.053 },
      { upTo: Infinity, rate: 0.0765 },
    ],
  ),
  WY: { kind: 'none', name: 'Wyoming', note: 'No state individual income tax.' },
};

const MA_SURTAX_THRESHOLD = 1_053_750;
const MA_SURTAX_RATE = 0.04;

export function calculateStateIncomeTax(
  amount: number,
  state: UsStateCode,
  filingStatus: FilingStatus,
  taxYear: number = STATE_TAX_YEAR,
): { tax: number; available: boolean; note?: string } {
  if (taxYear !== STATE_TAX_YEAR) {
    return {
      tax: 0,
      available: false,
      note: `State tax year ${taxYear} is not configured. Estimates use TY ${STATE_TAX_YEAR} only.`,
    };
  }
  if (!Number.isFinite(amount) || amount < 0) {
    return { tax: 0, available: true };
  }

  const config = STATE_TAX_CONFIG[state];
  if (!config) {
    return {
      tax: 0,
      available: false,
      note: 'State tax configuration is unavailable for the selected jurisdiction.',
    };
  }

  if (config.kind === 'none') {
    return { tax: 0, available: true, note: config.note };
  }

  if (config.kind === 'flat') {
    const taxable = Math.max(0, amount - (config.deduction ?? 0));
    let tax = taxable * config.rate;
    if (state === 'MA' && taxable > MA_SURTAX_THRESHOLD) {
      tax += (taxable - MA_SURTAX_THRESHOLD) * MA_SURTAX_RATE;
    }
    return { tax, available: true, note: config.note };
  }

  const bucket = filingBucket(filingStatus);
  const deduction = config.standardDeduction?.[bucket] ?? 0;
  const taxable = Math.max(0, amount - deduction);
  const tax = applyProgressiveTax(taxable, config.brackets[bucket]);
  return { tax, available: true, note: config.note };
}

export function getStateTaxKind(state: UsStateCode): StateTaxKind {
  return STATE_TAX_CONFIG[state].kind;
}
