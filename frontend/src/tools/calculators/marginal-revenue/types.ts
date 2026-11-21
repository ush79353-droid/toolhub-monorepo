import type { SupportedCurrency } from '@/tools/shared/currency';

export interface MarginalRevenueInput {
  initialRevenue: string;
  initialRevenueCurrency: SupportedCurrency;
  finalRevenue: string;
  finalRevenueCurrency: SupportedCurrency;
  /** Independent display currency for ΔTR. */
  changeRevenueCurrency: SupportedCurrency;
  initialQuantity: string;
  finalQuantity: string;
  /** Independent display currency for marginal revenue (ΔTR/ΔQ). */
  marginalRevenueCurrency: SupportedCurrency;
  revenueOpen: boolean;
  quantityOpen: boolean;
}

export interface MarginalRevenueResult {
  changeRevenueCanonical: number;
  changeQuantity: number;
  /** null when ΔQ is zero (undefined MR). */
  marginalRevenueCanonical: number | null;
  changeRevenue: number;
  marginalRevenue: number | null;
  changeRevenueCurrency: SupportedCurrency;
  marginalRevenueCurrency: SupportedCurrency;
  formattedChangeRevenue: string;
  formattedChangeQuantity: string;
  formattedMarginalRevenue: string;
  undefinedMarginalRevenue: boolean;
}

export type MarginalRevenueFieldErrors = {
  initialRevenue?: string;
  finalRevenue?: string;
  initialQuantity?: string;
  finalQuantity?: string;
  form?: string;
};

export function createDefaultInput(): MarginalRevenueInput {
  return {
    initialRevenue: '',
    initialRevenueCurrency: 'PKR',
    finalRevenue: '',
    finalRevenueCurrency: 'PKR',
    changeRevenueCurrency: 'PKR',
    initialQuantity: '',
    finalQuantity: '',
    marginalRevenueCurrency: 'PKR',
    revenueOpen: true,
    quantityOpen: true,
  };
}
