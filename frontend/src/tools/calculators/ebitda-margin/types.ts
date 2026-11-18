import type { SupportedCurrency } from '@/tools/shared/currency';

export interface EbitdaMarginInput {
  totalRevenues: string;
  totalRevenuesCurrency: SupportedCurrency;
  ebitda: string;
  ebitdaCurrency: SupportedCurrency;
}

export interface EbitdaMarginResult {
  /** Full-precision margin percent. */
  marginPercent: number;
  /** EBITDA normalized into the calculation currency. */
  ebitdaNormalized: number;
  /** Total revenues in the calculation currency. */
  revenuesNormalized: number;
  /** Currency used for the division (total revenues currency). */
  calcCurrency: SupportedCurrency;
  formattedMarginPercent: string;
}

export type EbitdaMarginFieldErrors = {
  totalRevenues?: string;
  ebitda?: string;
  form?: string;
};

export function createDefaultInput(): EbitdaMarginInput {
  return {
    totalRevenues: '',
    totalRevenuesCurrency: 'PKR',
    ebitda: '',
    ebitdaCurrency: 'PKR',
  };
}
