/**
 * US household net worth benchmarks from the Federal Reserve
 * Survey of Consumer Finances (SCF) 2022.
 *
 * Source: Board of Governors of the Federal Reserve System,
 * “Changes in U.S. Family Finances from 2019 to 2022” (October 2023), Table 2.
 * https://www.federalreserve.gov/publications/October-2023-changes-in-us-family-finances-from-2019-to-2022.htm
 *
 * Values are family (household) median and mean net worth in 2022 dollars.
 * They are not individual net worth and are not currency-converted here.
 * Last verified: 2026-03-26.
 */

import type { ComparisonType, NetWorthBenchmark } from './types';

export const SCF_DATA_YEAR = 2022;
export const SCF_SOURCE =
  'Federal Reserve Survey of Consumer Finances (SCF) 2022; Bulletin Table 2 (Oct 2023). Figures are household median/mean net worth in 2022 USD.';

/** SCF Table 2 amounts were published in thousands of 2022 dollars. */
const k = (thousands: number) => thousands * 1000;

export const INCOME_BENCHMARKS: readonly NetWorthBenchmark[] = [
  {
    id: 'inc-lt20',
    label: 'Income: less than 20th percentile',
    meanUsd: k(129.7),
    medianUsd: k(14.0),
  },
  {
    id: 'inc-20-39',
    label: 'Income: 20th–39.9th percentile',
    meanUsd: k(218.7),
    medianUsd: k(71.0),
  },
  {
    id: 'inc-40-59',
    label: 'Income: 40th–59.9th percentile',
    meanUsd: k(385.4),
    medianUsd: k(159.3),
  },
  {
    id: 'inc-60-79',
    label: 'Income: 60th–79.9th percentile',
    meanUsd: k(636.8),
    medianUsd: k(307.2),
  },
  {
    id: 'inc-80-89',
    label: 'Income: 80th–89.9th percentile',
    meanUsd: k(1264.7),
    medianUsd: k(747.0),
  },
  {
    id: 'inc-90-100',
    label: 'Income: 90th–100th percentile',
    meanUsd: k(6629.6),
    medianUsd: k(2556.2),
  },
];

export const AGE_BENCHMARKS: readonly NetWorthBenchmark[] = [
  {
    id: 'age-lt35',
    label: 'Age under 35',
    meanUsd: k(183.5),
    medianUsd: k(39.0),
  },
  {
    id: 'age-35-44',
    label: 'Age 35–44',
    meanUsd: k(549.6),
    medianUsd: k(135.6),
  },
  {
    id: 'age-45-54',
    label: 'Age 45–54',
    meanUsd: k(975.8),
    medianUsd: k(247.2),
  },
  {
    id: 'age-55-64',
    label: 'Age 55–64',
    meanUsd: k(1566.9),
    medianUsd: k(364.5),
  },
  {
    id: 'age-65-74',
    label: 'Age 65–74',
    meanUsd: k(1794.6),
    medianUsd: k(409.9),
  },
  {
    id: 'age-75-plus',
    label: 'Age 75 and above',
    meanUsd: k(1624.1),
    medianUsd: k(335.6),
  },
];

/** Wealth-level groups = SCF percentile of net worth (household). */
export const WEALTH_BENCHMARKS: readonly NetWorthBenchmark[] = [
  {
    id: 'wealth-lt25',
    label: 'Wealth: less than 25th percentile',
    meanUsd: k(-5.3),
    medianUsd: k(3.5),
  },
  {
    id: 'wealth-25-49',
    label: 'Wealth: 25th–49.9th percentile',
    meanUsd: k(98.8),
    medianUsd: k(93.3),
  },
  {
    id: 'wealth-50-74',
    label: 'Wealth: 50th–74.9th percentile',
    meanUsd: k(373.7),
    medianUsd: k(356.3),
  },
  {
    id: 'wealth-75-89',
    label: 'Wealth: 75th–89.9th percentile',
    meanUsd: k(1102.4),
    medianUsd: k(1036.2),
  },
  {
    id: 'wealth-90-100',
    label: 'Wealth: 90th–100th percentile',
    meanUsd: k(7810.5),
    medianUsd: k(3794.6),
  },
];

export const ALL_FAMILIES_BENCHMARK: NetWorthBenchmark = {
  id: 'all-families',
  label: 'All US families',
  meanUsd: k(1063.7),
  medianUsd: k(192.9),
};

export function benchmarksForType(
  type: ComparisonType,
): readonly NetWorthBenchmark[] {
  if (type === 'age') return AGE_BENCHMARKS;
  if (type === 'wealth') return WEALTH_BENCHMARKS;
  return INCOME_BENCHMARKS;
}

export function getNetWorthBenchmark(
  type: ComparisonType,
  groupId: string,
): NetWorthBenchmark | null {
  return benchmarksForType(type).find((b) => b.id === groupId) ?? null;
}

export function defaultGroupId(type: ComparisonType): string {
  return benchmarksForType(type)[0]!.id;
}
