import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Gross Profit = Revenue − COGS
 * Gross Margin (%) = (Gross Profit / Revenue) × 100
 * Amounts must already share one currency. Full IEEE precision; never NaN/Infinity.
 * Negative profit and margin are allowed when mathematically valid.
 */
export function calculateGrossMargin(input: {
  revenue: number;
  cogs: number;
}): { grossProfit: number; marginPercent: number } | null {
  const { revenue, cogs } = input;
  if (![revenue, cogs].every(Number.isFinite)) return null;
  if (!(revenue !== 0)) return null;

  const grossProfit = revenue - cogs;
  if (!Number.isFinite(grossProfit)) return null;

  const marginPercent = (grossProfit / revenue) * 100;
  if (!Number.isFinite(marginPercent)) return null;

  return { grossProfit, marginPercent };
}

export function formatGrossMarginMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatGrossMarginPercent(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent);
}
