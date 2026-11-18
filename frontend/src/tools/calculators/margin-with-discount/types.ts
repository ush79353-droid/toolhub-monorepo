import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Authoritative driver when margin and markup (and/or revenue) would conflict.
 * Last-edited among margin | markup | revenue wins; cost alone never derives.
 */
export type MarginDiscountDriver = 'margin' | 'markup' | 'revenue';

export interface MarginWithDiscountInput {
  cost: string;
  costCurrency: SupportedCurrency;
  baseMargin: string;
  baseMarkup: string;
  baseRevenue: string;
  baseRevenueCurrency: SupportedCurrency;
  /** Last-edited among margin | markup | revenue (documented sync authority). */
  driver: MarginDiscountDriver;
  discountPercent: string;
  priceAfterDiscountCurrency: SupportedCurrency;
  profitCurrency: SupportedCurrency;
}

export interface MarginWithDiscountResult {
  /** Full-precision amounts in cost currency. */
  baseRevenueCanonical: number;
  baseMarginPercent: number;
  baseMarkupPercent: number;
  priceAfterDiscountCanonical: number;
  trueMarginPercent: number;
  trueMarkupPercent: number;
  profitCanonical: number;
  /** Display amounts after FX into field currencies. */
  baseRevenue: number;
  priceAfterDiscount: number;
  profit: number;
  costCurrency: SupportedCurrency;
  baseRevenueCurrency: SupportedCurrency;
  priceAfterDiscountCurrency: SupportedCurrency;
  profitCurrency: SupportedCurrency;
  formattedBaseRevenue: string;
  formattedBaseMargin: string;
  formattedBaseMarkup: string;
  formattedPriceAfterDiscount: string;
  formattedTrueMargin: string;
  formattedTrueMarkup: string;
  formattedProfit: string;
}

export type MarginWithDiscountFieldErrors = {
  cost?: string;
  baseMargin?: string;
  baseMarkup?: string;
  baseRevenue?: string;
  discountPercent?: string;
  form?: string;
};

export function createDefaultInput(): MarginWithDiscountInput {
  return {
    cost: '',
    costCurrency: 'PKR',
    baseMargin: '',
    baseMarkup: '',
    baseRevenue: '',
    baseRevenueCurrency: 'PKR',
    driver: 'margin',
    discountPercent: '',
    priceAfterDiscountCurrency: 'PKR',
    profitCurrency: 'PKR',
  };
}
