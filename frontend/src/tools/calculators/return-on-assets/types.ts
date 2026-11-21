import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ReturnOnAssetsInput {
  netIncome: string;
  totalAssets: string;
  useAverageAssets: boolean;
  beginningAssets: string;
  endingAssets: string;
  currency: SupportedCurrency;
}

export interface ReturnOnAssetsResult {
  roaPercentage: number;
  profitPerAssetUnit: number;
  assetBase: number;
  usedAverageAssets: boolean;
  currency: SupportedCurrency;
  formattedRoa: string;
  formattedAssetBase: string;
  interpretation: string;
  explanation: string;
  warningMessage: string;
}

export type ReturnOnAssetsFieldErrors = {
  form?: string;
  netIncome?: string;
  totalAssets?: string;
  beginningAssets?: string;
  endingAssets?: string;
};

/** Reference: NI 150,000 · Assets 1,000,000 → ROA 15% */
export function createDefaultInput(): ReturnOnAssetsInput {
  return {
    netIncome: '150000',
    totalAssets: '1000000',
    useAverageAssets: false,
    beginningAssets: '900000',
    endingAssets: '1100000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): ReturnOnAssetsInput {
  return {
    netIncome: '',
    totalAssets: '',
    useAverageAssets: false,
    beginningAssets: '',
    endingAssets: '',
    currency,
  };
}
