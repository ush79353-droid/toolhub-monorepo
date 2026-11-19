import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PriceToCashFlowInput {
  /** Total operating cash flow for the period. */
  cashFlow: string;
  cashFlowCurrency: SupportedCurrency;
  /** Shares outstanding for the same period (never FX-converted). */
  sharesOutstanding: string;
  /** Independent display currency for cash flow per share. */
  cashFlowPerShareCurrency: SupportedCurrency;
  /** Current price per share. */
  pricePerShare: string;
  pricePerShareCurrency: SupportedCurrency;
  cashFlowPerShareOpen: boolean;
  priceToCashFlowOpen: boolean;
}

export interface PriceToCashFlowResult {
  /** Full-precision CFPS in the cash-flow currency (valuation currency). */
  cashFlowPerShareInCashFlowCurrency: number;
  /** CFPS converted into the CFPS display currency. */
  cashFlowPerShare: number;
  /**
   * P/CF ratio (dimensionless). Null when CFPS is zero (undefined) or price
   * is not ready for a ratio.
   */
  priceToCashFlowRatio: number | null;
  /** True when CFPS is exactly zero so P/CF is undefined (not Infinity). */
  ratioUndefined: boolean;
  cashFlowCurrency: SupportedCurrency;
  cashFlowPerShareCurrency: SupportedCurrency;
  pricePerShareCurrency: SupportedCurrency;
  formattedCashFlowPerShare: string;
  formattedPriceToCashFlowRatio: string | null;
  /** Short note when P/CF is negative. */
  negativeRatioNote: string | null;
}

export type PriceToCashFlowFieldErrors = {
  cashFlow?: string;
  sharesOutstanding?: string;
  pricePerShare?: string;
  form?: string;
};

export function createDefaultInput(): PriceToCashFlowInput {
  return {
    cashFlow: '',
    cashFlowCurrency: 'PKR',
    sharesOutstanding: '',
    cashFlowPerShareCurrency: 'PKR',
    pricePerShare: '',
    pricePerShareCurrency: 'PKR',
    cashFlowPerShareOpen: true,
    priceToCashFlowOpen: true,
  };
}
