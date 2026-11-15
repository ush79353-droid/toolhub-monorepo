import type { SupportedCurrency } from '@/tools/shared/currency';

export interface TreynorRatioInput {
  beginningValue: string;
  endingValue: string;
  riskFreeRate: string;
  beta: string;
  currency: SupportedCurrency;
}

export interface TreynorRatioResult {
  portfolioReturnPercent: number;
  treynorRatioPercent: number;
  formattedPortfolioReturn: string;
  formattedTreynorRatio: string;
}

export type TreynorRatioFieldErrors = {
  beginningValue?: string;
  endingValue?: string;
  riskFreeRate?: string;
  beta?: string;
  form?: string;
};

export function createDefaultInput(): TreynorRatioInput {
  return {
    beginningValue: '',
    endingValue: '',
    riskFreeRate: '',
    beta: '',
    currency: 'PKR',
  };
}
