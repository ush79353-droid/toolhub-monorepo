import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PegRatioInput {
  pricePerShare: string;
  earningsPerShare: string;
  calculateEps: boolean;
  netEarnings: string;
  outstandingShares: string;
  retentionRate: string;
  returnOnEquity: string;
  currency: SupportedCurrency;
}

export interface PegRatioResult {
  earningsPerShare: number | null;
  peRatio: number | null;
  earningsGrowthPercent: number | null;
  pegRatio: number | null;
  currency: SupportedCurrency;
  formattedEps: string | null;
  formattedPeRatio: string | null;
  formattedGrowth: string | null;
  formattedPeg: string | null;
  peUnavailableReason: string | null;
  pegUnavailableReason: string | null;
  warningMessage: string | null;
}

export type PegRatioFieldErrors = {
  form?: string;
  pricePerShare?: string;
  earningsPerShare?: string;
  netEarnings?: string;
  outstandingShares?: string;
  retentionRate?: string;
  returnOnEquity?: string;
};

/**
 * Reference (with calculated EPS):
 * Price 250 · Net earnings 15,500,000 · Shares 1,000,000
 * → EPS 15.50 · P/E ≈ 16.1290 · b 60% · ROE 8% → g 4.8% · PEG ≈ 3.3602
 */
export function createDefaultInput(): PegRatioInput {
  return {
    pricePerShare: '250',
    earningsPerShare: '15.50',
    calculateEps: false,
    netEarnings: '15500000',
    outstandingShares: '1000000',
    retentionRate: '60',
    returnOnEquity: '8',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): PegRatioInput {
  return {
    pricePerShare: '',
    earningsPerShare: '',
    calculateEps: false,
    netEarnings: '',
    outstandingShares: '',
    retentionRate: '',
    returnOnEquity: '',
    currency,
  };
}
