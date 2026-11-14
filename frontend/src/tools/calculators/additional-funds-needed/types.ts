import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_MONEY = 1_000_000_000_000_000;

export interface AfnInput {
  /** ΔA — change in assets for the planning period. */
  changeInAssets: number | null;
  /** ΔL — change in spontaneous liabilities. */
  changeInLiabilities: number | null;
  /** ΔRE — change in retained earnings (internal financing). */
  changeInRetainedEarnings: number | null;
  currency: SupportedCurrency;
}

export interface AfnResult {
  changeInAssets: number;
  changeInLiabilities: number;
  changeInRetainedEarnings: number;
  /** AFN = ΔA − ΔL − ΔRE. May be positive, zero, or negative. */
  additionalFundsNeeded: number;
  currency: SupportedCurrency;
}

export type AfnField =
  | 'changeInAssets'
  | 'changeInLiabilities'
  | 'changeInRetainedEarnings'
  | 'currency';

export type AfnFieldErrors = Partial<Record<AfnField, string>>;

export const DEFAULT_AFN_CURRENCY = 'USD' as const;

/** Blank monetary fields — screenshot starts empty. */
export const DEFAULT_AFN_INPUT: AfnInput = {
  changeInAssets: null,
  changeInLiabilities: null,
  changeInRetainedEarnings: null,
  currency: DEFAULT_AFN_CURRENCY,
};
