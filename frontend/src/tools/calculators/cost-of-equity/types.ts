import type { SupportedCurrency } from '@/tools/shared/currency';

export type CostOfEquityMode = 'dividend' | 'no-dividend';

export interface CostOfEquityInput {
  mode: CostOfEquityMode;
  dividendPerShare: string;
  sharePrice: string;
  growthRatePercent: string;
  /** Independent currency for dividend per share. */
  dividendCurrency: SupportedCurrency;
  /** Independent currency for current share price. */
  sharePriceCurrency: SupportedCurrency;
}

export interface CostOfEquityResult {
  costOfEquityPercent: number;
  formattedCostOfEquity: string;
}

export type CostOfEquityFieldErrors = {
  dividendPerShare?: string;
  sharePrice?: string;
  growthRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): CostOfEquityInput {
  return {
    mode: 'dividend',
    dividendPerShare: '',
    sharePrice: '',
    growthRatePercent: '',
    dividendCurrency: 'PKR',
    sharePriceCurrency: 'PKR',
  };
}
