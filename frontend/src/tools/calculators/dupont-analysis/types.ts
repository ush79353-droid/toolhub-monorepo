import type { SupportedCurrency } from '@/tools/shared/currency';

export interface DupontInput {
  sales: string;
  netIncome: string;
  totalAssets: string;
  totalEquity: string;
  currency: SupportedCurrency;
}

export interface DupontResult {
  netProfitMargin: number;
  totalAssetTurnover: number;
  financialLeverage: number;
  returnOnEquity: number;
  directRoe: number;
  negativeEquity: boolean;
  currency: SupportedCurrency;
  formattedNpm: string;
  formattedTat: string;
  formattedFl: string;
  formattedRoe: string;
  interpretation: string;
  warningMessage: string | null;
}

export type DupontFieldErrors = {
  form?: string;
  sales?: string;
  netIncome?: string;
  totalAssets?: string;
  totalEquity?: string;
};

export function createDefaultInput(): DupontInput {
  return {
    sales: '1000000',
    netIncome: '120000',
    totalAssets: '800000',
    totalEquity: '400000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): DupontInput {
  return {
    sales: '',
    netIncome: '',
    totalAssets: '',
    totalEquity: '',
    currency,
  };
}
