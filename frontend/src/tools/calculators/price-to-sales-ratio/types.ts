import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PriceToSalesInput {
  /** Total sales / revenue for the period. */
  sales: string;
  salesCurrency: SupportedCurrency;
  /** Shares outstanding for the same period (never FX-converted). */
  sharesOutstanding: string;
  /** Independent display currency for sales per share. */
  salesPerShareCurrency: SupportedCurrency;
  /** Current price per share. */
  pricePerShare: string;
  pricePerShareCurrency: SupportedCurrency;
  revenuePerShareOpen: boolean;
  priceToSalesOpen: boolean;
}

export interface PriceToSalesResult {
  /** Full-precision SPS in the sales currency (valuation currency). */
  salesPerShareInSalesCurrency: number;
  /** SPS converted into the SPS display currency. */
  salesPerShare: number;
  /**
   * P/S ratio (dimensionless). Null when SPS is zero (undefined) or price
   * is not ready for a ratio.
   */
  priceToSalesRatio: number | null;
  /** True when SPS is exactly zero so P/S is undefined (not Infinity). */
  ratioUndefined: boolean;
  salesCurrency: SupportedCurrency;
  salesPerShareCurrency: SupportedCurrency;
  pricePerShareCurrency: SupportedCurrency;
  formattedSalesPerShare: string;
  formattedPriceToSalesRatio: string | null;
  /** Short note when P/S is negative. */
  negativeRatioNote: string | null;
}

export type PriceToSalesFieldErrors = {
  sales?: string;
  sharesOutstanding?: string;
  pricePerShare?: string;
  form?: string;
};

export function createDefaultInput(): PriceToSalesInput {
  return {
    sales: '',
    salesCurrency: 'PKR',
    sharesOutstanding: '',
    salesPerShareCurrency: 'PKR',
    pricePerShare: '',
    pricePerShareCurrency: 'PKR',
    revenuePerShareOpen: true,
    priceToSalesOpen: true,
  };
}
