import type { SupportedCurrency } from '@/tools/shared/currency';

export interface FifoInventoryInput {
  batch1Price: number;
  batch1Qty: number;
  batch2Price: number;
  batch2Qty: number;
  unitsSold: number;
  sellingPrice: number;
  currency: SupportedCurrency;
}

export interface FifoInventoryResult {
  batch1Price: number;
  batch1Qty: number;
  batch2Price: number;
  batch2Qty: number;
  unitsSold: number;
  sellingPrice: number;
  revenue: number;
  fifoCogs: number;
  grossProfit: number;
  grossMarginPercent: number | null;
  currency: SupportedCurrency;
  revenueDisplay: string;
  cogsDisplay: string;
  profitDisplay: string;
  marginDisplay: string;
  shareRevenue: string;
  shareCogs: string;
  shareProfit: string;
}

export type FifoInventoryFieldErrors = Record<string, string>;

export function createDefaultInput(): FifoInventoryInput {
  return {
    batch1Price: Number.NaN,
    batch1Qty: Number.NaN,
    batch2Price: Number.NaN,
    batch2Qty: Number.NaN,
    unitsSold: Number.NaN,
    sellingPrice: Number.NaN,
    currency: 'PKR',
  };
}
