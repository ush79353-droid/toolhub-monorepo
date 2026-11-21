/**
 * Verified US federal ordinary-income tax brackets.
 *
 * Sources (official IRS):
 * - TY 2024: Rev. Proc. 2023-34
 * - TY 2025: Rev. Proc. 2024-40
 * - TY 2026: Rev. Proc. 2025-32 / IRS IR-2025-103
 *
 * Qualifying Surviving Spouse uses Married Filing Jointly brackets.
 */

import type { TaxBracketFilingStatus, TaxBracketYear } from './types';

export interface OrdinaryBracket {
  /** Lower bound (inclusive). */
  from: number;
  /** Upper bound (exclusive of next band); Infinity for top. */
  upTo: number;
  rate: number;
  /** Cumulative tax on income below `from`. */
  baseTax: number;
}

const RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37] as const;

/** Upper bounds of each rate band (Rev. Proc. 2023-34). */
const T2024 = {
  single: [11_600, 47_150, 100_525, 191_950, 243_725, 609_350],
  mfj: [23_200, 94_300, 201_050, 383_900, 487_450, 731_200],
  mfs: [11_600, 47_150, 100_525, 191_950, 243_725, 365_600],
  hoh: [16_550, 63_100, 100_500, 191_950, 243_700, 609_350],
} as const;

/** Rev. Proc. 2024-40 */
const T2025 = {
  single: [11_925, 48_475, 103_350, 197_300, 250_525, 626_350],
  mfj: [23_850, 96_950, 206_700, 394_600, 501_050, 751_600],
  mfs: [11_925, 48_475, 103_350, 197_300, 250_525, 375_800],
  hoh: [17_000, 64_850, 103_350, 197_300, 250_500, 626_350],
} as const;

/** Rev. Proc. 2025-32 / IR-2025-103 */
const T2026 = {
  single: [12_400, 50_400, 105_700, 201_775, 256_225, 640_600],
  mfj: [24_800, 100_800, 211_400, 403_550, 512_450, 768_700],
  mfs: [12_400, 50_400, 105_700, 201_775, 256_225, 384_350],
  hoh: [17_700, 67_450, 105_700, 201_750, 256_200, 640_600],
} as const;

function bracketsFromThresholds(
  thresholds: readonly number[],
  rates: readonly number[]
): OrdinaryBracket[] {
  const out: OrdinaryBracket[] = [];
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

function statusMap(
  single: OrdinaryBracket[],
  mfj: OrdinaryBracket[],
  mfs: OrdinaryBracket[],
  hoh: OrdinaryBracket[]
): Record<TaxBracketFilingStatus, OrdinaryBracket[]> {
  return {
    single,
    'married-joint': mfj,
    'married-separate': mfs,
    'head-of-household': hoh,
    'qualifying-surviving-spouse': mfj,
  };
}

export const YEAR_BRACKETS: Record<
  TaxBracketYear,
  Record<TaxBracketFilingStatus, OrdinaryBracket[]>
> = {
  2024: statusMap(
    bracketsFromThresholds(T2024.single, RATES),
    bracketsFromThresholds(T2024.mfj, RATES),
    bracketsFromThresholds(T2024.mfs, RATES),
    bracketsFromThresholds(T2024.hoh, RATES)
  ),
  2025: statusMap(
    bracketsFromThresholds(T2025.single, RATES),
    bracketsFromThresholds(T2025.mfj, RATES),
    bracketsFromThresholds(T2025.mfs, RATES),
    bracketsFromThresholds(T2025.hoh, RATES)
  ),
  2026: statusMap(
    bracketsFromThresholds(T2026.single, RATES),
    bracketsFromThresholds(T2026.mfj, RATES),
    bracketsFromThresholds(T2026.mfs, RATES),
    bracketsFromThresholds(T2026.hoh, RATES)
  ),
};

export const YEAR_SOURCE: Record<TaxBracketYear, string> = {
  2024: 'IRS Rev. Proc. 2023-34 (TY 2024 ordinary income tax rates and brackets)',
  2025: 'IRS Rev. Proc. 2024-40 (TY 2025 ordinary income tax rates and brackets)',
  2026: 'IRS Rev. Proc. 2025-32 / IR-2025-103 (TY 2026 ordinary income tax rates and brackets)',
};

export const FILING_STATUS_LABELS: Record<TaxBracketFilingStatus, string> = {
  single: 'Single',
  'married-joint': 'Married Filing Jointly',
  'married-separate': 'Married Filing Separately',
  'head-of-household': 'Head of Household',
  'qualifying-surviving-spouse': 'Qualifying Surviving Spouse',
};
