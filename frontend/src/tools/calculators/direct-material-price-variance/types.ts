import type { SupportedCurrency } from '@/tools/shared/currency';

export type VarianceStatus = 'favorable' | 'unfavorable' | 'none';

export interface DirectMaterialPriceVarianceInput {
  standardRate: number;
  actualRate: number;
  quantity: number;
  currency: SupportedCurrency;
}

export interface DirectMaterialPriceVarianceResult {
  standardRate: number;
  actualRate: number;
  quantity: number;
  variance: number;
  status: VarianceStatus;
  currency: SupportedCurrency;
  varianceDisplay: string;
}

export type DirectMaterialPriceVarianceFieldErrors = Record<string, string>;

export function createDefaultInput(): DirectMaterialPriceVarianceInput {
  return {
    standardRate: Number.NaN,
    actualRate: Number.NaN,
    quantity: Number.NaN,
    currency: 'PKR',
  };
}
