import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_MONEY = 1_000_000_000_000_000;
export const MAX_QUANTITY = 1_000_000_000_000;

export interface PriceQuantityInput {
  smallerQuantity: number | null;
  smallerPrice: number | null;
  largerQuantity: number | null;
  largerPrice: number | null;
  currency: SupportedCurrency;
}

export interface PriceQuantityResult {
  smallerQuantity: number;
  smallerPrice: number;
  largerQuantity: number;
  largerPrice: number;
  /** Smaller price ÷ quantity. null if quantity is zero (should not occur after validation). */
  smallerPricePerUnit: number;
  largerPricePerUnit: number;
  /** Larger quantity × smaller price per unit. */
  wouldHaveCost: number;
  /** Would have cost − larger price. May be negative. */
  youSave: number;
  currency: SupportedCurrency;
}

export type PriceQuantityField =
  | 'smallerQuantity'
  | 'smallerPrice'
  | 'largerQuantity'
  | 'largerPrice'
  | 'currency';

export type PriceQuantityFieldErrors = Partial<Record<PriceQuantityField, string>>;

export const DEFAULT_CURRENCY = 'PKR' as const;

export const DEFAULT_INPUT: PriceQuantityInput = {
  smallerQuantity: null,
  smallerPrice: null,
  largerQuantity: null,
  largerPrice: null,
  currency: DEFAULT_CURRENCY,
};
