/**
 * Gross↔net with tax deducted as a percentage of gross (not VAT-added).
 *
 * Gross → Net: Tax = Gross × r/100; Net = Gross − Tax
 * Net → Gross: Gross = Net / (1 − r/100); Tax = Gross − Net
 *
 * Amounts must already share one currency. Round only for display.
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatGrossToNetMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatGrossToNetPercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(rate);
}

export interface GrossToNetComputation {
  grossAmount: number;
  netAmount: number;
  taxAmount: number;
}

/** Tax deducted from gross. Rate in [0, 100]. */
export function calculateGrossToNet(
  grossAmount: number,
  taxRatePercent: number
): GrossToNetComputation | null {
  if (![grossAmount, taxRatePercent].every(Number.isFinite)) return null;
  if (grossAmount < 0) return null;
  if (!(taxRatePercent >= 0 && taxRatePercent <= 100)) return null;
  const taxAmount = grossAmount * (taxRatePercent / 100);
  const netAmount = grossAmount - taxAmount;
  if (![taxAmount, netAmount].every(Number.isFinite)) return null;
  if (netAmount < 0) return null;
  return { grossAmount, netAmount, taxAmount };
}

/**
 * Reverse: find gross from net when tax is r% of gross.
 * Requires 0 ≤ r < 100. r = 100 with net ≠ 0 is impossible; net = 0 & r = 100 is indeterminate.
 */
export function calculateNetToGross(
  netAmount: number,
  taxRatePercent: number
): GrossToNetComputation | null {
  if (![netAmount, taxRatePercent].every(Number.isFinite)) return null;
  if (netAmount < 0) return null;
  if (!(taxRatePercent >= 0 && taxRatePercent < 100)) return null;
  const denom = 1 - taxRatePercent / 100;
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const grossAmount = netAmount / denom;
  const taxAmount = grossAmount - netAmount;
  if (![grossAmount, taxAmount].every(Number.isFinite)) return null;
  if (grossAmount < 0 || taxAmount < 0) return null;
  return { grossAmount, netAmount, taxAmount };
}
