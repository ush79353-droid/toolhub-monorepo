import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Gift of Equity = Market Value − Sales Price.
 * Negative results are returned as-is (not clamped).
 */
export function calculateGiftOfEquity(
  marketValue: number,
  salesPrice: number
): number | null {
  if (
    !Number.isFinite(marketValue) ||
    !Number.isFinite(salesPrice) ||
    marketValue < 0 ||
    salesPrice < 0
  ) {
    return null;
  }
  const gift = marketValue - salesPrice;
  return Number.isFinite(gift) ? gift : null;
}

/** Sales Price = Market Value − Gift of Equity */
export function calculateSalesPriceFromGift(
  marketValue: number,
  giftOfEquity: number
): number | null {
  if (
    !Number.isFinite(marketValue) ||
    !Number.isFinite(giftOfEquity) ||
    marketValue < 0
  ) {
    return null;
  }
  const salesPrice = marketValue - giftOfEquity;
  return Number.isFinite(salesPrice) ? salesPrice : null;
}

/** Market Value = Sales Price + Gift of Equity */
export function calculateMarketValueFromGift(
  salesPrice: number,
  giftOfEquity: number
): number | null {
  if (
    !Number.isFinite(salesPrice) ||
    !Number.isFinite(giftOfEquity) ||
    salesPrice < 0
  ) {
    return null;
  }
  const marketValue = salesPrice + giftOfEquity;
  return Number.isFinite(marketValue) ? marketValue : null;
}

export function formatGiftOfEquityMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
