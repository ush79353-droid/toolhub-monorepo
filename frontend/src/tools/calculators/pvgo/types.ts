import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PvgoInput {
  earnings: number;
  sharesOutstanding: number;
  sharePrice: number;
  costOfEquityPercent: number;
  currency: SupportedCurrency;
}

export interface PvgoResult {
  eps: number | null;
  pvgo: number | null;
  epsDisplay: string;
  pvgoDisplay: string;
  currency: SupportedCurrency;
}

export type PvgoFieldErrors = Record<string, string>;

export function createDefaultInput(): PvgoInput {
  return {
    earnings: Number.NaN,
    sharesOutstanding: Number.NaN,
    sharePrice: Number.NaN,
    costOfEquityPercent: Number.NaN,
    currency: 'PKR',
  };
}
