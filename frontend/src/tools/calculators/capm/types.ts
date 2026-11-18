export interface CapmInput {
  riskFreeRate: string;
  marketReturn: string;
  beta: string;
}

export interface CapmResult {
  assetRiskPremiumPercent: number;
  expectedReturnPercent: number;
  formattedAssetRiskPremium: string;
  formattedExpectedReturn: string;
}

export type CapmFieldErrors = {
  riskFreeRate?: string;
  marketReturn?: string;
  beta?: string;
  form?: string;
};

export function createDefaultInput(): CapmInput {
  return {
    riskFreeRate: '',
    marketReturn: '',
    beta: '',
  };
}
