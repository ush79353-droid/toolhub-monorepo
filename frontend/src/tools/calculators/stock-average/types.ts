import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Screenshot-first Stock Average Calculator inputs.
 * Buy prices and optional current market price are per-share money (independent FX).
 * Share quantities are never FX-converted. Only two purchase rows (screenshot).
 */
export interface StockAverageInput {
  /** Optional current market price per share. */
  currentPrice: string;
  currentPriceCurrency: SupportedCurrency;
  firstBuyShares: string;
  firstBuyPrice: string;
  firstBuyPriceCurrency: SupportedCurrency;
  secondBuyShares: string;
  secondBuyPrice: string;
  secondBuyPriceCurrency: SupportedCurrency;
  /** Collapsible purchase-history section (open by default per screenshot). */
  purchasesOpen: boolean;
}

export interface StockAverageResult {
  totalShares: number;
  /** Full-precision totals in first-buy-price currency. */
  totalCostCanonical: number;
  averagePriceCanonical: number;
  /** Present only when current market price was supplied. */
  marketValueCanonical: number | null;
  profitLossCanonical: number | null;
  /** Undefined when total cost is zero (division by zero). */
  returnPercent: number | null;
  resultCurrency: SupportedCurrency;
  formattedTotalShares: string;
  formattedTotalCost: string;
  formattedAveragePrice: string;
  formattedMarketValue: string | null;
  formattedProfitLoss: string | null;
  formattedReturnPercent: string | null;
}

export type StockAverageFieldErrors = {
  currentPrice?: string;
  firstBuyShares?: string;
  firstBuyPrice?: string;
  secondBuyShares?: string;
  secondBuyPrice?: string;
  form?: string;
};

export function createDefaultInput(): StockAverageInput {
  return {
    currentPrice: '',
    currentPriceCurrency: 'PKR',
    firstBuyShares: '',
    firstBuyPrice: '',
    firstBuyPriceCurrency: 'PKR',
    secondBuyShares: '',
    secondBuyPrice: '',
    secondBuyPriceCurrency: 'PKR',
    purchasesOpen: true,
  };
}
