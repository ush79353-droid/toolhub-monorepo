import type { SupportedCurrency } from '@/tools/shared/currency';

export interface FreeCashFlowInput {
  /** Operating cash flow (CFO). */
  operatingCashFlow: string;
  operatingCashFlowCurrency: SupportedCurrency;
  /**
   * Capital expenditures as positive spending amounts (cash outflows).
   * Subtracted from OCF to get FCF.
   */
  capex: string;
  capexCurrency: SupportedCurrency;
  /** Display / calculation currency for free cash flow. */
  fcfCurrency: SupportedCurrency;
  /** Shares outstanding — used only when per-share section is filled. */
  sharesOutstanding: string;
  /**
   * Stock price — screenshot field. Yield uses market cap (not price alone).
   * Optional consistency helper when shares are also known.
   */
  stockPrice: string;
  stockPriceCurrency: SupportedCurrency;
  marketCap: string;
  marketCapCurrency: SupportedCurrency;
  revenue: string;
  revenueCurrency: SupportedCurrency;
  fcfOpen: boolean;
  /** Collapsed by default (screenshot). */
  perShareOpen: boolean;
  yieldOpen: boolean;
  marginOpen: boolean;
}

export interface FreeCashFlowResult {
  /** Full-precision FCF in the FCF currency (may be negative). */
  fcf: number;
  currency: SupportedCurrency;
  formattedFcf: string;
  /** FCF / shares when shares > 0; otherwise null. */
  fcfPerShare: number | null;
  formattedFcfPerShare: string | null;
  /** FCF / market cap × 100 when market cap > 0; otherwise null. */
  fcfYieldPercent: number | null;
  formattedFcfYieldPercent: string | null;
  /** FCF / revenue × 100 when revenue > 0; otherwise null. */
  fcfMarginPercent: number | null;
  formattedFcfMarginPercent: string | null;
  /**
   * Soft note when stock price × shares differs from market cap.
   * Never invents market cap from price alone.
   */
  consistencyNote: string | null;
}

export type FreeCashFlowFieldErrors = {
  operatingCashFlow?: string;
  capex?: string;
  sharesOutstanding?: string;
  stockPrice?: string;
  marketCap?: string;
  revenue?: string;
  form?: string;
};

export function createDefaultInput(): FreeCashFlowInput {
  return {
    operatingCashFlow: '',
    operatingCashFlowCurrency: 'PKR',
    capex: '',
    capexCurrency: 'PKR',
    fcfCurrency: 'PKR',
    sharesOutstanding: '',
    stockPrice: '',
    stockPriceCurrency: 'PKR',
    marketCap: '',
    marketCapCurrency: 'PKR',
    revenue: '',
    revenueCurrency: 'PKR',
    fcfOpen: true,
    perShareOpen: false,
    yieldOpen: true,
    marginOpen: true,
  };
}
