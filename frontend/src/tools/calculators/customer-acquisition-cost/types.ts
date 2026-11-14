import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CustomerAcquisitionCostInput {
  costOfMarketing: string;
  costOfSales: string;
  newCustomers: string;
  currency: SupportedCurrency;
}

export interface CustomerAcquisitionCostResult {
  costOfMarketing: number;
  costOfSales: number;
  newCustomers: number;
  cac: number;
  currency: SupportedCurrency;
  /** Locale-formatted amount without currency code (inline field). */
  formattedCac: string;
  /** Full currency-formatted amount for share / copy. */
  shareCac: string;
}

export type CustomerAcquisitionCostFieldErrors = {
  costOfMarketing?: string;
  costOfSales?: string;
  newCustomers?: string;
  currency?: string;
  form?: string;
};

export function createDefaultInput(): CustomerAcquisitionCostInput {
  return {
    costOfMarketing: '',
    costOfSales: '',
    newCustomers: '',
    currency: 'PKR',
  };
}
