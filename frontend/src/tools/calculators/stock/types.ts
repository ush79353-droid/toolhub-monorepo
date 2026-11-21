import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Screenshot-first Stock Calculator inputs.
 * Buying/selling prices are per share. Commission rates are percents (never FX).
 * Share count is a quantity (never FX). Money outputs keep independent display currencies.
 */
export interface StockInput {
  numberOfShares: string;
  buyingPrice: string;
  buyingPriceCurrency: SupportedCurrency;
  buyingCommissionPercent: string;
  buyingCommissionAmountCurrency: SupportedCurrency;
  netBuyingPriceCurrency: SupportedCurrency;
  sellingPrice: string;
  sellingPriceCurrency: SupportedCurrency;
  sellingCommissionPercent: string;
  sellingCommissionAmountCurrency: SupportedCurrency;
  netSellingPriceCurrency: SupportedCurrency;
  profitCurrency: SupportedCurrency;
  breakEvenSellingPriceCurrency: SupportedCurrency;
}

export interface StockResult {
  /** Canonical totals / prices in buying-price currency (full precision). */
  grossPurchaseCostCanonical: number;
  buyingCommissionAmountCanonical: number;
  netBuyingCostCanonical: number;
  grossSaleProceedsCanonical: number;
  sellingCommissionAmountCanonical: number;
  netSellingProceedsCanonical: number;
  profitCanonical: number;
  /** ROI percent — never FX-converted. */
  roiPercent: number;
  /** Break-even selling price per share in buying-price currency. */
  breakEvenSellingPriceCanonical: number;

  buyingCommissionAmount: number;
  netBuyingCost: number;
  sellingCommissionAmount: number;
  netSellingProceeds: number;
  profit: number;
  breakEvenSellingPrice: number;

  buyingPriceCurrency: SupportedCurrency;
  buyingCommissionAmountCurrency: SupportedCurrency;
  netBuyingPriceCurrency: SupportedCurrency;
  sellingPriceCurrency: SupportedCurrency;
  sellingCommissionAmountCurrency: SupportedCurrency;
  netSellingPriceCurrency: SupportedCurrency;
  profitCurrency: SupportedCurrency;
  breakEvenSellingPriceCurrency: SupportedCurrency;

  formattedBuyingCommissionAmount: string;
  formattedNetBuyingCost: string;
  formattedSellingCommissionAmount: string;
  formattedNetSellingProceeds: string;
  formattedProfit: string;
  formattedRoiPercent: string;
  formattedBreakEvenSellingPrice: string;
}

export type StockFieldErrors = {
  numberOfShares?: string;
  buyingPrice?: string;
  buyingCommissionPercent?: string;
  sellingPrice?: string;
  sellingCommissionPercent?: string;
  form?: string;
};

export function createDefaultInput(): StockInput {
  return {
    numberOfShares: '',
    buyingPrice: '',
    buyingPriceCurrency: 'PKR',
    buyingCommissionPercent: '',
    buyingCommissionAmountCurrency: 'PKR',
    netBuyingPriceCurrency: 'PKR',
    sellingPrice: '',
    sellingPriceCurrency: 'PKR',
    sellingCommissionPercent: '',
    sellingCommissionAmountCurrency: 'PKR',
    netSellingPriceCurrency: 'PKR',
    profitCurrency: 'PKR',
    breakEvenSellingPriceCurrency: 'PKR',
  };
}
