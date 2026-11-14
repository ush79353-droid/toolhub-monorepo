import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CpaInput {
  numberOfClicks: number;
  averageCpc: number;
  totalConversions: number;
  currency: SupportedCurrency;
}

export interface CpaResult {
  numberOfClicks: number;
  averageCpc: number;
  totalAdSpend: number;
  totalConversions: number;
  cpa: number | null;
  currency: SupportedCurrency;
  adSpendDisplay: string;
  cpaDisplay: string;
  shareAdSpend: string;
  shareCpa: string;
}

export type CpaFieldErrors = Record<string, string>;

export function createDefaultInput(): CpaInput {
  return {
    numberOfClicks: Number.NaN,
    averageCpc: Number.NaN,
    totalConversions: Number.NaN,
    currency: 'PKR',
  };
}
