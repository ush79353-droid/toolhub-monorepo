import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface MarketCapMathInput {
  sharePrice: number;
  outstandingShares: number;
}

export interface MarketCapMathResult {
  marketCapitalization: number;
}

/**
 * Market Cap = Share Price × Outstanding Shares
 */
export function calculateMarketCapitalization(
  input: MarketCapMathInput
): MarketCapMathResult | null {
  const { sharePrice, outstandingShares } = input;

  if (!Number.isFinite(sharePrice) || sharePrice < 0) return null;
  if (!Number.isSafeInteger(outstandingShares) || outstandingShares <= 0) {
    return null;
  }

  const marketCapitalization = sharePrice * outstandingShares;
  if (!Number.isFinite(marketCapitalization)) return null;

  return { marketCapitalization };
}

export function formatMarketCapMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatShareCount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

/** Compact notation: 1.25B, 30M, etc. (locale-aware). */
export function formatCompactMarketCap(
  amount: number,
  currency: SupportedCurrency
): string {
  const abs = Math.abs(amount);
  if (abs < 1000) {
    return formatMarketCapMoney(amount, currency);
  }
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: abs >= 1_000_000_000 ? 2 : abs >= 1_000_000 ? 2 : 1,
  }).format(amount);
}

export function interpretMarketCap(
  marketCap: number,
  symbol: string,
  currency: SupportedCurrency
): string {
  const full = `${symbol}${formatMarketCapMoney(marketCap, currency)}`;
  const compact = `${symbol}${formatCompactMarketCap(marketCap, currency)}`;
  if (marketCap === 0) {
    return `Market capitalization is ${full}. A zero share price yields zero equity market value under this formula.`;
  }
  if (compact !== full && !compact.includes(',')) {
    return `Market capitalization is ${full} (about ${compact}). This is equity market value: share price × outstanding shares.`;
  }
  return `Market capitalization is ${full}. This is equity market value: share price × outstanding shares.`;
}
