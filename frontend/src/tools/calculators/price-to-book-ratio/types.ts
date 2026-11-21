import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PriceToBookInput {
  totalStockholderEquity: string;
  preferredEquity: string;
  commonSharesOutstanding: string;
  sharePrice: string;
  goodwill: string;
  otherIntangibleAssets: string;
  showTangible: boolean;
  currency: SupportedCurrency;
}

export interface PriceToBookResult {
  commonBookEquity: number;
  bookValuePerShare: number;
  priceToBookRatio: number | null;
  tangibleCommonEquity: number | null;
  tangibleBookValuePerShare: number | null;
  priceToTangibleBookRatio: number | null;
  currency: SupportedCurrency;
  formattedCommonBookEquity: string;
  formattedBvps: string;
  formattedPb: string | null;
  formattedTangibleEquity: string | null;
  formattedTbvps: string | null;
  formattedPtb: string | null;
  pbUnavailableReason: string | null;
  ptbUnavailableReason: string | null;
  interpretation: string | null;
  warningMessage: string | null;
}

export type PriceToBookFieldErrors = {
  form?: string;
  totalStockholderEquity?: string;
  preferredEquity?: string;
  commonSharesOutstanding?: string;
  sharePrice?: string;
  goodwill?: string;
  otherIntangibleAssets?: string;
};

/**
 * Reference:
 * Equity 500,000 − Pref 50,000 → Common 450,000
 * Shares 10,000 → BVPS 45 · Price 90 → P/B 2.00×
 * Goodwill 60k + Intangibles 40k → Tangible 350k · TBVPS 35 · P/TBV ≈ 2.57×
 */
export function createDefaultInput(): PriceToBookInput {
  return {
    totalStockholderEquity: '500000',
    preferredEquity: '50000',
    commonSharesOutstanding: '10000',
    sharePrice: '90',
    goodwill: '60000',
    otherIntangibleAssets: '40000',
    showTangible: false,
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): PriceToBookInput {
  return {
    totalStockholderEquity: '',
    preferredEquity: '0',
    commonSharesOutstanding: '',
    sharePrice: '',
    goodwill: '0',
    otherIntangibleAssets: '0',
    showTangible: false,
    currency,
  };
}
