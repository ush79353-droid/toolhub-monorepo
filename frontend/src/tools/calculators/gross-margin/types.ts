import type { SupportedCurrency } from '@/tools/shared/currency';

export interface GrossMarginInput {
  revenue: string;
  revenueCurrency: SupportedCurrency;
  cogs: string;
  cogsCurrency: SupportedCurrency;
  /** Independent display currency for gross profit. */
  profitCurrency: SupportedCurrency;
}

export interface GrossMarginResult {
  /** Full-precision gross profit in calculation (revenue) currency. */
  grossProfit: number;
  /** Full-precision gross profit in the display currency. */
  grossProfitDisplay: number;
  /** Full-precision margin percent. */
  marginPercent: number;
  revenueNormalized: number;
  cogsNormalized: number;
  calcCurrency: SupportedCurrency;
  profitCurrency: SupportedCurrency;
  formattedGrossProfit: string;
  formattedMarginPercent: string;
}

export type GrossMarginFieldErrors = {
  revenue?: string;
  cogs?: string;
  form?: string;
};

export function createDefaultInput(): GrossMarginInput {
  return {
    revenue: '',
    revenueCurrency: 'PKR',
    cogs: '',
    cogsCurrency: 'PKR',
    profitCurrency: 'PKR',
  };
}
