import type { SupportedCurrency } from '@/tools/shared/currency';

export const VALUATION_METHODS = [
  'dcf',
  'asset-based',
  'market-cap',
  'multiples',
] as const;
export type ValuationMethod = (typeof VALUATION_METHODS)[number];

export const CASH_FLOW_SCALES = ['ones', 'thousand', 'million'] as const;
export type CashFlowScale = (typeof CASH_FLOW_SCALES)[number];

export const SCALE_FACTOR: Record<CashFlowScale, number> = {
  ones: 1,
  thousand: 1_000,
  million: 1_000_000,
};

export interface BusinessValuationInput {
  method: ValuationMethod;
  currency: SupportedCurrency;
  /** Entered cash flow amount before scale. */
  cashFlow: number;
  cashFlowScale: CashFlowScale;
  projectionYears: number;
  discountRatePercent: number;
  totalAssets: number;
  totalLiabilities: number;
  sharePrice: number;
  sharesOutstanding: number;
  financialMetric: number;
  valuationMultiple: number;
}

export interface BusinessValuationResult {
  method: ValuationMethod;
  currency: SupportedCurrency;
  value: number;
  valueDisplay: string;
}

export type BusinessValuationFieldErrors = Record<string, string>;

export function createDefaultInput(): BusinessValuationInput {
  return {
    method: 'dcf',
    currency: 'PKR',
    cashFlow: Number.NaN,
    cashFlowScale: 'thousand',
    projectionYears: Number.NaN,
    discountRatePercent: 3,
    totalAssets: Number.NaN,
    totalLiabilities: Number.NaN,
    sharePrice: Number.NaN,
    sharesOutstanding: Number.NaN,
    financialMetric: Number.NaN,
    valuationMultiple: Number.NaN,
  };
}
