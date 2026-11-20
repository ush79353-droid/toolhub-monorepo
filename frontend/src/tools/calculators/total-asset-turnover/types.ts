import type { SupportedCurrency } from '@/tools/shared/currency';

export type TotalAssetTurnoverStatus =
  | 'valid'
  | 'partial'
  | 'incomplete'
  | 'invalid'
  | 'zeroAverageAssets';

export interface TotalAssetTurnoverInput {
  beginningAssets: string;
  endingAssets: string;
  revenue: string;
  currency: SupportedCurrency;
}

export interface TotalAssetTurnoverResult {
  beginningAssets: number;
  endingAssets: number;
  averageAssets: number;
  revenue: number | null;
  totalAssetTurnover: number | null;
  status: TotalAssetTurnoverStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedBeginningAssets: string;
  formattedEndingAssets: string;
  formattedAverageAssets: string;
  formattedRevenue: string | null;
  formattedTotalAssetTurnover: string | null;
}

export type TotalAssetTurnoverFieldErrors = {
  beginningAssets?: string;
  endingAssets?: string;
  revenue?: string;
  form?: string;
};

/** Screenshot fields start empty; PKR denomination. */
export function createDefaultInput(): TotalAssetTurnoverInput {
  return {
    beginningAssets: '',
    endingAssets: '',
    revenue: '',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): TotalAssetTurnoverInput {
  return {
    beginningAssets: '',
    endingAssets: '',
    revenue: '',
    currency,
  };
}
