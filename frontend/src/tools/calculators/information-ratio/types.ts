import type { SupportedCurrency } from '@/tools/shared/currency';

export interface InformationRatioInput {
  beginningValue: string;
  endingValue: string;
  benchmarkReturn: string;
  trackingError: string;
  currency: SupportedCurrency;
}

export interface InformationRatioResult {
  portfolioReturnPercent: number;
  informationRatio: number;
  formattedPortfolioReturn: string;
  formattedInformationRatio: string;
}

export type InformationRatioFieldErrors = {
  beginningValue?: string;
  endingValue?: string;
  benchmarkReturn?: string;
  trackingError?: string;
  form?: string;
};

export function createDefaultInput(): InformationRatioInput {
  return {
    beginningValue: '',
    endingValue: '',
    benchmarkReturn: '',
    trackingError: '',
    currency: 'PKR',
  };
}
