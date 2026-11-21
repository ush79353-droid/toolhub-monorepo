import { COMPARISON_ITEMS, type ComparisonBucket } from './comparison-items';
import type { ComparisonLineResult, TrumpsTaxesResult } from './types';

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return '';
  const abs = Math.abs(ratio);
  const digits = abs >= 100 ? 2 : abs >= 10 ? 2 : 4;
  const rounded = Number(ratio.toFixed(digits));
  return String(rounded);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Whole units you can buy with amount at unitPrice (floor; never negative). */
export function itemQuantity(availableTaxAmount: number, itemUnitPrice: number): number {
  if (!(availableTaxAmount > 0) || !(itemUnitPrice > 0)) return 0;
  if (![availableTaxAmount, itemUnitPrice].every(Number.isFinite)) return 0;
  // Tiny epsilon offsets binary division noise (e.g. 2452/(2452/43) → 42.999… → 43).
  return Math.floor(availableTaxAmount / itemUnitPrice + 1e-10);
}

export function taxRatio(userTax: number, trumpTax: number): number | null {
  if (![userTax, trumpTax].every(Number.isFinite)) return null;
  if (!(trumpTax > 0)) return null;
  return userTax / trumpTax;
}

export function taxDifference(userTax: number, trumpTax: number): number | null {
  if (![userTax, trumpTax].every(Number.isFinite)) return null;
  return userTax - trumpTax;
}

export function percentageDifference(userTax: number, trumpTax: number): number | null {
  if (![userTax, trumpTax].every(Number.isFinite)) return null;
  if (!(trumpTax > 0)) return null;
  return ((userTax - trumpTax) / trumpTax) * 100;
}

function comparisonPhrase(ratio: number): string {
  if (ratio > 1) return '× as much as Trump’s reported tax';
  if (ratio === 1) return ': the same as Trump’s reported tax';
  return '× Trump’s reported tax (you paid less)';
}

function ratioLabel(ratio: number): string {
  if (ratio > 1) return `${formatRatio(ratio)}× more than Trump’s reported figure`;
  if (ratio === 1) return 'Equal to Trump’s reported figure';
  return `${formatRatio(ratio)}× Trump’s reported figure`;
}

function buildLines(
  bucket: ComparisonBucket,
  available: number,
  unitPrices: Record<string, number>,
): ComparisonLineResult[] {
  return COMPARISON_ITEMS.filter((item) => item.bucket === bucket).map((item) => {
    const unitPrice = unitPrices[item.id] ?? item.defaultUnitPriceUsd;
    const quantity = itemQuantity(available, unitPrice);
    return {
      id: item.id,
      label: item.label,
      unitLabel: item.unitLabel,
      bucket: item.bucket,
      unitPrice,
      quantity,
      formattedQuantity: new Intl.NumberFormat('en-US').format(quantity),
      formattedUnitPrice: formatUsd(unitPrice),
    };
  });
}

export function calculateTrumpsTaxesComparison(
  userTax: number,
  trumpTax: number,
  unitPrices: Record<string, number>,
): TrumpsTaxesResult | null {
  const ratio = taxRatio(userTax, trumpTax);
  const difference = taxDifference(userTax, trumpTax);
  const pct = percentageDifference(userTax, trumpTax);
  if (ratio === null || difference === null || pct === null) return null;
  if (userTax < 0 || trumpTax <= 0) return null;

  const availableForComparisons = Math.max(difference, 0);

  return {
    userTax,
    trumpTax,
    taxRatio: ratio,
    taxDifference: difference,
    percentageDifference: pct,
    availableForComparisons,
    ratioLabel: ratioLabel(ratio),
    comparisonPhrase: comparisonPhrase(ratio),
    formattedUserTax: formatUsd(userTax),
    formattedTrumpTax: formatUsd(trumpTax),
    formattedDifference: formatUsd(difference),
    formattedPercentageDifference: formatPercent(pct),
    formattedRatio: formatRatio(ratio),
    luxuryLines: buildLines('luxury', availableForComparisons, unitPrices),
    essentialLines: buildLines('essential', availableForComparisons, unitPrices),
  };
}

export function shareResultText(
  result: TrumpsTaxesResult,
  path = '/tools/trumps-taxes-vs-your-taxes-calculator',
): string {
  const lines = [
    "Trump's Taxes vs. Your Taxes Calculator | Omega Calculators",
    '',
    `Your example tax: $${result.formattedUserTax}`,
    `Trump’s reported historical tax (illustrative): $${result.formattedTrumpTax}`,
    `Ratio: ${result.formattedRatio}×`,
    `Difference: $${result.formattedDifference}`,
    `Percentage difference vs Trump figure: ${result.formattedPercentageDifference}%`,
    result.ratioLabel,
    '',
    'Historical note: The $750 figure refers to publicly reported federal income tax for 2016/2017, not an established 2019 liability.',
    'Comparison item prices are illustrative assumptions, not verified retail prices.',
    '',
    path,
  ];
  return lines.join('\n');
}
