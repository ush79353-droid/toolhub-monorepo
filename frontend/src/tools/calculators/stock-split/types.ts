import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Screenshot-first Stock Split Calculator inputs.
 * Share prices keep independent input/output currencies (Phase 2 FX).
 * Share counts and A-for-B ratio values are never FX-converted.
 */
export interface StockSplitInput {
  /** Shares owned before the split. */
  sharesBefore: string;
  /** Per-share price before the split. */
  sharePriceBefore: string;
  sharePriceBeforeCurrency: SupportedCurrency;
  /** A in “A-for-B” (new shares received per B old shares). */
  ratioA: string;
  /** B in “A-for-B” (old shares exchanged). */
  ratioB: string;
  /** Independent display currency for the post-split share price. */
  sharePriceAfterCurrency: SupportedCurrency;
  /** Independent display currency for portfolio value before/after. */
  portfolioValueCurrency: SupportedCurrency;
}

export interface StockSplitResult {
  /** Full-precision post-split share count (may be fractional). */
  sharesAfter: number;
  /** Full-precision post-split price in the before-price currency. */
  sharePriceAfterCanonical: number;
  /** Portfolio value before split in before-price currency. */
  portfolioValueBeforeCanonical: number;
  /** Portfolio value after split in before-price currency (theoretically equal). */
  portfolioValueAfterCanonical: number;
  /** Post-split price after FX into sharePriceAfterCurrency. */
  sharePriceAfter: number;
  /** Portfolio values after FX into portfolioValueCurrency. */
  portfolioValueBefore: number;
  portfolioValueAfter: number;
  sharePriceBeforeCurrency: SupportedCurrency;
  sharePriceAfterCurrency: SupportedCurrency;
  portfolioValueCurrency: SupportedCurrency;
  /** True when A > B (forward); false when A < B (reverse); A === B is 1-for-1. */
  isForwardSplit: boolean;
  isReverseSplit: boolean;
  formattedSharesAfter: string;
  formattedSharePriceAfter: string;
  formattedPortfolioValueBefore: string;
  formattedPortfolioValueAfter: string;
}

export type StockSplitFieldErrors = {
  sharesBefore?: string;
  sharePriceBefore?: string;
  ratioA?: string;
  ratioB?: string;
  form?: string;
};

export function createDefaultInput(): StockSplitInput {
  return {
    sharesBefore: '',
    sharePriceBefore: '',
    sharePriceBeforeCurrency: 'PKR',
    ratioA: '2',
    ratioB: '1',
    sharePriceAfterCurrency: 'PKR',
    portfolioValueCurrency: 'PKR',
  };
}
