import type { SupportedCurrency } from '@/tools/shared/currency';

export interface MvaInput {
  currentSharePrice: number;
  sharesOutstanding: number;
  capitalInvested: number;
  currency: SupportedCurrency;
}

export interface MvaResult {
  currentMarketValue: number | null;
  mva: number | null;
  currentMarketValueDisplay: string;
  mvaDisplay: string;
  currency: SupportedCurrency;
}

export type MvaFieldErrors = Record<string, string>;

export function createDefaultInput(): MvaInput {
  return {
    currentSharePrice: Number.NaN,
    sharesOutstanding: Number.NaN,
    capitalInvested: Number.NaN,
    currency: 'PKR',
  };
}
