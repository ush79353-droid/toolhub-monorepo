import type { SupportedCurrency } from '@/tools/shared/currency';

export type RevenueSolveTarget = 'price' | 'quantity' | 'totalRevenue';

export interface RevenueDraft {
  price: string;
  priceCurrency: SupportedCurrency;
  quantity: string;
  totalRevenue: string;
  totalRevenueCurrency: SupportedCurrency;
  /** Which field to solve when exactly one is blank; otherwise last-edited drives refresh. */
  solveFor: RevenueSolveTarget;
  lastEdited: RevenueSolveTarget;
}

export interface RevenueResult {
  solvedField: RevenueSolveTarget;
  price: number;
  quantity: number;
  totalRevenue: number;
  /** Currency used for price/total math after FX normalize (price currency). */
  calcCurrency: SupportedCurrency;
  totalRevenueCurrency: SupportedCurrency;
  formattedPrice: string;
  formattedQuantity: string;
  formattedTotalRevenue: string;
  summaryText: string;
}

export type RevenueFieldErrors = {
  price?: string;
  quantity?: string;
  totalRevenue?: string;
  form?: string;
};

export function createDefaultDraft(): RevenueDraft {
  return {
    price: '',
    priceCurrency: 'PKR',
    quantity: '',
    totalRevenue: '',
    totalRevenueCurrency: 'PKR',
    solveFor: 'totalRevenue',
    lastEdited: 'price',
  };
}
