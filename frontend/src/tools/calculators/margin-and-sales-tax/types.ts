import type { SupportedCurrency } from '@/tools/shared/currency';

export interface MarginAndSalesTaxInput {
  cost: string;
  costCurrency: SupportedCurrency;
  markupPercent: string;
  netPrice: string;
  netPriceCurrency: SupportedCurrency;
  marginPercent: string;
  salesTaxPercent: string;
  grossPrice: string;
  grossPriceCurrency: SupportedCurrency;
  profit: string;
  profitCurrency: SupportedCurrency;
}

export interface MarginAndSalesTaxResult {
  costCanonical: number;
  netPriceCanonical: number;
  marginPercent: number | null;
  salesTaxPercent: number;
  grossPriceCanonical: number;
  profitCanonical: number;
  salesTaxAmountCanonical: number;
  cost: number;
  netPrice: number;
  grossPrice: number;
  profit: number;
  costCurrency: SupportedCurrency;
  netPriceCurrency: SupportedCurrency;
  grossPriceCurrency: SupportedCurrency;
  profitCurrency: SupportedCurrency;
  formattedCost: string;
  formattedNetPrice: string;
  formattedMarginPercent: string;
  formattedSalesTaxPercent: string;
  formattedGrossPrice: string;
  formattedProfit: string;
}

export type MarginAndSalesTaxFieldErrors = {
  cost?: string;
  markupPercent?: string;
  salesTaxPercent?: string;
  form?: string;
};

export function createDefaultInput(): MarginAndSalesTaxInput {
  return {
    cost: '',
    costCurrency: 'PKR',
    markupPercent: '',
    netPrice: '',
    netPriceCurrency: 'PKR',
    marginPercent: '',
    salesTaxPercent: '',
    grossPrice: '',
    grossPriceCurrency: 'PKR',
    profit: '',
    profitCurrency: 'PKR',
  };
}
