import type { SupportedCurrency } from '@/tools/shared/currency';

export type EbitdaCalculationMode =
  | 'ebitda'
  | 'operatingProfit'
  | 'amortization'
  | 'depreciation';

export type EbitdaStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'invalidReverseResult'
  | 'zeroRevenue';

export interface EbitdaInput {
  mode: EbitdaCalculationMode;
  operatingProfit: string;
  amortizationExpense: string;
  depreciationExpense: string;
  ebitda: string;
  /** Optional — only for EBITDA margin */
  revenue: string;
  currency: SupportedCurrency;
}

export interface EbitdaResult {
  operatingProfit: number;
  amortizationExpense: number;
  depreciationExpense: number;
  ebitda: number;
  ebitdaMargin: number | null;
  status: EbitdaStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedOperatingProfit: string;
  formattedAmortizationExpense: string;
  formattedDepreciationExpense: string;
  formattedEbitda: string;
  formattedEbitdaMargin: string | null;
}

export type EbitdaFieldErrors = {
  operatingProfit?: string;
  amortizationExpense?: string;
  depreciationExpense?: string;
  ebitda?: string;
  revenue?: string;
  form?: string;
};

export function createDefaultInput(): EbitdaInput {
  return {
    mode: 'ebitda',
    operatingProfit: '',
    amortizationExpense: '',
    depreciationExpense: '',
    ebitda: '',
    revenue: '',
    currency: 'PKR',
  };
}
