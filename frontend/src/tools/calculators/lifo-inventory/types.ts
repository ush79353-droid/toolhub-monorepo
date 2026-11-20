import type { SupportedCurrency } from '@/tools/shared/currency';

export type LifoInventoryStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'insufficientInventory'
  | 'zeroRevenue';

export interface LifoLayerAllocation {
  label: string;
  purchased: number;
  sold: number;
  remaining: number;
  unitCost: number;
  cogs: number;
  endingValue: number;
}

export interface LifoInventoryInput {
  batch1Price: string;
  batch1Qty: string;
  batch2Price: string;
  batch2Qty: string;
  unitsSold: string;
  sellingPrice: string;
  currency: SupportedCurrency;
}

export interface LifoInventoryResult {
  batch1Price: number;
  batch1Qty: number;
  batch2Price: number;
  batch2Qty: number;
  unitsSold: number;
  sellingPrice: number;
  totalAvailableUnits: number;
  totalPurchaseCost: number;
  lifoCogs: number;
  endingInventoryUnits: number;
  endingInventoryValue: number;
  revenue: number;
  grossProfit: number;
  grossProfitMargin: number | null;
  layers: LifoLayerAllocation[];
  status: LifoInventoryStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedTotalPurchaseCost: string;
  formattedLifoCogs: string;
  formattedEndingInventory: string;
  formattedRevenue: string;
  formattedGrossProfit: string;
  formattedGrossProfitMargin: string | null;
}

export type LifoInventoryFieldErrors = {
  batch1Price?: string;
  batch1Qty?: string;
  batch2Price?: string;
  batch2Qty?: string;
  unitsSold?: string;
  sellingPrice?: string;
  form?: string;
};

export function createDefaultInput(): LifoInventoryInput {
  return {
    batch1Price: '',
    batch1Qty: '',
    batch2Price: '',
    batch2Qty: '',
    unitsSold: '',
    sellingPrice: '',
    currency: 'PKR',
  };
}
