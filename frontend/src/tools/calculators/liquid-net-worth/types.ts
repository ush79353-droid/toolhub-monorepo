import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_MONEY = 1_000_000_000_000_000;

export interface LiquidNetWorthInput {
  totalLiquidAssets: number | null;
  totalLiabilities: number | null;
  currency: SupportedCurrency;
}

export interface LiquidNetWorthResult {
  totalLiquidAssets: number;
  totalLiabilities: number;
  /** Assets − liabilities. May be negative. */
  liquidNetWorth: number;
  currency: SupportedCurrency;
}

export type LiquidNetWorthField = 'totalLiquidAssets' | 'totalLiabilities' | 'currency';

export type LiquidNetWorthFieldErrors = Partial<Record<LiquidNetWorthField, string>>;

export const DEFAULT_CURRENCY = 'PKR' as const;

/** Blank start — screenshot fields are empty. */
export const DEFAULT_INPUT: LiquidNetWorthInput = {
  totalLiquidAssets: null,
  totalLiabilities: null,
  currency: DEFAULT_CURRENCY,
};
