import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ProfitInput {
  /** Buying cost for costPer units. */
  cost: string;
  costCurrency: SupportedCurrency;
  /** Units covered by the buying cost (default 1). Never FX-converted. */
  costPer: string;
  /** Selling price for pricePer units. */
  price: string;
  priceCurrency: SupportedCurrency;
  /** Units covered by the selling price (default 1). Never FX-converted. */
  pricePer: string;
  /** Total quantity sold (default 1). Never FX-converted. */
  quantity: string;
  /** Discount percent on revenue (default 0). Never FX-converted. */
  discountPercent: string;
  totalCostCurrency: SupportedCurrency;
  revenueCurrency: SupportedCurrency;
  totalProfitCurrency: SupportedCurrency;
  buyingCostOpen: boolean;
  sellingPriceOpen: boolean;
}

export interface ProfitResult {
  unitCostCanonical: number;
  unitPriceCanonical: number;
  totalCostCanonical: number;
  revenueCanonical: number;
  totalProfitCanonical: number;
  totalCost: number;
  revenue: number;
  totalProfit: number;
  costCurrency: SupportedCurrency;
  totalCostCurrency: SupportedCurrency;
  revenueCurrency: SupportedCurrency;
  totalProfitCurrency: SupportedCurrency;
  formattedTotalCost: string;
  formattedRevenue: string;
  formattedTotalProfit: string;
  discountPercent: number;
  quantity: number;
}

export type ProfitFieldErrors = {
  cost?: string;
  costPer?: string;
  price?: string;
  pricePer?: string;
  quantity?: string;
  discountPercent?: string;
  form?: string;
};

export function createDefaultInput(): ProfitInput {
  return {
    cost: '',
    costCurrency: 'PKR',
    costPer: '1',
    price: '',
    priceCurrency: 'PKR',
    pricePer: '1',
    quantity: '1',
    discountPercent: '0',
    totalCostCurrency: 'PKR',
    revenueCurrency: 'PKR',
    totalProfitCurrency: 'PKR',
    buyingCostOpen: true,
    sellingPriceOpen: true,
  };
}
