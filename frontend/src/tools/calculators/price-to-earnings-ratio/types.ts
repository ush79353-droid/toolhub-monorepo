import type { SupportedCurrency } from '@/tools/shared/currency';

export type PeStatus =
  | 'valid'
  | 'missing'
  | 'undefined'
  | 'not-meaningful'
  | 'invalid';

export interface PriceToEarningsInput {
  pricePerShare: string;
  earningsPerShare: string;
  showEpsCalculator: boolean;
  netIncome: string;
  preferredDividends: string;
  weightedAverageShares: string;
  currency: SupportedCurrency;
}

export interface PriceToEarningsResult {
  earningsPerShare: number | null;
  peRatio: number | null;
  status: PeStatus;
  currency: SupportedCurrency;
  formattedEps: string | null;
  formattedPe: string | null;
  peUnavailableReason: string | null;
  interpretation: string | null;
  warningMessage: string | null;
}

export type PriceToEarningsFieldErrors = {
  form?: string;
  pricePerShare?: string;
  earningsPerShare?: string;
  netIncome?: string;
  preferredDividends?: string;
  weightedAverageShares?: string;
};

/** Reference: price 120 · EPS 10 → P/E 12.00× */
export function createDefaultInput(): PriceToEarningsInput {
  return {
    pricePerShare: '120',
    earningsPerShare: '10',
    showEpsCalculator: false,
    netIncome: '1000000',
    preferredDividends: '100000',
    weightedAverageShares: '100000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): PriceToEarningsInput {
  return {
    pricePerShare: '',
    earningsPerShare: '',
    showEpsCalculator: false,
    netIncome: '',
    preferredDividends: '0',
    weightedAverageShares: '',
    currency,
  };
}
