import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { AverageFixedCostResult } from './types';

/**
 * Average Fixed Cost = Total Fixed Cost / Number of Units
 * Units must be greater than zero. Negative costs are rejected upstream.
 */
export function calculateAverageFixedCost(
  totalFixedCost: number,
  numberOfUnits: number
): number {
  if (
    !Number.isFinite(totalFixedCost) ||
    !Number.isFinite(numberOfUnits) ||
    numberOfUnits <= 0
  ) {
    return Number.NaN;
  }
  const average = totalFixedCost / numberOfUnits;
  return Number.isFinite(average) ? average : Number.NaN;
}

/** Plain amount for the inline result field (symbol comes from CurrencySelect / affix). */
export function formatAverageAmount(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildAverageFixedCostResult(
  totalFixedCost: number,
  numberOfUnits: number,
  currency: SupportedCurrency
): AverageFixedCostResult | null {
  const averageFixedCost = calculateAverageFixedCost(totalFixedCost, numberOfUnits);
  if (!Number.isFinite(averageFixedCost)) return null;

  return {
    totalFixedCost,
    numberOfUnits,
    averageFixedCost,
    currency,
    formattedAverage: formatAverageAmount(averageFixedCost, currency),
    shareAverage: formatCurrencyValue(averageFixedCost, currency),
  };
}
