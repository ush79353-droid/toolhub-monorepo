import type { SupportedCurrency } from '@/tools/shared/currency';

export interface DividendDiscountModelInput {
  dividendPayoutRatioPercent: string;
  returnOnEquityPercent: string;
  dividendPerShare: string;
  /** Currency of dividend per share (D₀); canonical calculation currency. */
  dividendCurrency: SupportedCurrency;
  /** Independent display currency for expected dividend (D₁). */
  expectedDividendCurrency: SupportedCurrency;
  riskFreeRatePercent: string;
  marketRiskPremiumPercent: string;
  beta: string;
  /** Independent display currency for DDM stock value (P₀). */
  stockValueCurrency: SupportedCurrency;
}

export interface DividendDiscountModelResult {
  growthRatePercent: number;
  formattedGrowthRatePercent: string;
  /** Full-precision D₁ in dividend currency. */
  expectedDividendInDividendCurrency: number;
  /** Full-precision D₁ in expected-dividend display currency. */
  expectedDividend: number;
  expectedDividendCurrency: SupportedCurrency;
  formattedExpectedDividend: string;
  costOfEquityPercent: number;
  formattedCostOfEquityPercent: string;
  /** Full-precision P₀ in dividend currency. */
  stockValueInDividendCurrency: number;
  /** Full-precision P₀ in stock-value display currency. */
  stockValue: number;
  stockValueCurrency: SupportedCurrency;
  formattedStockValue: string;
}

export type DividendDiscountModelFieldErrors = {
  dividendPayoutRatioPercent?: string;
  returnOnEquityPercent?: string;
  dividendPerShare?: string;
  riskFreeRatePercent?: string;
  marketRiskPremiumPercent?: string;
  beta?: string;
  form?: string;
};

export function createDefaultInput(): DividendDiscountModelInput {
  return {
    dividendPayoutRatioPercent: '40',
    returnOnEquityPercent: '15',
    dividendPerShare: '5',
    dividendCurrency: 'PKR',
    expectedDividendCurrency: 'PKR',
    riskFreeRatePercent: '4',
    marketRiskPremiumPercent: '6',
    beta: '1.2',
    stockValueCurrency: 'PKR',
  };
}
