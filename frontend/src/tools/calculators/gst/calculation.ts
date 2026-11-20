/**
 * Generic GST (rate-based). Gross = GST-inclusive; Net = GST-exclusive.
 *
 * From net: Gross = Net × (1 + r/100); Tax = Gross − Net
 * From gross: Net = Gross / (1 + r/100); Tax = Gross − Net
 *
 * Amounts must already share one currency. Round only for display.
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Sensible UI upper bound — not a jurisdiction max. */
export const GST_PERCENT_MAX = 1000;

export function formatGstMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatGstPercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(rate);
}

export interface GstComputation {
  netPrice: number;
  grossPrice: number;
  taxAmount: number;
}

export function calculateFromNet(
  netPrice: number,
  gstPercent: number
): GstComputation | null {
  if (![netPrice, gstPercent].every(Number.isFinite)) return null;
  if (netPrice < 0) return null;
  if (gstPercent < 0 || gstPercent > GST_PERCENT_MAX) return null;
  const taxAmount = netPrice * (gstPercent / 100);
  const grossPrice = netPrice + taxAmount;
  if (![taxAmount, grossPrice].every(Number.isFinite)) return null;
  return { netPrice, grossPrice, taxAmount };
}

export function calculateFromGross(
  grossPrice: number,
  gstPercent: number
): GstComputation | null {
  if (![grossPrice, gstPercent].every(Number.isFinite)) return null;
  if (grossPrice < 0) return null;
  if (gstPercent < 0 || gstPercent > GST_PERCENT_MAX) return null;
  const denom = 1 + gstPercent / 100;
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const netPrice = grossPrice / denom;
  const taxAmount = grossPrice - netPrice;
  if (![netPrice, taxAmount].every(Number.isFinite)) return null;
  return { netPrice, grossPrice, taxAmount };
}
