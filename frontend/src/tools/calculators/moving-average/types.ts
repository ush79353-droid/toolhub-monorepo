import type { SupportedCurrency } from '@/tools/shared/currency';

export const INITIAL_PRICES = 3;
export const MAX_PRICES = 60;
export const MIN_LENGTH = 2;

export interface MovingAverageInput {
  length: number;
  prices: string[];
  currency: SupportedCurrency;
}

export interface MovingAverageResult {
  sma: number;
  smaDisplay: string;
  usedPrices: number[];
  currency: SupportedCurrency;
}

export type MovingAverageFieldErrors = Record<string, string>;

export function emptyPrice(): string {
  return '';
}

export function createDefaultInput(): MovingAverageInput {
  return {
    length: Number.NaN,
    prices: Array.from({ length: INITIAL_PRICES }, () => emptyPrice()),
    currency: 'PKR',
  };
}
