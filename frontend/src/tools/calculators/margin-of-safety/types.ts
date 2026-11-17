import type { SupportedCurrency } from '@/tools/shared/currency';

export interface MarginOfSafetyInput {
  currentSales: string;
  currentSalesCurrency: SupportedCurrency;
  breakevenSales: string;
  breakevenSalesCurrency: SupportedCurrency;
  salesVolume: string;
  sellingPricePerUnit: string;
  sellingPriceCurrency: SupportedCurrency;
  costPricePerUnit: string;
  costPriceCurrency: SupportedCurrency;
  resultCurrency: SupportedCurrency;
  /** When true, current sales tracks volume × selling price. */
  currentSalesFromPerUnit: boolean;
}

export interface MarginOfSafetyResult {
  marginOfSafety: number;
  marginOfSafetyRatio: number | null;
  marginOfSafetyPercent: number | null;
  marginOfSafetyUnits: number | null;
  currentSalesNormalized: number;
  breakevenSalesNormalized: number;
  calcCurrency: SupportedCurrency;
  resultCurrency: SupportedCurrency;
  formattedMarginOfSafety: string;
  formattedRatio: string;
  formattedPercent: string;
  formattedUnits: string;
}

export type MarginOfSafetyFieldErrors = {
  currentSales?: string;
  breakevenSales?: string;
  salesVolume?: string;
  sellingPricePerUnit?: string;
  costPricePerUnit?: string;
  form?: string;
};

export function createDefaultInput(): MarginOfSafetyInput {
  return {
    currentSales: '',
    currentSalesCurrency: 'PKR',
    breakevenSales: '',
    breakevenSalesCurrency: 'PKR',
    salesVolume: '',
    sellingPricePerUnit: '',
    sellingPriceCurrency: 'PKR',
    costPricePerUnit: '',
    costPriceCurrency: 'PKR',
    resultCurrency: 'PKR',
    currentSalesFromPerUnit: false,
  };
}
