import type { SupportedCurrency } from '@/tools/shared/currency';

export interface NetProfitMarginInput {
  netProfit: string;
  netProfitCurrency: SupportedCurrency;
  totalRevenues: string;
  totalRevenuesCurrency: SupportedCurrency;
}

export interface NetProfitMarginResult {
  /** Full-precision net profit normalized into the revenues currency. */
  netProfitNormalized: number;
  /** Full-precision total revenues in the calculation currency. */
  totalRevenuesNormalized: number;
  /** Full-precision margin percent — never FX-converted. */
  marginPercent: number;
  calcCurrency: SupportedCurrency;
  formattedMarginPercent: string;
}

export type NetProfitMarginFieldErrors = {
  netProfit?: string;
  totalRevenues?: string;
  form?: string;
};

export function createDefaultInput(): NetProfitMarginInput {
  return {
    netProfit: '',
    netProfitCurrency: 'PKR',
    totalRevenues: '',
    totalRevenuesCurrency: 'PKR',
  };
}
