import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_MONEY = 1_000_000_000_000_000;
export const MAX_UNITS = 1_000_000_000_000;

export interface ContributionMarginInput {
  sellingPricePerUnit: number | null;
  variableCostPerUnit: number | null;
  numberOfUnits: number | null;
  fixedCosts: number | null;
  currency: SupportedCurrency;
}

export interface ContributionMarginResult {
  sellingPricePerUnit: number;
  variableCostPerUnit: number;
  numberOfUnits: number;
  fixedCosts: number;
  /** (Price − Variable cost) × Units */
  contributionMargin: number;
  /**
   * ((Price − Variable cost) / Price) × 100.
   * null when selling price is zero (avoids NaN/Infinity).
   */
  contributionMarginRatioPercent: number | null;
  /** Contribution margin − Fixed costs (may be negative). */
  profitGenerated: number;
  currency: SupportedCurrency;
}

export type ContributionMarginField =
  | 'sellingPricePerUnit'
  | 'variableCostPerUnit'
  | 'numberOfUnits'
  | 'fixedCosts'
  | 'currency';

export type ContributionMarginFieldErrors = Partial<Record<ContributionMarginField, string>>;

export const DEFAULT_CURRENCY = 'PKR' as const;

/** Blank start — screenshot fields are empty until the user types. */
export const DEFAULT_INPUT: ContributionMarginInput = {
  sellingPricePerUnit: null,
  variableCostPerUnit: null,
  numberOfUnits: null,
  fixedCosts: null,
  currency: DEFAULT_CURRENCY,
};
