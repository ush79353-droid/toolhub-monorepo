import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CapitalGainsYieldResult } from './types';

function formatPlainMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatYieldPercent(percent: number): string {
  const rounded = Math.round(percent * 10000) / 10000;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * Capital Gains = Current Price − Bought Price
 * Capital Gains Yield (%) = (Capital Gains / Bought Price) × 100
 */
export function calculateCapitalGainsYield(
  boughtPrice: number,
  currentPrice: number,
  currency: SupportedCurrency
): CapitalGainsYieldResult | null {
  if (!Number.isFinite(boughtPrice) || !Number.isFinite(currentPrice)) return null;
  if (!(boughtPrice > 0)) return null;
  if (currentPrice < 0) return null;

  const capitalGains = currentPrice - boughtPrice;
  if (!Number.isFinite(capitalGains)) return null;

  const capitalGainsYieldPercent = (capitalGains / boughtPrice) * 100;
  if (!Number.isFinite(capitalGainsYieldPercent)) return null;

  return {
    boughtPrice,
    currentPrice,
    capitalGains,
    capitalGainsYieldPercent,
    currency,
    formattedCapitalGains: formatPlainMoney(capitalGains, currency),
    formattedYieldPercent: formatYieldPercent(capitalGainsYieldPercent),
  };
}
