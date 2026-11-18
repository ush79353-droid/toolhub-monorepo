import type { SupportedCurrency } from '@/tools/shared/currency';

export const MIN_PAIRS = 4;
export const MAX_PAIRS = 60;

export interface PricePairInput {
  asset: string;
  benchmark: string;
}

export interface BetaStockInput {
  pairs: PricePairInput[];
  currency: SupportedCurrency;
  graphPrices: boolean;
}

export interface PricePair {
  asset: number;
  benchmark: number;
}

export interface BetaStockResult {
  beta: number;
  formattedBeta: string;
  pairs: PricePair[];
  currency: SupportedCurrency;
}

export type BetaStockFieldErrors = Record<string, string>;

export function emptyPair(): PricePairInput {
  return { asset: '', benchmark: '' };
}

export function createDefaultInput(): BetaStockInput {
  return {
    pairs: Array.from({ length: MIN_PAIRS }, () => emptyPair()),
    currency: 'PKR',
    graphPrices: false,
  };
}

export function dayOrdinal(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (k >= 11 && k <= 13) return `${n}th`;
  if (j === 1) return `${n}st`;
  if (j === 2) return `${n}nd`;
  if (j === 3) return `${n}rd`;
  return `${n}th`;
}
