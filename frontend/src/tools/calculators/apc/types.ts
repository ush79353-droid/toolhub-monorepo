import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ApcInput {
  totalConsumption: string;
  totalDisposableIncome: string;
  currency: SupportedCurrency;
}

export interface ApcResult {
  totalConsumption: number;
  totalDisposableIncome: number;
  apcRatio: number;
  apcPercentage: number;
  impliedSavings: number;
  averagePropensityToSave: number;
  consumptionPercentage: number;
  remainingIncomePercentage: number;
  interpretation: string;
  currency: SupportedCurrency;
}

export type ApcFieldErrors = Partial<
  Record<'totalConsumption' | 'totalDisposableIncome' | 'form', string>
>;

export function createDefaultInput(): ApcInput {
  return {
    totalConsumption: '',
    totalDisposableIncome: '',
    currency: 'USD',
  };
}

export function createExampleInput(): ApcInput {
  return {
    totalConsumption: '8400',
    totalDisposableIncome: '10000',
    currency: 'USD',
  };
}
