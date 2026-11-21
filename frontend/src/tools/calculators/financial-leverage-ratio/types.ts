import type { SupportedCurrency } from '@/tools/shared/currency';

export type FinancialLeverageStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroEquity'
  | 'negativeEquity'
  | 'inconsistentBalanceSheet';

export interface FinancialLeverageRatioInput {
  currentAssets: string;
  nonCurrentAssets: string;
  totalEquity: string;
  currency: SupportedCurrency;
}

export interface FinancialLeverageRatioResult {
  currentAssets: number;
  nonCurrentAssets: number;
  totalAssets: number;
  totalEquity: number;
  financialLeverage: number | null;
  totalLiabilities: number | null;
  equityRatio: number | null;
  liabilitiesToEquity: number | null;
  status: FinancialLeverageStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedCurrentAssets: string;
  formattedNonCurrentAssets: string;
  formattedTotalAssets: string;
  formattedTotalEquity: string;
  formattedFinancialLeverage: string | null;
  formattedTotalLiabilities: string | null;
  formattedEquityRatio: string | null;
  formattedLiabilitiesToEquity: string | null;
}

export type FinancialLeverageRatioFieldErrors = {
  currentAssets?: string;
  nonCurrentAssets?: string;
  totalEquity?: string;
  form?: string;
};

export function createDefaultInput(): FinancialLeverageRatioInput {
  return {
    currentAssets: '',
    nonCurrentAssets: '',
    totalEquity: '',
    currency: 'PKR',
  };
}
