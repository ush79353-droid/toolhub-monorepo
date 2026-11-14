import type { SupportedCurrency } from '@/tools/shared/currency';

export interface HedgeRatioInput {
  totalExposure: string;
  hedgePosition: string;
  currency: SupportedCurrency;
}

export interface HedgeRatioResult {
  hedgeRatioPercent: number;
  formattedHedgeRatio: string;
}

export type HedgeRatioFieldErrors = {
  totalExposure?: string;
  hedgePosition?: string;
  form?: string;
};

export function createDefaultInput(): HedgeRatioInput {
  return {
    totalExposure: '',
    hedgePosition: '',
    currency: 'PKR',
  };
}
