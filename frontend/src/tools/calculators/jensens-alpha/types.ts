import type { SupportedCurrency } from '@/tools/shared/currency';

export interface JensensAlphaInput {
  beginningValue: string;
  endingValue: string;
  riskFreeRate: string;
  beta: string;
  marketReturn: string;
  currency: SupportedCurrency;
}

export interface JensensAlphaResult {
  portfolioReturnPercent: number;
  expectedReturnPercent: number;
  jensensAlphaPercent: number;
  formattedPortfolioReturn: string;
  formattedExpectedReturn: string;
  formattedJensensAlpha: string;
}

export type JensensAlphaFieldErrors = {
  beginningValue?: string;
  endingValue?: string;
  riskFreeRate?: string;
  beta?: string;
  marketReturn?: string;
  form?: string;
};

export function createDefaultInput(): JensensAlphaInput {
  return {
    beginningValue: '',
    endingValue: '',
    riskFreeRate: '',
    beta: '',
    marketReturn: '11',
    currency: 'PKR',
  };
}
