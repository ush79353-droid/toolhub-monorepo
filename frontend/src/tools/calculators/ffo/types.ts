import type { SupportedCurrency } from '@/tools/shared/currency';

export type FfoConvention = 'standard' | 'excludeInterestIncome';

export type FfoStatus = 'valid' | 'incomplete' | 'invalid';

export interface FfoInput {
  convention: FfoConvention;
  netIncome: string;
  depreciationAmortization: string;
  gainsFromPropertySales: string;
  lossesFromPropertySales: string;
  interestIncome: string;
  currency: SupportedCurrency;
}

export interface FfoResult {
  standardFfo: number;
  adjustedFfo: number | null;
  displayedFfo: number;
  convention: FfoConvention;
  status: FfoStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedStandardFfo: string;
  formattedAdjustedFfo: string | null;
  formattedDisplayedFfo: string;
  resultLabel: string;
}

export type FfoFieldErrors = {
  netIncome?: string;
  depreciationAmortization?: string;
  gainsFromPropertySales?: string;
  lossesFromPropertySales?: string;
  interestIncome?: string;
  form?: string;
};

export function createDefaultInput(): FfoInput {
  return {
    convention: 'standard',
    netIncome: '',
    depreciationAmortization: '',
    gainsFromPropertySales: '',
    lossesFromPropertySales: '',
    interestIncome: '',
    currency: 'PKR',
  };
}
