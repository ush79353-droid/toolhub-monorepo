export interface SortinoAssetDraft {
  averageReturn: string;
  downsideDeviation: string;
}

export interface SortinoRatioInput {
  riskFreeRate: string;
  asset1: SortinoAssetDraft;
  asset2: SortinoAssetDraft;
}

export interface SortinoAssetResult {
  sortinoRatio: number;
  formattedSortinoRatio: string;
}

export interface SortinoRatioResult {
  asset1: SortinoAssetResult | null;
  asset2: SortinoAssetResult | null;
}

export type SortinoRatioFieldErrors = {
  riskFreeRate?: string;
  asset1AverageReturn?: string;
  asset1DownsideDeviation?: string;
  asset2AverageReturn?: string;
  asset2DownsideDeviation?: string;
  form?: string;
};

export function emptyAsset(): SortinoAssetDraft {
  return { averageReturn: '', downsideDeviation: '' };
}

export function createDefaultInput(): SortinoRatioInput {
  return {
    riskFreeRate: '',
    asset1: emptyAsset(),
    asset2: emptyAsset(),
  };
}
