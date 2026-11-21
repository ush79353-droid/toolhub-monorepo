import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PercentageDiscountInput {
  /** List / sticker price before the percent-off discount. */
  priceBefore: string;
  priceBeforeCurrency: SupportedCurrency;
  /** Discount percent (0–100). Never FX-converted. */
  discountPercent: string;
  /** Independent display currency for price after discount. */
  priceAfterCurrency: SupportedCurrency;
  /** Independent display currency for savings. */
  youSaveCurrency: SupportedCurrency;
}

export interface PercentageDiscountResult {
  /** Full-precision sale price in price-before currency. */
  priceAfterCanonical: number;
  /** Full-precision discount amount in price-before currency. */
  youSaveCanonical: number;
  /** Sale price after FX into priceAfterCurrency. */
  priceAfter: number;
  /** Savings after FX into youSaveCurrency. */
  youSave: number;
  priceBeforeCurrency: SupportedCurrency;
  priceAfterCurrency: SupportedCurrency;
  youSaveCurrency: SupportedCurrency;
  formattedPriceAfter: string;
  formattedYouSave: string;
}

export type PercentageDiscountFieldErrors = {
  priceBefore?: string;
  discountPercent?: string;
  form?: string;
};

/** Example 1 — New dress with 20% discount. */
export const EXAMPLE_NEW_DRESS: PercentageDiscountInput = {
  priceBefore: '5000',
  priceBeforeCurrency: 'PKR',
  discountPercent: '20',
  priceAfterCurrency: 'PKR',
  youSaveCurrency: 'PKR',
};

/** Example 2 — New bed with 15% discount. */
export const EXAMPLE_NEW_BED: PercentageDiscountInput = {
  priceBefore: '25000',
  priceBeforeCurrency: 'PKR',
  discountPercent: '15',
  priceAfterCurrency: 'PKR',
  youSaveCurrency: 'PKR',
};

export function createDefaultInput(): PercentageDiscountInput {
  return {
    priceBefore: '',
    priceBeforeCurrency: 'PKR',
    discountPercent: '',
    priceAfterCurrency: 'PKR',
    youSaveCurrency: 'PKR',
  };
}
