import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Weighted stock average (two purchases):
 *   Total Shares = Q1 + Q2
 *   Total Cost = Q1×P1 + Q2×P2
 *   Average Purchase Price = Total Cost / Total Shares
 *
 * Optional current market price M:
 *   Market Value = Total Shares × M
 *   Unrealized P/L = Market Value − Total Cost
 *   Return (%) = P/L / Total Cost × 100  (undefined when Total Cost = 0)
 *
 * Prices and market price must already be in one currency.
 * Share quantities must be > 0; prices ≥ 0. Full precision; round only for display.
 */
export function calculateStockAverage(input: {
  firstBuyShares: number;
  firstBuyPrice: number;
  secondBuyShares: number;
  secondBuyPrice: number;
  currentPrice: number | null;
}): {
  totalShares: number;
  totalCost: number;
  averagePrice: number;
  marketValue: number | null;
  profitLoss: number | null;
  returnPercent: number | null;
} | null {
  const {
    firstBuyShares,
    firstBuyPrice,
    secondBuyShares,
    secondBuyPrice,
    currentPrice,
  } = input;

  if (
    ![firstBuyShares, firstBuyPrice, secondBuyShares, secondBuyPrice].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (currentPrice !== null && !Number.isFinite(currentPrice)) return null;

  if (firstBuyShares <= 0 || secondBuyShares <= 0) return null;
  if (firstBuyPrice < 0 || secondBuyPrice < 0) return null;
  if (currentPrice !== null && currentPrice < 0) return null;

  const totalShares = firstBuyShares + secondBuyShares;
  const totalCost =
    firstBuyShares * firstBuyPrice + secondBuyShares * secondBuyPrice;
  if (!(totalShares > 0) || !Number.isFinite(totalCost)) return null;

  const averagePrice = totalCost / totalShares;
  if (!Number.isFinite(averagePrice)) return null;

  let marketValue: number | null = null;
  let profitLoss: number | null = null;
  let returnPercent: number | null = null;

  if (currentPrice !== null) {
    marketValue = totalShares * currentPrice;
    if (!Number.isFinite(marketValue)) return null;
    profitLoss = marketValue - totalCost;
    if (!Number.isFinite(profitLoss)) return null;
    if (totalCost !== 0) {
      returnPercent = (profitLoss / totalCost) * 100;
      if (!Number.isFinite(returnPercent)) return null;
    }
  }

  return {
    totalShares,
    totalCost,
    averagePrice,
    marketValue,
    profitLoss,
    returnPercent,
  };
}

/** Display rounding only — never used inside the formulas. */
export function formatStockAverageMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatStockAverageShares(shares: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(shares);
}

/** Display rounding for return % (never FX-converted). */
export function formatStockAveragePercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(percent);
}
