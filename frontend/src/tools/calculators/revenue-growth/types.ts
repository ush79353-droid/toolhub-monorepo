import type { SupportedCurrency } from '@/tools/shared/currency';

export interface RevenueGrowthInput {
  totalInitial: string;
  totalInitialCurrency: SupportedCurrency;
  totalFinal: string;
  totalFinalCurrency: SupportedCurrency;
  rateInitial: string;
  rateInitialCurrency: SupportedCurrency;
  rateFinal: string;
  rateFinalCurrency: SupportedCurrency;
  periods: string;
}

export interface RevenueGrowthResult {
  totalGrowthPercent: number | null;
  formattedTotalGrowth: string;
  growthRatePercent: number | null;
  formattedGrowthRate: string;
}

export type RevenueGrowthFieldErrors = {
  totalInitial?: string;
  totalFinal?: string;
  rateInitial?: string;
  rateFinal?: string;
  periods?: string;
  form?: string;
};

export function createDefaultInput(): RevenueGrowthInput {
  return {
    totalInitial: '',
    totalInitialCurrency: 'PKR',
    totalFinal: '',
    totalFinalCurrency: 'PKR',
    rateInitial: '',
    rateInitialCurrency: 'PKR',
    rateFinal: '',
    rateFinalCurrency: 'PKR',
    periods: '',
  };
}
