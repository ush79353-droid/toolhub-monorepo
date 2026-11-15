import type { SupportedCurrency } from '@/tools/shared/currency';

export interface HoldingPeriodReturnInput {
  boughtPrice: string;
  currentPrice: string;
  dividendIncome: string;
  currency: SupportedCurrency;
}

export interface HoldingPeriodReturnResult {
  boughtPrice: number;
  currentPrice: number;
  dividendIncome: number;
  capitalGainsYieldPercent: number;
  dividendYieldPercent: number;
  holdingPeriodReturnPercent: number;
  currency: SupportedCurrency;
  formattedCapitalGainsYield: string;
  formattedDividendYield: string;
  formattedHoldingPeriodReturn: string;
}

export type HoldingPeriodReturnFieldErrors = {
  boughtPrice?: string;
  currentPrice?: string;
  dividendIncome?: string;
  form?: string;
};

export function createDefaultInput(): HoldingPeriodReturnInput {
  return {
    boughtPrice: '',
    currentPrice: '',
    dividendIncome: '',
    currency: 'PKR',
  };
}
