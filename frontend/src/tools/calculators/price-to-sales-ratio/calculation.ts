import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatPriceSalesMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for the dimensionless P/S multiple (not used in math). */
export function formatPriceToSalesRatio(ratio: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(ratio);
}

/**
 * Sales per Share = Sales / Shares Outstanding
 * Price to Sales = Price per Share / Sales per Share
 *
 * Inputs must already be in one common currency. Returns full-precision values.
 * When SPS is exactly 0, ratio is undefined (not Infinity).
 * Zero price (zero market cap) is valid → ratio 0 when SPS > 0.
 * Negative sales is rejected by callers; nonnegative price required for ratio.
 */
export function calculatePriceToSales(input: {
  sales: number;
  sharesOutstanding: number;
  pricePerShare?: number | null;
}): {
  salesPerShare: number;
  priceToSalesRatio: number | null;
  ratioUndefined: boolean;
} | null {
  const { sales, sharesOutstanding, pricePerShare } = input;

  if (![sales, sharesOutstanding].every(Number.isFinite)) {
    return null;
  }
  if (!(sharesOutstanding > 0)) {
    return null;
  }
  if (!(sales >= 0)) {
    return null;
  }

  const salesPerShare = sales / sharesOutstanding;
  if (!Number.isFinite(salesPerShare)) {
    return null;
  }

  if (salesPerShare === 0) {
    return {
      salesPerShare,
      priceToSalesRatio: null,
      ratioUndefined: true,
    };
  }

  if (pricePerShare === undefined || pricePerShare === null) {
    return {
      salesPerShare,
      priceToSalesRatio: null,
      ratioUndefined: false,
    };
  }

  if (!Number.isFinite(pricePerShare) || pricePerShare < 0) {
    return null;
  }

  const priceToSalesRatio = pricePerShare / salesPerShare;
  if (!Number.isFinite(priceToSalesRatio)) {
    return null;
  }

  return {
    salesPerShare,
    priceToSalesRatio,
    ratioUndefined: false,
  };
}
