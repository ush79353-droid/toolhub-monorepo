import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CapitalGainsYieldInput {
  boughtPrice: string;
  currentPrice: string;
  currency: SupportedCurrency;
}

export interface CapitalGainsYieldResult {
  boughtPrice: number;
  currentPrice: number;
  capitalGains: number;
  capitalGainsYieldPercent: number;
  currency: SupportedCurrency;
  formattedCapitalGains: string;
  formattedYieldPercent: string;
}

export type CapitalGainsYieldFieldErrors = {
  boughtPrice?: string;
  currentPrice?: string;
  form?: string;
};

export function createDefaultInput(): CapitalGainsYieldInput {
  return {
    boughtPrice: '',
    currentPrice: '',
    currency: 'PKR',
  };
}
