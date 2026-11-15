import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PerpetuityInput {
  dividend: string;
  discountRatePercent: string;
  growthRatePercent: string;
  currency: SupportedCurrency;
}

export interface PerpetuityResult {
  presentValue: number;
  currency: SupportedCurrency;
  formattedPresentValue: string;
}

export type PerpetuityFieldErrors = {
  dividend?: string;
  discountRatePercent?: string;
  growthRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): PerpetuityInput {
  return {
    dividend: '1000',
    discountRatePercent: '10',
    growthRatePercent: '0',
    currency: 'PKR',
  };
}
