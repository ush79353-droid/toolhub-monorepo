import type { SupportedCurrency } from '@/tools/shared/currency';

export type AppreciationRatePeriod = 'daily' | 'monthly' | 'yearly';

export interface AppreciationInput {
  startingValue: string;
  appreciationRate: string;
  ratePeriod: AppreciationRatePeriod;
  years: string;
  months: string;
  currency: SupportedCurrency;
}

export interface AppreciationResult {
  startingValue: number;
  appreciationRatePercent: number;
  ratePeriod: AppreciationRatePeriod;
  years: number;
  months: number;
  periods: number;
  finalValue: number;
  currency: SupportedCurrency;
  formattedFinalValue: string;
}

export type AppreciationFieldErrors = {
  startingValue?: string;
  appreciationRate?: string;
  years?: string;
  months?: string;
  form?: string;
};

export function createDefaultInput(): AppreciationInput {
  return {
    startingValue: '10000',
    appreciationRate: '',
    ratePeriod: 'monthly',
    years: '',
    months: '',
    currency: 'PKR',
  };
}
