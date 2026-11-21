/**
 * Generic sales tax (rate-based, not jurisdiction ZIP).
 *
 * From net: Tax = Net × rate/100; Gross = Net + Tax
 * From gross: Net = Gross / (1 + rate/100); Tax = Gross − Net
 *
 * Amounts must already share one currency. Round only for display.
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatSalesTaxMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatSalesTaxPercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(rate);
}

export interface SalesTaxComputation {
  netPrice: number;
  grossPrice: number;
  taxAmount: number;
}

/** Tax-exclusive: Gross = Net × (1 + rate/100). Rate must be > −100. */
export function calculateFromNet(
  netPrice: number,
  salesTaxPercent: number
): SalesTaxComputation | null {
  if (![netPrice, salesTaxPercent].every(Number.isFinite)) return null;
  if (netPrice < 0) return null;
  if (!(salesTaxPercent > -100)) return null;
  const taxAmount = netPrice * (salesTaxPercent / 100);
  const grossPrice = netPrice + taxAmount;
  if (![taxAmount, grossPrice].every(Number.isFinite)) return null;
  return { netPrice, grossPrice, taxAmount };
}

/** Tax-inclusive: Net = Gross / (1 + rate/100). */
export function calculateFromGross(
  grossPrice: number,
  salesTaxPercent: number
): SalesTaxComputation | null {
  if (![grossPrice, salesTaxPercent].every(Number.isFinite)) return null;
  if (grossPrice < 0) return null;
  if (!(salesTaxPercent > -100)) return null;
  const denom = 1 + salesTaxPercent / 100;
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const netPrice = grossPrice / denom;
  const taxAmount = grossPrice - netPrice;
  if (![netPrice, taxAmount].every(Number.isFinite)) return null;
  return { netPrice, grossPrice, taxAmount };
}
