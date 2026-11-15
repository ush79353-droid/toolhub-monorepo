import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  DirectMaterialPriceVarianceResult,
  VarianceStatus,
} from './types';

/**
 * Price Variance = (Actual Rate − Standard Rate) × Quantity
 * Positive = Unfavorable, Negative = Favorable, Zero = No variance
 */
export function calculatePriceVariance(
  standardRate: number,
  actualRate: number,
  quantity: number
): number {
  return (actualRate - standardRate) * quantity;
}

export function varianceStatus(variance: number): VarianceStatus {
  if (!Number.isFinite(variance) || variance === 0) return 'none';
  return variance > 0 ? 'unfavorable' : 'favorable';
}

export function formatVarianceAmount(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildDirectMaterialPriceVarianceResult(
  standardRate: number,
  actualRate: number,
  quantity: number,
  currency: SupportedCurrency
): DirectMaterialPriceVarianceResult | null {
  if (
    !Number.isFinite(standardRate) ||
    !Number.isFinite(actualRate) ||
    !Number.isFinite(quantity)
  ) {
    return null;
  }
  if (standardRate < 0 || actualRate < 0 || quantity < 0) return null;

  const variance = calculatePriceVariance(standardRate, actualRate, quantity);
  if (!Number.isFinite(variance)) return null;

  return {
    standardRate,
    actualRate,
    quantity,
    variance,
    status: varianceStatus(variance),
    currency,
    varianceDisplay: formatVarianceAmount(variance, currency),
  };
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function statusLabel(status: VarianceStatus): string {
  if (status === 'favorable') return 'Favorable';
  if (status === 'unfavorable') return 'Unfavorable';
  return 'No variance';
}
