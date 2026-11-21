import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatMarginSalesTaxMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMarginSalesTaxPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(value);
}

export interface MarginAndSalesTaxCanonicalInput {
  cost: number;
  markupPercent: number;
  salesTaxPercent: number;
}

export interface MarginAndSalesTaxCanonicalResult {
  cost: number;
  markupPercent: number;
  salesTaxPercent: number;
  netPrice: number;
  profit: number;
  /** null when net price is zero (margin undefined). */
  marginPercent: number | null;
  grossPrice: number;
  salesTaxAmount: number;
}

/**
 * Net = Cost × (1 + Markup%/100)
 * Profit = Net − Cost
 * Margin% = Profit / Net × 100 (null when Net = 0)
 * Gross = Net × (1 + SalesTax%/100)
 * Sales tax amount is Gross − Net and is not profit.
 */
export function calculateMarginAndSalesTax(
  input: MarginAndSalesTaxCanonicalInput
): MarginAndSalesTaxCanonicalResult | null {
  const { cost, markupPercent, salesTaxPercent } = input;
  if (![cost, markupPercent, salesTaxPercent].every(Number.isFinite)) {
    return null;
  }
  if (cost < 0 || salesTaxPercent < 0) return null;
  if (markupPercent < -100) return null;

  const netPrice = cost * (1 + markupPercent / 100);
  if (!Number.isFinite(netPrice)) return null;

  const profit = netPrice - cost;
  if (!Number.isFinite(profit)) return null;

  const marginPercent =
    netPrice === 0 ? null : (profit / netPrice) * 100;
  if (marginPercent !== null && !Number.isFinite(marginPercent)) return null;

  const grossPrice = netPrice * (1 + salesTaxPercent / 100);
  if (!Number.isFinite(grossPrice)) return null;

  const salesTaxAmount = grossPrice - netPrice;
  if (!Number.isFinite(salesTaxAmount)) return null;

  return {
    cost,
    markupPercent,
    salesTaxPercent,
    netPrice,
    profit,
    marginPercent,
    grossPrice,
    salesTaxAmount,
  };
}
