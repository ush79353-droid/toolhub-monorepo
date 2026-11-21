import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  SCF_DATA_YEAR,
  SCF_SOURCE,
  getNetWorthBenchmark,
} from './benchmarks';
import type {
  ComparisonType,
  NetWorthAssets,
  NetWorthComparisonResult,
  NetWorthInput,
  NetWorthLiabilities,
  NetWorthResult,
} from './types';
import { ASSET_FIELDS, LIABILITY_FIELDS } from './types';

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function calculateTotalAssets(
  assets: Record<keyof NetWorthAssets, number>,
): number {
  return ASSET_FIELDS.reduce((sum, field) => sum + assets[field.key], 0);
}

export function calculateTotalLiabilities(
  liabilities: Record<keyof NetWorthLiabilities, number>,
): number {
  return LIABILITY_FIELDS.reduce(
    (sum, field) => sum + liabilities[field.key],
    0,
  );
}

export function compareNetWorth(
  userNetWorth: number,
  type: ComparisonType,
  groupId: string,
): NetWorthComparisonResult | null {
  const benchmark = getNetWorthBenchmark(type, groupId);
  if (!benchmark) return null;

  const differenceFromMean = userNetWorth - benchmark.meanUsd;
  const percentVsMean =
    Math.abs(benchmark.meanUsd) < 1e-9
      ? null
      : (differenceFromMean / Math.abs(benchmark.meanUsd)) * 100;

  return {
    type,
    groupId: benchmark.id,
    groupLabel: benchmark.label,
    meanUsd: benchmark.meanUsd,
    medianUsd: benchmark.medianUsd,
    userNetWorth,
    differenceFromMean,
    percentVsMean,
    dataYear: SCF_DATA_YEAR,
    source: SCF_SOURCE,
    note: 'SCF figures are US household (family) net worth in 2022 USD; not individual finances and not converted from other currencies.',
  };
}

export function formatNetWorthMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMoneyWithSymbol(
  amount: number,
  currency: SupportedCurrency,
): string {
  const sign = amount < 0 ? '-' : '';
  return `${sign}${getCurrencySymbol(currency)}${formatNetWorthMoney(Math.abs(amount), currency)}`;
}

export function calculateNetWorth(input: {
  assets: Record<keyof NetWorthAssets, number>;
  liabilities: Record<keyof NetWorthLiabilities, number>;
  currency: SupportedCurrency;
  comparisonType: ComparisonType;
  comparisonGroupId: string;
}): NetWorthResult {
  const totalAssets = calculateTotalAssets(input.assets);
  const totalLiabilities = calculateTotalLiabilities(input.liabilities);
  const netWorth = totalAssets - totalLiabilities;
  const assetToLiabilityRatio =
    Math.abs(totalLiabilities) < 1e-12
      ? null
      : totalAssets / totalLiabilities;

  const comparison = compareNetWorth(
    netWorth,
    input.comparisonType,
    input.comparisonGroupId,
  );

  const money = (v: number) => formatMoneyWithSymbol(v, input.currency);
  const summaryLines = [
    'Net Worth Calculator',
    `Total assets: ${money(totalAssets)}`,
    `Total liabilities: ${money(totalLiabilities)}`,
    `Net worth: ${money(netWorth)}`,
    `Currency (denomination): ${input.currency}`,
  ];
  if (comparison) {
    summaryLines.push(
      `Compare (${comparison.groupLabel}): mean ${formatMoneyWithSymbol(comparison.meanUsd, 'USD')}, median ${formatMoneyWithSymbol(comparison.medianUsd, 'USD')}`,
      `Difference vs mean: ${formatMoneyWithSymbol(comparison.differenceFromMean, 'USD')}`,
      comparison.note,
    );
  }

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    assetToLiabilityRatio,
    comparison,
    currency: input.currency,
    summaryText: summaryLines.join('\n'),
  };
}

export function shareNetWorthText(result: NetWorthResult): string {
  return result.summaryText;
}

export function isNetWorthInputBlank(input: NetWorthInput): boolean {
  const assetBlank = ASSET_FIELDS.every(
    (f) => input.assets[f.key].trim() === '',
  );
  const liabilityBlank = LIABILITY_FIELDS.every(
    (f) => input.liabilities[f.key].trim() === '',
  );
  return assetBlank && liabilityBlank;
}
