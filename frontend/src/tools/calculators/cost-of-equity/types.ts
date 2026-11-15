import type { SupportedCurrency } from '@/tools/shared/currency';

export type CostOfEquityMode = 'dividend' | 'no-dividend';

export interface CostOfEquityInput {
  mode: CostOfEquityMode;
  dividendPerShare: string;
  sharePrice: string;
  growthRatePercent: string;
  currency: SupportedCurrency;
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
    currency: 'PKR',
  };
}
