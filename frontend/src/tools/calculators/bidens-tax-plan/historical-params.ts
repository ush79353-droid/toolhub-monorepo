/**
 * Historical parameters for Biden's Tax Plan Calculator.
 *
 * Baseline: U.S. federal income tax year 2022 under TCJA (then-current law).
 * Proposal: American Families Plan (AFP), May 2021 White House proposal —
 * ordinary top-rate change + extension of ARP-style Child Tax Credit.
 *
 * Sources:
 * - IRS Rev. Proc. 2021-45 (2022 brackets, standard deduction, aged add-on)
 * - Tax Foundation “2022 Tax Brackets” (IRS-sourced ordinary schedule)
 * - Tax Foundation “American Families Plan: Details & Analysis” (May 2021)
 * - IRS Topic C — 2021 CTC calculation (ARP two-step phaseout reused by AFP)
 * - CRS IN11656 (AFP CTC extension through 2025 + permanent refundability)
 *
 * Capital gains, NIIT, QBI, AMT, EITC, and itemized deductions are intentionally
 * out of scope (screenshot provides only AGI, filing status, age, and dependents).
 */

import type { FilingStatus } from './types';

export const BASELINE_TAX_YEAR = 2022 as const;
export const PROPOSAL_LABEL = 'American Families Plan (May 2021)' as const;

export interface Bracket {
  from: number;
  upTo: number;
  rate: number;
  baseTax: number;
}

function bracketsFromThresholds(
  thresholds: readonly number[],
  rates: readonly number[]
): Bracket[] {
  const out: Bracket[] = [];
  let baseTax = 0;
  for (let i = 0; i < rates.length; i++) {
    const from = i === 0 ? 0 : thresholds[i - 1]!;
    const upTo = i < thresholds.length ? thresholds[i]! : Number.POSITIVE_INFINITY;
    out.push({ from, upTo, rate: rates[i]!, baseTax });
    if (Number.isFinite(upTo)) {
      baseTax += (upTo - from) * rates[i]!;
    }
  }
  return out;
}

/** TY2022 ordinary rates (Rev. Proc. 2021-45 / Tax Foundation). */
const RATES_2022 = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37] as const;

/** Upper bounds of each rate band for TY2022. */
const T2022 = {
  single: [10_275, 41_775, 89_075, 170_050, 215_950, 539_900],
  married: [20_550, 83_550, 178_150, 340_100, 431_900, 647_850],
  head_of_household: [14_650, 55_900, 89_050, 170_050, 215_950, 539_900],
} as const;

/**
 * AFP ordinary schedule: same TY2022 brackets through 35%, then 39.6% above the
 * AFP top thresholds (Tax Foundation AFP analysis — 2022 first-year figures).
 * Thresholds replace the remainder of the 35% band and the entire 37% band.
 */
const AFP_TOP = {
  single: 452_700,
  married: 509_300,
  head_of_household: 452_700,
} as const;

const RATES_AFP = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.396] as const;

function afpThresholds(status: FilingStatus): number[] {
  const base = T2022[status];
  const top = AFP_TOP[status];
  // Keep the first five TY2022 upper bounds (through 32%), then AFP top cut.
  return [base[0]!, base[1]!, base[2]!, base[3]!, base[4]!, top];
}

export const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 12_950,
  married: 25_900,
  head_of_household: 19_400,
};

/** Additional standard deduction for age ≥ 65 (Rev. Proc. 2021-45 §3.15(3)). */
export const ADDITIONAL_STD_AGED_UNMARRIED = 1_750;
export const ADDITIONAL_STD_AGED_MARRIED = 1_400;

export const BASELINE_BRACKETS: Record<FilingStatus, readonly Bracket[]> = {
  single: bracketsFromThresholds(T2022.single, RATES_2022),
  married: bracketsFromThresholds(T2022.married, RATES_2022),
  head_of_household: bracketsFromThresholds(T2022.head_of_household, RATES_2022),
};

export const BIDEN_BRACKETS: Record<FilingStatus, readonly Bracket[]> = {
  single: bracketsFromThresholds(afpThresholds('single'), RATES_AFP),
  married: bracketsFromThresholds(afpThresholds('married'), RATES_AFP),
  head_of_household: bracketsFromThresholds(
    afpThresholds('head_of_household'),
    RATES_AFP
  ),
};

/** TCJA / baseline CTC (qualifying child under 17). */
export const BASELINE_CTC_PER_CHILD = 2_000;
export const ODC_PER_DEPENDENT = 500;
export const CTC_PHASEOUT_PER_STEP = 50;
export const CTC_PHASEOUT_STEP = 1_000;

/** Second (TCJA) phaseout thresholds. */
export const TCJA_PHASEOUT_THRESHOLD: Record<FilingStatus, number> = {
  single: 200_000,
  married: 400_000,
  head_of_household: 200_000,
};

/** AFP / ARP enhanced CTC amounts. */
export const AFP_CTC_UNDER_6 = 3_600;
export const AFP_CTC_AGES_6_TO_17 = 3_000;

/** First (enhancement) phaseout thresholds — IRS Topic C / ARP. */
export const AFP_FIRST_PHASEOUT_THRESHOLD: Record<FilingStatus, number> = {
  single: 75_000,
  married: 150_000,
  head_of_household: 112_500,
};
