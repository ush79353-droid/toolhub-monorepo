import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MovingAverageResult } from './types';

/**
 * Simple moving average of the latest N prices.
 * SMA = sum(latest N) / N
 */
export function calculateSma(prices: number[], length: number): number | null {
  if (!Number.isInteger(length) || length < 2) return null;
  if (!Array.isArray(prices) || prices.length < length) return null;
  if (prices.some((p) => !Number.isFinite(p) || p < 0)) return null;

  const window = prices.slice(-length);
  let sum = 0;
  for (const price of window) {
    sum += price;
  }
  const sma = sum / length;
  return Number.isFinite(sma) ? sma : null;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildMovingAverageResult(
  prices: number[],
  length: number,
  currency: SupportedCurrency
): MovingAverageResult | null {
  const sma = calculateSma(prices, length);
  if (sma === null) return null;
  return {
    sma,
    smaDisplay: formatMoney(sma, currency),
    usedPrices: prices.slice(-length),
    currency,
  };
}
