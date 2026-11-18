import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Operating Income = Revenue − COGS − Operating Expenses
 * Operating Margin (%) = (Operating Income / Revenue) × 100
 * Amounts must already share one currency. Full IEEE precision; never NaN/Infinity.
 * Negative income and margin are allowed when mathematically valid.
 */
export function calculateOperatingMargin(input: {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
}): { operatingIncome: number; marginPercent: number } | null {
  const { revenue, cogs, operatingExpenses } = input;
  if (![revenue, cogs, operatingExpenses].every(Number.isFinite)) return null;
  if (!(revenue !== 0)) return null;

  const operatingIncome = revenue - cogs - operatingExpenses;
  if (!Number.isFinite(operatingIncome)) return null;

  const marginPercent = (operatingIncome / revenue) * 100;
  if (!Number.isFinite(marginPercent)) return null;

  return { operatingIncome, marginPercent };
}

export function formatOperatingMarginMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatOperatingMarginPercent(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent);
}
