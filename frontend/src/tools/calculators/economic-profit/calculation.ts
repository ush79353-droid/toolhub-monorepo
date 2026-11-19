import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Display rounding only — never used inside the formula. */
export function formatEconomicProfitMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Economic Profit = Total Revenue − Explicit Costs − Implicit Costs
 *
 * Amounts must already share one currency. Explicit costs are direct monetary
 * expenses; implicit costs are opportunity costs. Negative profit (loss) is valid.
 * Full precision — round only for display.
 */
export function calculateEconomicProfit(input: {
  totalRevenue: number;
  explicitCosts: number;
  implicitCosts: number;
}): number | null {
  const { totalRevenue, explicitCosts, implicitCosts } = input;
  if (![totalRevenue, explicitCosts, implicitCosts].every(Number.isFinite)) {
    return null;
  }
  if (totalRevenue < 0 || explicitCosts < 0 || implicitCosts < 0) return null;

  const profit = totalRevenue - explicitCosts - implicitCosts;
  return Number.isFinite(profit) ? profit : null;
}
