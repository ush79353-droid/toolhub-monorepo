import type { SupportedCurrency } from '@/tools/shared/currency';

export interface AverageFixedCostInput {
  totalFixedCost: string;
  numberOfUnits: string;
  currency: SupportedCurrency;
}

export interface AverageFixedCostResult {
  totalFixedCost: number;
  numberOfUnits: number;
  averageFixedCost: number;
  currency: SupportedCurrency;
  /** Locale-formatted amount without currency code (for the inline field). */
  formattedAverage: string;
  /** Full currency-formatted amount for share / copy text. */
  shareAverage: string;
}

export type AverageFixedCostFieldErrors = {
  totalFixedCost?: string;
  numberOfUnits?: string;
  currency?: string;
  form?: string;
};

export function createDefaultInput(): AverageFixedCostInput {
  return {
    totalFixedCost: '',
    numberOfUnits: '',
    currency: 'PKR',
  };
}
