import type { SupportedCurrency } from '@/tools/shared/currency';

export interface MarketCapitalizationInput {
  sharePrice: string;
  outstandingShares: string;
  currency: SupportedCurrency;
}

export interface MarketCapitalizationResult {
  marketCapitalization: number;
  currency: SupportedCurrency;
  formattedMarketCap: string;
  compactMarketCap: string;
  interpretation: string;
  warningMessage: string | null;
}

export type MarketCapitalizationFieldErrors = {
  form?: string;
  sharePrice?: string;
  outstandingShares?: string;
};

/** Reference: $100 × 10,000,000 → $1,000,000,000 ($1B) */
export function createDefaultInput(): MarketCapitalizationInput {
  return {
    sharePrice: '100',
    outstandingShares: '10000000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): MarketCapitalizationInput {
  return {
    sharePrice: '',
    outstandingShares: '',
    currency,
  };
}
