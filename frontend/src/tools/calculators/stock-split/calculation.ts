import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * A-for-B stock split (forward or reverse):
 *   New Shares = Original Shares × A / B
 *   New Share Price = Original Share Price × B / A
 *   Portfolio Before = Original Shares × Original Share Price
 *   Portfolio After = New Shares × New Share Price
 *
 * Requires positive shares, nonnegative price, and positive A and B.
 * Keeps fractional shares mathematically. Returns full precision.
 * Rejects non-finite inputs and division by zero.
 */
export function calculateStockSplit(input: {
  sharesBefore: number;
  sharePriceBefore: number;
  ratioA: number;
  ratioB: number;
}): {
  sharesAfter: number;
  sharePriceAfter: number;
  portfolioValueBefore: number;
  portfolioValueAfter: number;
  isForwardSplit: boolean;
  isReverseSplit: boolean;
} | null {
  const { sharesBefore, sharePriceBefore, ratioA, ratioB } = input;
  if (
    ![sharesBefore, sharePriceBefore, ratioA, ratioB].every(Number.isFinite)
  ) {
    return null;
  }
  if (sharesBefore <= 0) return null;
  if (sharePriceBefore < 0) return null;
  if (ratioA <= 0 || ratioB <= 0) return null;

  const sharesAfter = (sharesBefore * ratioA) / ratioB;
  const sharePriceAfter = (sharePriceBefore * ratioB) / ratioA;
  const portfolioValueBefore = sharesBefore * sharePriceBefore;
  const portfolioValueAfter = sharesAfter * sharePriceAfter;

  if (
    ![
      sharesAfter,
      sharePriceAfter,
      portfolioValueBefore,
      portfolioValueAfter,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (sharesAfter < 0 || sharePriceAfter < 0) return null;

  return {
    sharesAfter,
    sharePriceAfter,
    portfolioValueBefore,
    portfolioValueAfter,
    isForwardSplit: ratioA > ratioB,
    isReverseSplit: ratioA < ratioB,
  };
}

/** Display rounding for money — never used inside the formulas. */
export function formatStockSplitMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for share counts (allows fractions). */
export function formatShareCount(shares: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(shares);
}
