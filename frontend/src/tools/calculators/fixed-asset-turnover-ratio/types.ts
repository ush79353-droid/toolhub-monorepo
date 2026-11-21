import type { SupportedCurrency } from '@/tools/shared/currency';

export type FixedAssetTurnoverStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroAverageFixedAssets'
  | 'negativeRevenue';

export interface FixedAssetTurnoverRatioInput {
  startingFixedAssets: string;
  finalFixedAssets: string;
  revenue: string;
  currency: SupportedCurrency;
}

export interface FixedAssetTurnoverRatioResult {
  startingFixedAssets: number;
  finalFixedAssets: number;
  averageFixedAssets: number;
  revenue: number;
  fixedAssetTurnover: number | null;
  /** Average Fixed Assets / Revenue when revenue ≠ 0. */
  fixedAssetIntensity: number | null;
  status: FixedAssetTurnoverStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedStartingFixedAssets: string;
  formattedFinalFixedAssets: string;
  formattedAverageFixedAssets: string;
  formattedRevenue: string;
  formattedFixedAssetTurnover: string | null;
  formattedFixedAssetIntensity: string | null;
}

export type FixedAssetTurnoverRatioFieldErrors = {
  startingFixedAssets?: string;
  finalFixedAssets?: string;
  revenue?: string;
  form?: string;
};

export function createDefaultInput(): FixedAssetTurnoverRatioInput {
  return {
    startingFixedAssets: '',
    finalFixedAssets: '',
    revenue: '',
    currency: 'PKR',
  };
}
