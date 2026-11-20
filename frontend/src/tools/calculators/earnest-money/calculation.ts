import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * EM = PP × (P / 100)
 * Zero property price or zero percent → earnest money 0.
 */
export function calculateEarnestMoney(
  propertyPrice: number,
  percentage: number
): number | null {
  if (
    !Number.isFinite(propertyPrice) ||
    !Number.isFinite(percentage) ||
    propertyPrice < 0 ||
    percentage < 0 ||
    percentage > 100
  ) {
    return null;
  }
  const amount = propertyPrice * (percentage / 100);
  return Number.isFinite(amount) ? amount : null;
}

/**
 * P = (EM / PP) × 100
 * Property price must be > 0.
 */
export function calculateEarnestMoneyPercentage(
  earnestMoney: number,
  propertyPrice: number
): number | null {
  if (
    !Number.isFinite(earnestMoney) ||
    !Number.isFinite(propertyPrice) ||
    earnestMoney < 0 ||
    propertyPrice <= 0
  ) {
    return null;
  }
  const pct = (earnestMoney / propertyPrice) * 100;
  return Number.isFinite(pct) ? pct : null;
}

/**
 * PP = EM / (P / 100)
 * Percentage must be > 0.
 */
export function calculatePropertyPriceFromEarnestMoney(
  earnestMoney: number,
  percentage: number
): number | null {
  if (
    !Number.isFinite(earnestMoney) ||
    !Number.isFinite(percentage) ||
    earnestMoney < 0 ||
    percentage <= 0 ||
    percentage > 100
  ) {
    return null;
  }
  const price = earnestMoney / (percentage / 100);
  return Number.isFinite(price) ? price : null;
}

export function formatEarnestMoneyMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatEarnestMoneyPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
