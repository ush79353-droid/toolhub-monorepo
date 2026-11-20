import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface PriceToBookMathInput {
  totalStockholderEquity: number;
  preferredEquity: number;
  commonSharesOutstanding: number;
  sharePrice: number;
  goodwill: number;
  otherIntangibleAssets: number;
  includeTangible: boolean;
}

export interface PriceToBookMathResult {
  commonBookEquity: number;
  bookValuePerShare: number;
  priceToBookRatio: number | null;
  tangibleCommonEquity: number | null;
  tangibleBookValuePerShare: number | null;
  priceToTangibleBookRatio: number | null;
}

/**
 * Common equity = Total equity − Preferred
 * BVPS = Common equity / Shares
 * P/B = Price / BVPS when BVPS > 0
 * Tangible equity = Common − Goodwill − Other intangibles
 * TBVPS / P/TBV similarly when TBVPS > 0
 */
export function calculatePriceToBook(
  input: PriceToBookMathInput
): PriceToBookMathResult | null {
  const {
    totalStockholderEquity,
    preferredEquity,
    commonSharesOutstanding,
    sharePrice,
    goodwill,
    otherIntangibleAssets,
    includeTangible,
  } = input;

  if (!Number.isFinite(totalStockholderEquity)) return null;
  if (!Number.isFinite(preferredEquity) || preferredEquity < 0) return null;
  if (
    !Number.isFinite(commonSharesOutstanding) ||
    commonSharesOutstanding <= 0
  ) {
    return null;
  }
  if (!Number.isFinite(sharePrice) || sharePrice < 0) return null;

  const commonBookEquity = totalStockholderEquity - preferredEquity;
  if (!Number.isFinite(commonBookEquity)) return null;

  const bookValuePerShare = commonBookEquity / commonSharesOutstanding;
  if (!Number.isFinite(bookValuePerShare)) return null;

  let priceToBookRatio: number | null = null;
  if (bookValuePerShare > 0) {
    priceToBookRatio = sharePrice / bookValuePerShare;
    if (!Number.isFinite(priceToBookRatio)) return null;
  }

  let tangibleCommonEquity: number | null = null;
  let tangibleBookValuePerShare: number | null = null;
  let priceToTangibleBookRatio: number | null = null;

  if (includeTangible) {
    if (!Number.isFinite(goodwill) || goodwill < 0) return null;
    if (
      !Number.isFinite(otherIntangibleAssets) ||
      otherIntangibleAssets < 0
    ) {
      return null;
    }
    tangibleCommonEquity =
      commonBookEquity - goodwill - otherIntangibleAssets;
    if (!Number.isFinite(tangibleCommonEquity)) return null;

    tangibleBookValuePerShare =
      tangibleCommonEquity / commonSharesOutstanding;
    if (!Number.isFinite(tangibleBookValuePerShare)) return null;

    if (tangibleBookValuePerShare > 0) {
      priceToTangibleBookRatio = sharePrice / tangibleBookValuePerShare;
      if (!Number.isFinite(priceToTangibleBookRatio)) return null;
    }
  }

  return {
    commonBookEquity,
    bookValuePerShare,
    priceToBookRatio,
    tangibleCommonEquity,
    tangibleBookValuePerShare,
    priceToTangibleBookRatio,
  };
}

export function formatPbMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRatio(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function interpretPbRatio(pb: number): string {
  if (pb < 1) {
    return `P/B ratio ${formatRatio(pb)}× — the market price is below reported book value per common share. That may indicate a valuation discount, but it does not automatically mean the stock is undervalued.`;
  }
  if (Math.abs(pb - 1) < 1e-9) {
    return 'P/B ratio 1.00× — the market price is approximately equal to reported book value per common share.';
  }
  return `P/B ratio ${formatRatio(pb)}× — the market values common shares at about ${formatRatio(pb)} times reported book value. Interpretation depends on industry, profitability, and asset quality.`;
}
